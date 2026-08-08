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

// Scroll progress bar
(function() {
    var progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    var ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                var docHeight = document.documentElement.scrollHeight - window.innerHeight;
                var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                progressBar.style.width = progress + '%';
                ticking = false;
            });
            ticking = true;
        }
    });
})();

// Count-up animation for metric numbers
document.addEventListener('DOMContentLoaded', function() {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function animateCountUp(el) {
        var target = parseInt(el.getAttribute('data-target'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        if (isNaN(target)) return;

        if (prefersReducedMotion) {
            el.textContent = target + suffix;
            return;
        }

        var duration = 1500;
        var startTime = null;

        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var elapsed = timestamp - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var easedProgress = easeOutQuart(progress);
            var current = Math.round(easedProgress * target);
            el.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    var countEls = document.querySelectorAll('.count-up');
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    animateCountUp(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0 });
        countEls.forEach(function(el) { observer.observe(el); });
    } else {
        countEls.forEach(function(el) {
            el.textContent = el.getAttribute('data-target') + (el.getAttribute('data-suffix') || '');
        });
    }
});

// Citation chart (wrapped in DOMContentLoaded since Chart.js is deferred)
var citationChart;
document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('citationChart');
    if (!canvas || typeof Chart === 'undefined') return;
    var ctx = canvas.getContext('2d');
    var isDark = document.documentElement.classList.contains('dark-mode');

    var chartData = {
        labels: ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
        datasets: [{
            label: 'Citations',
            data: [3, 5, 8, 25, 44, 114, 198, 230, 263, 125],
            borderWidth: 1,
            borderRadius: 5
        }]
    };

    // Generate gradient blue colors for bars (lighter to darker)
    var barCount = chartData.labels.length;
    var bgColors = [];
    var borderColors = [];
    var hoverColors = [];
    for (var i = 0; i < barCount; i++) {
        var t = barCount > 1 ? i / (barCount - 1) : 1;
        var r = Math.round(180 - t * 150);
        var g = Math.round(210 - t * 80);
        var b = Math.round(255 - t * 30);
        bgColors.push('rgba(' + r + ',' + g + ',' + b + ',0.7)');
        borderColors.push('rgba(' + r + ',' + g + ',' + b + ',1)');
        hoverColors.push('rgba(' + r + ',' + g + ',' + b + ',0.9)');
    }
    chartData.datasets[0].backgroundColor = bgColors;
    chartData.datasets[0].borderColor = borderColors;
    chartData.datasets[0].hoverBackgroundColor = hoverColors;

    citationChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
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
            // Use the real content height so long lists never get clipped
            older.style.maxHeight = isExpanded ? older.scrollHeight + 'px' : '';
            toggle.setAttribute('aria-expanded', isExpanded);
            toggle.textContent = isExpanded ? 'Show less' : 'Show older news';
        });
    }
})();

// Scroll reveal animations (including staggered reveals)
(function() {
    var reveals = document.querySelectorAll('.reveal, .reveal-stagger');
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
                window.open(chatbotButton.href, '_blank', 'noopener,noreferrer');
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
                    // A section may contain several headings (e.g. Education + Experience)
                    var ids = [];
                    entry.target.querySelectorAll('h2[id]').forEach(function(h) {
                        ids.push('#' + h.id);
                    });
                    navLinks.forEach(function(link) {
                        link.classList.toggle('active', ids.indexOf(link.getAttribute('href')) !== -1);
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

            // Filter publications (exact token match — 'vlm' must not match 'mllm')
            pubItems.forEach(function(item) {
                var topics = item.getAttribute('data-topic').split(' ');
                if (filter === 'all' || topics.indexOf(filter) !== -1) {
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
