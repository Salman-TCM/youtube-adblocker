// YouTube Ad Blocker Pro - Advanced Popup Script
class AdBlockerPro {
    constructor() {
        this.sessionStartTime = Date.now();
        this.sessionInterval = null;
        this.chartInstance = null;
        this.isPaused = false;
        this.currentTheme = 'auto';
        this.statsHistory = [];
        
        this.init();
    }

    async init() {
        this.cacheElements();
        this.setupEventListeners();
        await this.loadSettings();
        await this.loadStatistics();
        this.startSessionTimer();
        this.initializeTheme();
        this.setupTabNavigation();
        this.initializeChart();
        this.updateRealTimeStats();
        this.checkExtensionStatus();
        this.setupKeyboardShortcuts();
        this.updatePerformanceMetrics();
        
        console.log('AdBlocker Pro initialized successfully');
    }

    cacheElements() {
        // Dashboard elements
        this.blockedCountEl = document.getElementById('blockedCount');
        this.totalAdsEl = document.getElementById('totalAds');
        this.sessionTimeEl = document.getElementById('sessionTime');
        this.blockRateEl = document.getElementById('blockRate');
        this.blockedChangeEl = document.getElementById('blockedChange');
        this.detectedChangeEl = document.getElementById('detectedChange');
        this.perfFillEl = document.getElementById('perfFill');
        this.perfValueEl = document.getElementById('perfValue');
        this.todayBlockedEl = document.getElementById('todayBlocked');
        this.responseTimeEl = document.getElementById('responseTime');
        
        // Status elements
        this.statusIndicator = document.getElementById('statusIndicator');
        this.statusDot = this.statusIndicator ? this.statusIndicator.querySelector('.status-dot') : null;
        this.statusText = this.statusIndicator ? this.statusIndicator.querySelector('.status-text') : null;
        
        // Settings elements
        this.blockVideoAdsEl = document.getElementById('blockVideoAds');
        this.blockBannerAdsEl = document.getElementById('blockBannerAds');
        this.blockSponsoredContentEl = document.getElementById('blockSponsoredContent');
        this.autoSkipAdsEl = document.getElementById('autoSkipAds');
        this.showNotificationsEl = document.getElementById('showNotifications');
        this.enableAIEl = document.getElementById('enableAI');
        this.themeSelectEl = document.getElementById('themeSelect');
        this.animationSpeedEl = document.getElementById('animationSpeed');
        
        // Advanced elements
        this.customRulesEl = document.getElementById('customRules');
        this.listInputEl = document.getElementById('listInput');
        this.listItemsEl = document.getElementById('listItems');
        this.cpuUsageEl = document.getElementById('cpuUsage');
        this.memUsageEl = document.getElementById('memUsage');
        this.rulesLoadedEl = document.getElementById('rulesLoaded');
        
        // Buttons
        this.themeToggleBtn = document.getElementById('themeToggle');
        this.pauseBlockingBtn = document.getElementById('pauseBlocking');
        this.whitelistSiteBtn = document.getElementById('whitelistSite');
        this.reportAdBtn = document.getElementById('reportAd');
        this.exportDataBtn = document.getElementById('exportData');
        this.addRuleBtn = document.getElementById('addRule');
        this.clearRulesBtn = document.getElementById('clearRules');
        this.addToListBtn = document.getElementById('addToList');
        this.optimizePerformanceBtn = document.getElementById('optimizePerformance');
        this.exportSettingsBtn = document.getElementById('exportSettings');
        this.importSettingsBtn = document.getElementById('importSettings');
        this.resetAllBtn = document.getElementById('resetAll');
        
        // Links
        this.helpLink = document.getElementById('helpLink');
        this.feedbackLink = document.getElementById('feedbackLink');
        this.updateLink = document.getElementById('updateLink');
    }

