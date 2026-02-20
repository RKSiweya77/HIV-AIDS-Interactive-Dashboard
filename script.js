// Global HIV/AIDS Dashboard
class HIVDashboard {
    constructor() {
        this.currentRegion = 'global';
        this.currentYear = '2022';
        this.currentMetric = 'prevalence';
        this.charts = {};
        this.countryData = [];
        
        // UNAIDS/WHO HIV data (simulated - in production, use actual API)
        this.data = {
            global: this.generateGlobalData(),
            regions: this.generateRegionalData(),
            countries: this.generateCountryData()
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadDashboard();
        this.initializeCharts();
        this.populateCountryTable();
    }
    
    setupEventListeners() {
        // Region selector
        document.getElementById('region-select').addEventListener('change', (e) => {
            this.currentRegion = e.target.value;
            this.updateDashboard();
        });
        
        // Year selector
        document.getElementById('year-select').addEventListener('change', (e) => {
            this.currentYear = e.target.value;
            this.updateDashboard();
        });
        
        // Metric buttons
        document.querySelectorAll('.metric-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.metric-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentMetric = e.target.dataset.metric;
                this.updateCharts();
            });
        });
        
        // Compare button
        document.getElementById('compare-btn').addEventListener('click', () => {
            this.toggleComparisonMode();
        });
        
        // Toggle chart/map
        document.getElementById('toggle-chart').addEventListener('click', () => {
            this.toggleChartView();
        });
        
        // Search functionality
        document.getElementById('country-search').addEventListener('input', (e) => {
            this.filterCountryTable(e.target.value);
        });
        
        // Sort functionality
        document.getElementById('sort-by').addEventListener('change', (e) => {
            this.sortCountryTable(e.target.value);
        });
    }
    
    loadDashboard() {
        this.updateHeaderStats();
        this.updateIndicators();
        this.updateLastUpdate();
    }
    
    updateDashboard() {
        this.updateHeaderStats();
        this.updateIndicators();
        this.updateCharts();
    }
    
    // Data generation (in a real app, this would come from an API)
    generateGlobalData() {
        const years = Array.from({length: 23}, (_, i) => 2000 + i);
        
        return {
            prevalence: years.map(year => {
                // Global prevalence decreasing from 0.8% to 0.7%
                const base = 0.8;
                const trend = -0.005 * (year - 2000);
                const random = Math.random() * 0.02 - 0.01;
                return (base + trend + random).toFixed(3);
            }),
            plhiv: years.map(year => {
                // People living with HIV (in millions)
                const base = 26;
                const growth = (year - 2000) * 0.6;
                return (base + growth).toFixed(1);
            }),
            incidence: years.map(year => {
                // New infections (in millions)
                const base = 3.0;
                const decline = (year - 2000) * 0.08;
                return Math.max(1.3, (base - decline).toFixed(2));
            }),
            artCoverage: years.map(year => {
                // ART coverage (%)
                if (year < 2003) return 2;
                const base = year === 2003 ? 2 : null;
                const growth = (year - 2003) * 3.5;
                return Math.min(76, (2 + growth)).toFixed(1);
            }),
            mortality: years.map(year => {
                // AIDS-related deaths (in millions)
                const base = 1.7;
                const decline = (year - 2000) * 0.05;
                return Math.max(0.63, (base - decline).toFixed(2));
            })
        };
    }
    
    generateRegionalData() {
        const regions = {
            africa: {
                name: 'Africa',
                prevalence: 3.6,
                plhiv: 25.6,
                incidence: 0.82,
                artCoverage: 71,
                mortality: 0.42,
                color: '#e74c3c'
            },
            asia: {
                name: 'Asia & Pacific',
                prevalence: 0.2,
                plhiv: 6.0,
                incidence: 0.24,
                artCoverage: 68,
                mortality: 0.14,
                color: '#2ecc71'
            },
            europe: {
                name: 'Europe & Central Asia',
                prevalence: 0.5,
                plhiv: 2.4,
                incidence: 0.16,
                artCoverage: 65,
                mortality: 0.04,
                color: '#3498db'
            },
            americas: {
                name: 'Americas',
                prevalence: 0.5,
                plhiv: 3.5,
                incidence: 0.12,
                artCoverage: 82,
                mortality: 0.03,
                color: '#f39c12'
            },
            mena: {
                name: 'Middle East & North Africa',
                prevalence: 0.1,
                plhiv: 0.9,
                incidence: 0.04,
                artCoverage: 40,
                mortality: 0.02,
                color: '#9b59b6'
            }
        };
        
        // Add trend data for each region
        Object.keys(regions).forEach(region => {
            regions[region].trend = Array.from({length: 23}, (_, i) => {
                const base = regions[region].prevalence * 1.5;
                const decline = i * 0.1;
                const random = Math.random() * 0.2 - 0.1;
                return (base - decline + random).toFixed(2);
            });
        });
        
        return regions;
    }
    
    generateCountryData() {
        const countries = [
            { name: 'South Africa', region: 'africa', plhiv: 7.8, prevalence: 19.0, incidence: 200000, artCoverage: 71, mortality: 72000, progress: 85 },
            { name: 'Nigeria', region: 'africa', plhiv: 1.8, prevalence: 1.3, incidence: 74000, artCoverage: 65, mortality: 51000, progress: 72 },
            { name: 'Mozambique', region: 'africa', plhiv: 2.1, prevalence: 12.5, incidence: 150000, artCoverage: 69, mortality: 38000, progress: 78 },
            { name: 'India', region: 'asia', plhiv: 2.4, prevalence: 0.2, incidence: 63000, artCoverage: 77, mortality: 42000, progress: 81 },
            { name: 'Indonesia', region: 'asia', plhiv: 0.54, prevalence: 0.3, incidence: 27000, artCoverage: 32, mortality: 26000, progress: 45 },
            { name: 'Brazil', region: 'americas', plhiv: 0.96, prevalence: 0.5, incidence: 48000, artCoverage: 81, mortality: 13000, progress: 88 },
            { name: 'United States', region: 'americas', plhiv: 1.2, prevalence: 0.3, incidence: 34000, artCoverage: 75, mortality: 13000, progress: 82 },
            { name: 'Russia', region: 'europe', plhiv: 1.1, prevalence: 0.7, incidence: 71000, artCoverage: 53, mortality: 37000, progress: 61 },
            { name: 'Ukraine', region: 'europe', plhiv: 0.26, prevalence: 0.9, incidence: 15000, artCoverage: 61, mortality: 5500, progress: 68 },
            { name: 'Kenya', region: 'africa', plhiv: 1.4, prevalence: 4.0, incidence: 32000, artCoverage: 89, mortality: 19000, progress: 92 },
            { name: 'Zimbabwe', region: 'africa', plhiv: 1.3, prevalence: 11.9, incidence: 29000, artCoverage: 90, mortality: 20000, progress: 94 },
            { name: 'Thailand', region: 'asia', plhiv: 0.55, prevalence: 1.0, incidence: 6400, artCoverage: 84, mortality: 14000, progress: 87 },
            { name: 'Vietnam', region: 'asia', plhiv: 0.25, prevalence: 0.3, incidence: 12000, artCoverage: 76, mortality: 3800, progress: 79 },
            { name: 'Mexico', region: 'americas', plhiv: 0.34, prevalence: 0.3, incidence: 13000, artCoverage: 67, mortality: 4600, progress: 73 },
            { name: 'Colombia', region: 'americas', plhiv: 0.17, prevalence: 0.4, incidence: 7300, artCoverage: 71, mortality: 2500, progress: 76 }
        ];
        
        return countries;
    }
    
    updateHeaderStats() {
        const regionData = this.currentRegion === 'global' 
            ? { plhiv: 38.4, art: 29.8 }
            : this.data.regions[this.currentRegion];
        
        document.getElementById('global-plhiv').textContent = 
            regionData.plhiv ? `${regionData.plhiv}M` : '38.4M';
        
        if (this.currentRegion === 'global') {
            document.getElementById('global-art').textContent = '29.8M';
        } else {
            const artValue = (regionData.plhiv * regionData.artCoverage / 100).toFixed(1);
            document.getElementById('global-art').textContent = `${artValue}M`;
        }
    }
    
    updateIndicators() {
        const regionData = this.currentRegion === 'global' 
            ? { prevalence: 0.7, incidence: 1.3, artCoverage: 76, mortality: 0.63 }
            : this.data.regions[this.currentRegion];
        
        document.getElementById('prevalence-value').textContent = 
            `${regionData.prevalence}%`;
        document.getElementById('incidence-value').textContent = 
            this.formatNumber(regionData.incidence * 1000000);
        document.getElementById('art-value').textContent = 
            `${regionData.artCoverage}%`;
        document.getElementById('mortality-value').textContent = 
            this.formatNumber(regionData.mortality * 1000000);
    }
    
    initializeCharts() {
        this.createTrendChart();
        this.createRegionalChart();
        this.createTargetsChart();
    }
    
    createTrendChart() {
        const ctx = document.getElementById('trendChart').getContext('2d');
        const years = Array.from({length: 23}, (_, i) => 2000 + i);
        
        this.charts.trend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [
                    {
                        label: 'Global',
                        data: this.data.global.prevalence,
                        borderColor: '#2c3e50',
                        backgroundColor: 'rgba(44, 62, 80, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Africa',
                        data: this.data.regions.africa.trend,
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: 'Asia & Pacific',
                        data: this.data.regions.asia.trend,
                        borderColor: '#2ecc71',
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                        }
                    },
                    title: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.y}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Prevalence (%)'
                        },
                        grid: {
                            drawBorder: false
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Year'
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                }
            }
        });
    }
    
    createRegionalChart() {
        const ctx = document.getElementById('regionalChart').getContext('2d');
        const regions = this.data.regions;
        
        this.charts.regional = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.values(regions).map(r => r.name),
                datasets: [{
                    data: Object.values(regions).map(r => r.plhiv),
                    backgroundColor: Object.values(regions).map(r => r.color),
                    borderWidth: 3,
                    borderColor: '#ffffff',
                    hoverOffset: 20
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${context.label}: ${value}M (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }
    
    createTargetsChart() {
        const ctx = document.getElementById('targetsChart').getContext('2d');
        const countries = ['Botswana', 'Eswatini', 'Rwanda', 'Zimbabwe', 'Kenya', 'Namibia', 'Malawi', 'Global'];
        const diagnosed = [95, 94, 92, 90, 87, 86, 85, 86];
        const onTreatment = [98, 95, 90, 93, 91, 88, 87, 76];
        const suppressed = [98, 94, 90, 92, 89, 87, 86, 71];
        
        this.charts.targets = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: countries,
                datasets: [
                    {
                        label: 'Diagnosed',
                        data: diagnosed,
                        backgroundColor: '#3498db',
                        borderColor: '#2980b9',
                        borderWidth: 1
                    },
                    {
                        label: 'On Treatment',
                        data: onTreatment,
                        backgroundColor: '#2ecc71',
                        borderColor: '#27ae60',
                        borderWidth: 1
                    },
                    {
                        label: 'Virally Suppressed',
                        data: suppressed,
                        backgroundColor: '#9b59b6',
                        borderColor: '#8e44ad',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Percentage (%)'
                        },
                        grid: {
                            drawBorder: false
                        }
                    }
                }
            }
        });
    }
    
    updateCharts() {
        // Update trend chart based on selected metric
        if (this.charts.trend) {
            const metricData = this.getMetricData();
            this.charts.trend.data.datasets[0].data = metricData;
            this.charts.trend.update();
        }
    }
    
    getMetricData() {
        switch(this.currentMetric) {
            case 'prevalence':
                return this.data.global.prevalence;
            case 'incidence':
                return this.data.global.incidence;
            case 'art':
                return this.data.global.artCoverage;
            case 'mortality':
                return this.data.global.mortality;
            default:
                return this.data.global.prevalence;
        }
    }
    
    populateCountryTable() {
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '';
        
        this.data.countries.forEach(country => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>
                    <div class="country-info">
                        <span class="country-name">${country.name}</span>
                        <span class="country-region">${country.region}</span>
                    </div>
                </td>
                <td>${this.formatNumber(country.plhiv * 1000000)}</td>
                <td><strong>${country.prevalence}%</strong></td>
                <td>${this.formatNumber(country.incidence)}</td>
                <td>
                    <div class="progress-cell">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${country.artCoverage}%"></div>
                        </div>
                        <span>${country.artCoverage}%</span>
                    </div>
                </td>
                <td>${this.formatNumber(country.mortality)}</td>
                <td>
                    <div class="progress-cell">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${country.progress}%"></div>
                        </div>
                        <span>${country.progress}%</span>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    }
    
    filterCountryTable(searchTerm) {
        const rows = document.querySelectorAll('#table-body tr');
        const searchLower = searchTerm.toLowerCase();
        
        rows.forEach(row => {
            const countryName = row.querySelector('.country-name').textContent.toLowerCase();
            const region = row.querySelector('.country-region').textContent.toLowerCase();
            
            if (countryName.includes(searchLower) || region.includes(searchLower)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    sortCountryTable(sortBy) {
        this.data.countries.sort((a, b) => {
            switch(sortBy) {
                case 'prevalence':
                    return b.prevalence - a.prevalence;
                case 'incidence':
                    return b.incidence - a.incidence;
                case 'art':
                    return b.artCoverage - a.artCoverage;
                case 'plhiv':
                    return b.plhiv - a.plhiv;
                default:
                    return 0;
            }
        });
        
        this.populateCountryTable();
    }
    
    toggleComparisonMode() {
        const compareBtn = document.getElementById('compare-btn');
        const isComparing = compareBtn.classList.toggle('comparing');
        
        if (isComparing) {
            compareBtn.innerHTML = '<i class="fas fa-times"></i> Exit Comparison';
            compareBtn.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
            this.showComparisonView();
        } else {
            compareBtn.innerHTML = '<i class="fas fa-balance-scale"></i> Compare Regions';
            compareBtn.style.background = 'linear-gradient(135deg, var(--secondary) 0%, #8e44ad 100%)';
            this.hideComparisonView();
        }
    }
    
    showComparisonView() {
        // This would show a comparison view in a real implementation
        this.showNotification('Comparison mode activated. Select up to 3 regions to compare.');
    }
    
    hideComparisonView() {
        this.showNotification('Exited comparison mode.');
    }
    
    toggleChartView() {
        const chartCanvas = document.getElementById('regionalChart');
        const mapContainer = document.getElementById('map-container');
        const toggleBtn = document.getElementById('toggle-chart');
        
        if (chartCanvas.style.display !== 'none') {
            chartCanvas.style.display = 'none';
            mapContainer.classList.remove('hidden');
            toggleBtn.innerHTML = '<i class="fas fa-chart-pie"></i> Switch to Chart';
        } else {
            chartCanvas.style.display = 'block';
            mapContainer.classList.add('hidden');
            toggleBtn.innerHTML = '<i class="fas fa-exchange-alt"></i> Switch to Map';
        }
    }
    
    updateLastUpdate() {
        const now = new Date();
        const options = { year: 'numeric', month: 'long' };
        document.getElementById('last-update').textContent = now.toLocaleDateString('en-US', options);
    }
    
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString();
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 30px;
            right: 30px;
            background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#2ecc71' : '#3498db'};
            color: white;
            padding: 18px 28px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 1000;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 15px;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;
        
        const icon = type === 'error' ? 'fa-exclamation-triangle' : 
                    type === 'success' ? 'fa-check-circle' : 'fa-info-circle';
        
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 4 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new HIVDashboard();
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .country-info {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .country-name {
            font-weight: 600;
            color: #2c3e50;
        }
        
        .country-region {
            font-size: 0.85rem;
            color: #95a5a6;
            text-transform: capitalize;
        }
    `;
    document.head.appendChild(style);
});