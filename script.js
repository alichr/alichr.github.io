// Dark mode toggle functionality
(function() {
    var themeToggle = document.getElementById('theme-toggle');
    var themeColorMeta = document.getElementById('theme-color-meta');

    function updateThemeColor() {
        var isDark = document.documentElement.classList.contains('dark-mode');
        themeColorMeta.setAttribute('content', isDark ? '#0d1117' : '#002b5e');
    }

    themeToggle.addEventListener('click', function() {
        document.documentElement.classList.toggle('dark-mode');
        var isDark = document.documentElement.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeColor();

        // Update chart colors
        if (typeof citationChart !== 'undefined') {
            var gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
            var tickColor = isDark ? '#c9d1d9' : '#333';
            citationChart.options.scales.y.grid.color = gridColor;
            citationChart.options.scales.y.ticks.color = tickColor;
            citationChart.options.scales.x.ticks.color = tickColor;
            citationChart.update();
        }
    });

    // Update theme color on load
    updateThemeColor();

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.documentElement.classList.add('dark-mode');
            } else {
                document.documentElement.classList.remove('dark-mode');
            }
            updateThemeColor();
        }
    });
})();

// Update copyright year
document.getElementById('current-year').textContent = new Date().getFullYear();

// Citation chart (wrapped in DOMContentLoaded since Chart.js is deferred)
var citationChart;
document.addEventListener('DOMContentLoaded', function() {
    var ctx = document.getElementById('citationChart').getContext('2d');
    var isDark = document.documentElement.classList.contains('dark-mode');

    // Generate gradient blue colors for bars (lighter to darker)
    var barCount = 10;
    var bgColors = [];
    var borderColors = [];
    var hoverColors = [];
    for (var i = 0; i < barCount; i++) {
        var t = i / (barCount - 1);
        var r = Math.round(180 - t * 150);
        var g = Math.round(210 - t * 80);
        var b = Math.round(255 - t * 30);
        bgColors.push('rgba(' + r + ',' + g + ',' + b + ',0.7)');
        borderColors.push('rgba(' + r + ',' + g + ',' + b + ',1)');
        hoverColors.push('rgba(' + r + ',' + g + ',' + b + ',0.9)');
    }

    citationChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
            datasets: [{
                label: 'Citations',
                data: [3, 5, 8, 25, 44, 113, 207, 228, 270, 15],
                backgroundColor: bgColors,
                borderColor: borderColors,
                borderWidth: 1,
                borderRadius: 5,
                hoverBackgroundColor: hoverColors
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            family: 'Montserrat'
                        },
                        color: isDark ? '#c9d1d9' : '#333'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Montserrat'
                        },
                        color: isDark ? '#c9d1d9' : '#333'
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            },
            hover: {
                mode: 'nearest',
                intersect: true
            }
        }
    });
});

// News toggle
(function() {
    var toggle = document.getElementById('news-toggle');
    var older = document.getElementById('news-older');
    if (toggle && older) {
        toggle.addEventListener('click', function() {
            var isExpanded = older.classList.toggle('expanded');
            toggle.setAttribute('aria-expanded', isExpanded);
            toggle.textContent = isExpanded ? 'Show less' : 'Show older news';
        });
    }
})();

// Scroll reveal animations
(function() {
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0, rootMargin: '0px 0px 100px 0px' });
        reveals.forEach(function(el) { observer.observe(el); });
    } else {
        reveals.forEach(function(el) { el.classList.add('visible'); });
    }
    // Safety fallback: ensure all sections are visible after 3s
    setTimeout(function() {
        reveals.forEach(function(el) { el.classList.add('visible'); });
    }, 3000);
})();

// Interactive sample questions for chatbot
document.addEventListener('DOMContentLoaded', function() {
    var sampleQuestions = document.querySelectorAll('.sample-question');
    var chatbotButton = document.querySelector('.chatbot-launch-button');

    sampleQuestions.forEach(function(question) {
        // Click handler
        question.addEventListener('click', function() {
            var self = this;
            self.style.transform = 'scale(0.95)';
            self.style.background = 'rgba(255, 255, 255, 0.4)';

            setTimeout(function() {
                self.style.transform = '';
                self.style.background = '';
            }, 150);

            setTimeout(function() {
                window.open(chatbotButton.href, '_blank');
            }, 200);
        });

        // Keyboard handler for accessibility
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
});

// Scroll-spy: highlight active section in nav
(function() {
    var sections = document.querySelectorAll('main section[aria-labelledby]');
    var navLinks = document.querySelectorAll('.section-nav a');

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var id = entry.target.querySelector('h2').id;
                    navLinks.forEach(function(link) {
                        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                    });
                }
            });
        }, { rootMargin: '-20% 0px -80% 0px' });

        sections.forEach(function(section) { observer.observe(section); });
    }
})();

// Publication topic filters
(function() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    var pubItems = document.querySelectorAll('.publications-list li[data-topic]');
    var yearHeadings = document.querySelectorAll('.publications-list h4');

    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var filter = this.getAttribute('data-filter');

            // Update active button
            filterBtns.forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');

            // Filter publications
            pubItems.forEach(function(item) {
                if (filter === 'all' || item.getAttribute('data-topic').indexOf(filter) !== -1) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });

            // Hide year headings with no visible papers
            yearHeadings.forEach(function(heading) {
                var ul = heading.nextElementSibling;
                if (ul && ul.tagName === 'UL') {
                    var visibleItems = ul.querySelectorAll('li:not([style*="display: none"])');
                    heading.style.display = visibleItems.length === 0 ? 'none' : '';
                    ul.style.display = visibleItems.length === 0 ? 'none' : '';
                }
            });
        });
    });
})();
