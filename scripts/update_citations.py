#!/usr/bin/env python3
"""
Script to update Google Scholar citation data in index.html using SerpApi
Runs weekly via GitHub Actions
"""

import re
import os
import sys
import requests
from datetime import datetime

def fetch_citation_data(scholar_id, api_key):
    """Fetch citation data from Google Scholar via SerpApi"""
    try:
        url = "https://serpapi.com/search"
        params = {
            "engine": "google_scholar_author",
            "author_id": scholar_id,
            "api_key": api_key,
            "hl": "en"
        }

        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()

        # Extract citation metrics
        cited_by = data.get('cited_by', {})
        table = cited_by.get('table', [])

        # table[0] has citations, table[1] has h_index, table[2] has i10_index
        total_citations = table[0].get('citations', {}).get('all', 0) if len(table) > 0 else 0
        h_index = table[1].get('h_index', {}).get('all', 0) if len(table) > 1 else 0
        i10_index = table[2].get('i10_index', {}).get('all', 0) if len(table) > 2 else 0

        # Get citations per year from graph
        citations_per_year = {}
        graph_data = cited_by.get('graph', [])
        for item in graph_data:
            year = item.get('year')
            citations = item.get('citations')
            if year and citations is not None:
                citations_per_year[year] = citations

        return {
            'total_citations': total_citations,
            'h_index': h_index,
            'i10_index': i10_index,
            'citations_per_year': citations_per_year
        }
    except Exception as e:
        print(f"Error fetching data from SerpApi: {e}")
        if 'response' in locals():
            print(f"Response: {response.text}")
        return None

def update_html_file(file_path, citation_data):
    """Update the index.html file with new citation data"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Update total citations
        content = re.sub(
            r'(<span class="stat-label">Total Citations</span>\s*<span class="stat-value">)\d+',
            f'\\g<1>{citation_data["total_citations"]}',
            content,
            flags=re.DOTALL
        )

        # Update h-index
        content = re.sub(
            r'(<span class="stat-label">h-index</span>\s*<span class="stat-value">)\d+',
            f'\\g<1>{citation_data["h_index"]}',
            content,
            flags=re.DOTALL
        )

        # Update i10-index
        content = re.sub(
            r'(<span class="stat-label">i10-index</span>\s*<span class="stat-value">)\d+',
            f'\\g<1>{citation_data["i10_index"]}',
            content,
            flags=re.DOTALL
        )

        # Update chart data
        citations_per_year = citation_data['citations_per_year']
        years = sorted(citations_per_year.keys())

        if years:
            # Create labels and data arrays
            labels_str = ', '.join([f"'{year}'" for year in years])
            data_str = ', '.join([str(citations_per_year[year]) for year in years])

            # Update labels in the chart
            content = re.sub(
                r"(labels: \[)[^\]]*(\],)",
                f"\\g<1>{labels_str}\\g<2>",
                content
            )

            # Update data array in the chart
            content = re.sub(
                r"(data: \[)[^\]]*(\],\s*//[^\n]*)",
                f"\\g<1>{data_str}\\g<2>",
                content
            )

        # Write updated content
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"✓ Successfully updated citation data")
        print(f"  Total Citations: {citation_data['total_citations']}")
        print(f"  h-index: {citation_data['h_index']}")
        print(f"  i10-index: {citation_data['i10_index']}")
        print(f"  Years with data: {len(years)}")
        if years:
            print(f"  Year range: {min(years)} - {max(years)}")

        return True

    except Exception as e:
        print(f"Error updating HTML file: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Main function"""
    # Your Google Scholar ID
    scholar_id = 'QT0EXIkAAAAJ'
    html_file = 'index.html'

    # Get API key from environment variable
    api_key = os.environ.get('SERPAPI_KEY')
    if not api_key:
        print("Error: SERPAPI_KEY environment variable not set")
        sys.exit(1)

    print(f"Fetching citation data for scholar ID: {scholar_id}")
    citation_data = fetch_citation_data(scholar_id, api_key)

    if citation_data is None:
        print("Failed to fetch citation data")
        sys.exit(1)

    print(f"\nUpdating {html_file}...")
    success = update_html_file(html_file, citation_data)

    if not success:
        sys.exit(1)

    print("\nDone! Citation data updated successfully.")

if __name__ == '__main__':
    main()