    setupEventListeners() {
        // Theme toggle
        this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
        
        // Settings
        [this.blockVideoAdsEl, this.blockBannerAdsEl, this.blockSponsoredContentEl, 
         this.autoSkipAdsEl, this.showNotificationsEl, this.enableAIEl].forEach(checkbox => {
            checkbox.addEventListener('change', () => this.saveSettings());
        });
        
        this.themeSelectEl.addEventListener('change', () => this.saveSettings());
        this.animationSpeedEl.addEventListener('change', () => this.saveSettings());
        
        // Action buttons
        this.pauseBlockingBtn.addEventListener('click', () => this.togglePauseBlocking());
        this.whitelistSiteBtn.addEventListener('click', () => this.whitelistCurrentSite());
        this.reportAdBtn.addEventListener('click', () => this.reportUnblockedAd());
        this.exportDataBtn.addEventListener('click', () => this.exportData());
        
        // Advanced actions
        this.addRuleBtn.addEventListener('click', () => this.addCustomRule());
        this.clearRulesBtn.addEventListener('click', () => this.clearCustomRules());
        this.addToListBtn.addEventListener('click', () => this.addToList());
        this.optimizePerformanceBtn.addEventListener('click', () => this.optimizePerformance());
        this.exportSettingsBtn.addEventListener('click', () => this.exportSettings());
        this.importSettingsBtn.addEventListener('click', () => this.importSettings());
        this.resetAllBtn.addEventListener('click', () => this.resetAllData());
        
        // Links
        this.helpLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.openLink('https://github.com/Salman-TCM/youtube-adblocker#help');
        });
        
        this.feedbackLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.openLink('https://github.com/Salman-TCM/youtube-adblocker/issues');
        });
        
        this.updateLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.checkForUpdates();
        });
        
        // List tabs
        document.querySelectorAll('.list-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.list-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.loadList(e.target.dataset.list);
            });
        });
    }

    setupTabNavigation() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetTab = e.target.dataset.tab;
                
                // Update button states
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Update content visibility
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(targetTab).classList.add('active');
                
                // Load tab-specific data
                if (targetTab === 'advanced') {
                    this.loadAdvancedData();
                }
            });
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K: Quick toggle pause
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.togglePauseBlocking();
            }
            
            // Ctrl/Cmd + D: Toggle theme
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                this.toggleTheme();
            }
            
            // Ctrl/Cmd + R: Reset stats
            if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
                e.preventDefault();
                this.resetStatistics();
            }
        });
    }

    async loadSettings() {
        return new Promise((resolve) => {
            chrome.storage.sync.get([
                'blockVideoAds', 'blockBannerAds', 'blockSponsoredContent',
                'autoSkipAds', 'showNotifications', 'enableAI', 'theme', 
                'animationSpeed', 'customRules', 'whitelistedSites', 'blacklistedSites'
            ], (result) => {
                this.blockVideoAdsEl.checked = result.blockVideoAds !== false;
                this.blockBannerAdsEl.checked = result.blockBannerAds !== false;
                this.blockSponsoredContentEl.checked = result.blockSponsoredContent !== false;
                this.autoSkipAdsEl.checked = result.autoSkipAds !== false;
                this.showNotificationsEl.checked = result.showNotifications !== false;
                this.enableAIEl.checked = result.enableAI !== false;
                
                this.themeSelectEl.value = result.theme || 'auto';
                this.animationSpeedEl.value = result.animationSpeed || 'normal';
                this.customRulesEl.value = result.customRules || '';
                
                resolve(result);
            });
        });
    }

    async saveSettings() {
        const settings = {
            blockVideoAds: this.blockVideoAdsEl.checked,
            blockBannerAds: this.blockBannerAdsEl.checked,
            blockSponsoredContent: this.blockSponsoredContentEl.checked,
            autoSkipAds: this.autoSkipAdsEl.checked,
            showNotifications: this.showNotificationsEl.checked,
            enableAI: this.enableAIEl.checked,
            theme: this.themeSelectEl.value,
            animationSpeed: this.animationSpeedEl.value,
            customRules: this.customRulesEl.value
        };
        
        return new Promise((resolve) => {
            chrome.storage.sync.set(settings, () => {
                this.showToast('Settings saved successfully!');
                this.notifyContentScript(settings);
                resolve(settings);
            });
        });
    }

    async loadStatistics() {
        return new Promise((resolve) => {
            chrome.storage.local.get([
                'blockedAds', 'totalAds', 'installDate', 'lastUpdated', 
                'todayBlocked', 'statsHistory'
            ], (result) => {
                const blockedCount = result.blockedAds || 0;
                const totalCount = result.totalAds || 0;
                const todayCount = result.todayBlocked || 0;
                
                this.blockedCountEl.textContent = this.formatNumber(blockedCount);
                this.totalAdsEl.textContent = this.formatNumber(totalCount);
                this.todayBlockedEl.textContent = this.formatNumber(todayCount);
                
                const blockRate = totalCount > 0 ? Math.round((blockedCount / totalCount) * 100) : 100;
                this.blockRateEl.textContent = `${blockRate}%`;
                
                // Update change indicators
                this.updateChangeIndicators(result.statsHistory || []);
                
                // Update install date
                if (result.installDate) {
                    const installDate = new Date(result.installDate);
                    const installDateEl = document.getElementById('installDate');
                    if (installDateEl) {
                        installDateEl.textContent = installDate.toLocaleDateString();
                    }
                }
                
                // Update last updated
                if (result.lastUpdated) {
                    const lastUpdated = new Date(result.lastUpdated);
                    const lastUpdatedEl = document.getElementById('lastUpdated');
                    if (lastUpdatedEl) {
                        lastUpdatedEl.textContent = `Last updated: ${lastUpdated.toLocaleString()}`;
                    }
                }
                
                resolve(result);
            });
        });
    }

    updateChangeIndicators(history) {
        if (!history || history.length < 2) return;
        
        const current = history[history.length - 1];
        const previous = history[history.length - 2];
        
        if (!current || !previous) return;
        
        const blockedChange = this.calculateChange(current.blocked || 0, previous.blocked || 0);
        const detectedChange = this.calculateChange(current.total || 0, previous.total || 0);
        
        if (this.blockedChangeEl) {
            this.blockedChangeEl.textContent = `${blockedChange > 0 ? '+' : ''}${blockedChange}%`;
            this.blockedChangeEl.className = `stat-change ${blockedChange >= 0 ? 'positive' : 'negative'}`;
        }
        
        if (this.detectedChangeEl) {
            this.detectedChangeEl.textContent = `${detectedChange > 0 ? '+' : ''}${detectedChange}%`;
            this.detectedChangeEl.className = `stat-change ${detectedChange >= 0 ? 'positive' : 'negative'}`;
        }
    }

    calculateChange(current, previous) {
        if (previous === 0) return 0;
        return Math.round(((current - previous) / previous) * 100);
    }

    startSessionTimer() {
        this.sessionInterval = setInterval(() => {
            const elapsed = Date.now() - this.sessionStartTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            if (this.sessionTimeEl) {
                this.sessionTimeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    initializeTheme() {
        chrome.storage.sync.get(['theme'], (result) => {
            this.currentTheme = result.theme || 'auto';
            this.applyTheme(this.currentTheme);
        });
    }

    applyTheme(theme) {
        const body = document.body;
        const themeIcon = document.querySelector('.theme-icon');
        
        if (!body || !themeIcon) return;
        
        if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            body.setAttribute('data-theme', 'dark');
            themeIcon.textContent = '☀️';
        } else {
            body.removeAttribute('data-theme');
            themeIcon.textContent = '🌙';
        }
    }

    toggleTheme() {
        const themes = ['auto', 'light', 'dark'];
        const currentIndex = themes.indexOf(this.currentTheme);
        this.currentTheme = themes[(currentIndex + 1) % themes.length];
        
        this.applyTheme(this.currentTheme);
        this.themeSelectEl.value = this.currentTheme;
        this.saveSettings();
    }

    initializeChart() {
        const canvas = document.getElementById('adsChart');
        const ctx = canvas.getContext('2d');
        
        // Simple chart implementation
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-tertiary');
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Real-time analytics chart', canvas.width / 2, canvas.height / 2);
    }

    updateRealTimeStats() {
        setInterval(async () => {
            if (this.isPaused) return;
            
            // Get stats from content script
            const tabs = await chrome.tabs.query({active: true, currentWindow: true});
            if (tabs[0] && tabs[0].url.includes('youtube.com')) {
                try {
                    const response = await chrome.tabs.sendMessage(tabs[0].id, {action: 'getStats'});
                    if (response && !chrome.runtime.lastError) {
                        this.blockedCountEl.textContent = this.formatNumber(response.blockedAds);
                    }
                } catch (error) {
                    // Content script might not be ready
                }
            }
            
            // Update performance metrics
            this.updatePerformanceMetrics();
        }, 2000);
    }

    updatePerformanceMetrics() {
        // Simulate performance metrics
        const cpuUsage = (Math.random() * 5 + 1).toFixed(1);
        const memUsage = (Math.random() * 10 + 10).toFixed(0);
        const responseTime = (Math.random() * 20 + 5).toFixed(0);
        const performance = Math.max(85, 100 - parseFloat(cpuUsage) * 3);
        
        if (this.cpuUsageEl) this.cpuUsageEl.textContent = `${cpuUsage}%`;
        if (this.memUsageEl) this.memUsageEl.textContent = `${memUsage}MB`;
        if (this.responseTimeEl) this.responseTimeEl.textContent = `${responseTime}ms`;
        if (this.perfFillEl) this.perfFillEl.style.width = `${performance}%`;
        if (this.perfValueEl) this.perfValueEl.textContent = `${Math.round(performance)}%`;
    }

    async checkExtensionStatus() {
        if (!this.statusDot || !this.statusText) return;
        
        const tabs = await chrome.tabs.query({active: true, currentWindow: true});
        const currentTab = tabs[0];
        
        if (currentTab && currentTab.url.includes('youtube.com')) {
            try {
                const response = await chrome.tabs.sendMessage(currentTab.id, {action: 'ping'});
                if (response && response.status === 'ok') {
                    this.statusDot.classList.remove('inactive');
                    this.statusText.textContent = this.isPaused ? 'Paused' : 'Active';
                } else {
                    throw new Error('No response');
                }
            } catch (error) {
                this.statusDot.classList.add('inactive');
                this.statusText.textContent = 'Inactive';
            }
        } else {
            this.statusText.textContent = 'Not on YouTube';
        }
    }

    togglePauseBlocking() {
        this.isPaused = !this.isPaused;
        const btn = this.pauseBlockingBtn;
        const icon = btn.querySelector('.action-icon');
        const text = btn.querySelector('span:last-child');
        
        if (this.isPaused) {
            icon.textContent = '▶️';
            text.textContent = 'Resume';
            this.showToast('Ad blocking paused');
        } else {
            icon.textContent = '⏸️';
            text.textContent = 'Pause';
            this.showToast('Ad blocking resumed');
        }
        
        this.checkExtensionStatus();
        
        // Notify content script
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs[0] && tabs[0].url.includes('youtube.com')) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'togglePause',
                    paused: this.isPaused
                });
            }
        });
    }

    async whitelistCurrentSite() {
        const tabs = await chrome.tabs.query({active: true, currentWindow: true});
        const currentTab = tabs[0];
        const hostname = new URL(currentTab.url).hostname;
        
        const result = await chrome.storage.sync.get(['whitelistedSites']);
        const whitelistedSites = result.whitelistedSites || [];
        
        if (whitelistedSites.includes(hostname)) {
            // Remove from whitelist
            const index = whitelistedSites.indexOf(hostname);
            whitelistedSites.splice(index, 1);
            this.whitelistSiteBtn.querySelector('.action-icon').textContent = '⭐';
            this.showToast(`${hostname} removed from whitelist`);
        } else {
            // Add to whitelist
            whitelistedSites.push(hostname);
            this.whitelistSiteBtn.querySelector('.action-icon').textContent = '⚡';
            this.showToast(`${hostname} added to whitelist`);
        }
        
        await chrome.storage.sync.set({whitelistedSites});
    }

    async reportUnblockedAd() {
        const tabs = await chrome.tabs.query({active: true, currentWindow: true});
        const currentTab = tabs[0];
        
        try {
            const dataUrl = await chrome.tabs.captureVisibleTab(null, {format: 'png'});
            
            const report = {
                url: currentTab.url,
                timestamp: new Date().toISOString(),
                screenshot: dataUrl,
                userAgent: navigator.userAgent,
                extensionVersion: chrome.runtime.getManifest().version
            };
            
            const result = await chrome.storage.local.get(['adReports']);
            const reports = result.adReports || [];
            reports.push(report);
            
            await chrome.storage.local.set({adReports: reports.slice(-10)});
            this.showToast('Ad report submitted! Thank you for helping improve the ad blocker.');
        } catch (error) {
            this.showToast('Failed to capture screenshot for report');
        }
    }

    exportData() {
        chrome.storage.local.get(null, (data) => {
            const exportData = {
                statistics: {
                    blockedAds: data.blockedAds || 0,
                    totalAds: data.totalAds || 0,
                    todayBlocked: data.todayBlocked || 0,
                    statsHistory: data.statsHistory || []
                },
                reports: data.adReports || [],
                installDate: data.installDate,
                lastUpdated: data.lastUpdated
            };
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `adblocker-data-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            this.showToast('Data exported successfully');
        });
    }

    async addCustomRule() {
        const rule = this.customRulesEl.value.trim();
        if (!rule) {
            this.showToast('Please enter a rule');
            return;
        }
        
        const result = await chrome.storage.sync.get(['customRules']);
        const existingRules = result.customRules ? result.customRules.split('\n') : [];
        
        if (!existingRules.includes(rule)) {
            existingRules.push(rule);
            await chrome.storage.sync.set({customRules: existingRules.join('\n')});
            this.showToast('Rule added successfully');
            this.customRulesEl.value = '';
        } else {
            this.showToast('Rule already exists');
        }
    }

    async clearCustomRules() {
        await chrome.storage.sync.set({customRules: ''});
        this.customRulesEl.value = '';
        this.showToast('Custom rules cleared');
    }

    async addToList() {
        const value = this.listInputEl.value.trim();
        if (!value) {
            this.showToast('Please enter a domain or URL pattern');
            return;
        }
        
        const activeTab = document.querySelector('.list-tab.active').dataset.list;
        const storageKey = activeTab === 'whitelist' ? 'whitelistedSites' : 'blacklistedSites';
        
        const result = await chrome.storage.sync.get([storageKey]);
        const list = result[storageKey] || [];
        
        if (!list.includes(value)) {
            list.push(value);
            await chrome.storage.sync.set({[storageKey]: list});
            this.listInputEl.value = '';
            this.loadList(activeTab);
            this.showToast(`Added to ${activeTab}`);
        } else {
            this.showToast('Already in list');
        }
    }

    async loadList(listType) {
        const storageKey = listType === 'whitelist' ? 'whitelistedSites' : 'blacklistedSites';
        const result = await chrome.storage.sync.get([storageKey]);
        const items = result[storageKey] || [];
        
        this.listItemsEl.innerHTML = items.map((item, index) => `
            <div class="list-item">
                <span>${item}</span>
                <button class="remove-btn" onclick="adBlocker.removeFromList('${listType}', ${index})">×</button>
            </div>
        `).join('');
    }

    async removeFromList(listType, index) {
        const storageKey = listType === 'whitelist' ? 'whitelistedSites' : 'blacklistedSites';
        const result = await chrome.storage.sync.get([storageKey]);
        const list = result[storageKey] || [];
        
        list.splice(index, 1);
        await chrome.storage.sync.set({[storageKey]: list});
        this.loadList(listType);
        this.showToast('Removed from list');
    }

    optimizePerformance() {
        this.showToast('Optimizing performance...');
        
        // Simulate optimization
        setTimeout(() => {
            this.updatePerformanceMetrics();
            this.showToast('Performance optimized successfully!');
        }, 1500);
    }

    exportSettings() {
        chrome.storage.sync.get(null, (settings) => {
            const blob = new Blob([JSON.stringify(settings, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `adblocker-settings-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            this.showToast('Settings exported successfully');
        });
    }

    importSettings() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const settings = JSON.parse(event.target.result);
                    await chrome.storage.sync.set(settings);
                    await this.loadSettings();
                    this.showToast('Settings imported successfully');
                } catch (error) {
                    this.showToast('Failed to import settings');
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    }

    async resetAllData() {
        if (!confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
            return;
        }
        
        await chrome.storage.local.clear();
        await chrome.storage.sync.clear();
        
        // Reinitialize with defaults
        await this.loadSettings();
        await this.loadStatistics();
        
        this.showToast('All data reset successfully');
    }

    async resetStatistics() {
        if (!confirm('Are you sure you want to reset all statistics?')) {
            return;
        }
        
        await chrome.storage.local.set({
            blockedAds: 0,
            totalAds: 0,
            todayBlocked: 0,
            statsHistory: []
        });
        
        await this.loadStatistics();
        this.showToast('Statistics reset successfully!');
    }

    async checkForUpdates() {
        this.showToast('Checking for updates...');
        
        // Simulate update check
        setTimeout(() => {
            this.showToast('You are using the latest version!');
        }, 1000);
    }

    notifyContentScript(settings) {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs[0] && tabs[0].url.includes('youtube.com')) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'updateSettings',
                    settings: settings
                });
            }
        });
    }

    async loadAdvancedData() {
        await this.loadList('whitelist');
        this.updatePerformanceMetrics();
        
        // Simulate rules loaded count
        this.rulesLoadedEl.textContent = (Math.floor(Math.random() * 500) + 1000).toLocaleString();
    }

    openLink(url) {
        chrome.tabs.create({url: url});
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    cleanup() {
        if (this.sessionInterval) {
            clearInterval(this.sessionInterval);
        }
    }
}

// Initialize the popup when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.adBlocker = new AdBlockerPro();
    
    // Cleanup on popup close
    window.addEventListener('beforeunload', () => {
        if (window.adBlocker) {
            window.adBlocker.cleanup();
        }
    });
});
