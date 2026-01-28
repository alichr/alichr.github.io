# Ali Cheraghian - Personal Website

Personal academic portfolio website showcasing research, publications, and professional background.

## Automated Citation Updates

This website automatically updates Google Scholar citation metrics every week using GitHub Actions and SerpApi.

### Current Citation Stats
- **Total Citations**: 925
- **h-index**: 12
- **i10-index**: 13
- **Last Updated**: Automatically updated weekly

### Setup Instructions

#### 1. Add API Key to GitHub Secrets

To enable automated updates, you need to add your SerpApi key as a GitHub Secret:

1. Go to your GitHub repository: `https://github.com/alichr/alichr.github.io`
2. Click on **Settings** (top menu)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click the green **New repository secret** button
5. Fill in:
   - **Name**: `SERPAPI_KEY`
   - **Secret**: `072a2e4adf24161f35833e11b1ec6d8711a1bdc5456323c05c064e3fc3712bc3`
6. Click **Add secret**

#### 2. Enable GitHub Actions (if not already enabled)

1. Go to the **Actions** tab in your repository
2. If prompted, click **"I understand my workflows, go ahead and enable them"**

#### 3. Test the Workflow (Optional)

To manually trigger an update right away:

1. Go to **Actions** tab
2. Click on **"Update Citation Data"** workflow
3. Click **"Run workflow"** dropdown
4. Click the green **"Run workflow"** button

Your citation data will be updated within a minute!

### How It Works

- **Automatic Updates**: Runs every Sunday at 2 AM UTC
- **Manual Trigger**: Can be triggered anytime from the Actions tab
- **What Gets Updated**:
  - Total citations count
  - h-index
  - i10-index
  - Citation graph (citations per year)
- **Auto-Commit**: Automatically commits changes if data has changed

### Technical Details

#### Files Structure

```
.
├── .github/
│   └── workflows/
│       └── update-citations.yml    # GitHub Actions workflow
├── scripts/
│   └── update_citations.py         # Python script that fetches and updates data
├── index.html                      # Main website file
└── README.md                       # This file
```

#### Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript
- **Charts**: Chart.js for citation visualization
- **Fonts**: Google Fonts (Montserrat)
- **Chatbot**: Hugging Face Spaces integration
- **Data Source**: SerpApi for Google Scholar data
- **Automation**: GitHub Actions

#### Workflow Schedule

The workflow runs on a cron schedule:
- **Schedule**: `0 2 * * 0` (Every Sunday at 2 AM UTC)
- **Frequency**: Weekly updates
- **Cost**: Free (SerpApi free tier: 100 searches/month)

### Local Development

To run the website locally:

```bash
# Simple HTTP server
python -m http.server 8000

# Then visit: http://localhost:8000
```

To test the citation update script locally:

```bash
# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install requests

# Run the script
SERPAPI_KEY=your_api_key_here python scripts/update_citations.py
```

### Troubleshooting

**Citations not updating?**
1. Check that `SERPAPI_KEY` secret is properly set in repository settings
2. Go to Actions tab and check if workflow is running successfully
3. Look at workflow logs for any error messages

**Want to change update frequency?**
Edit the cron schedule in `.github/workflows/update-citations.yml`:
- Daily: `0 2 * * *`
- Twice weekly: `0 2 * * 0,3` (Sunday and Wednesday)
- Monthly: `0 2 1 * *`

## License

Personal website - All rights reserved.
