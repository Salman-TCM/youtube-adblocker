// YouTube Ad Blocker Popup Script
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const blockedCountEl = document.getElementById('blockedCount');
    const totalAdsEl = document.getElementById('totalAds');
    const sessionTimeEl = document.getElementById('sessionTime');
    const statusIndicator = document.getElementById('statusIndicator');
    const statusDot = statusIndicator.querySelector('.status-dot');
    const statusText = statusIndicator.querySelector('.status-text');
    const resetStatsBtn = document.getElementById('resetStats');
    const whitelistSiteBtn = document.getElementById('whitelistSite');
    const reportAdBtn = document.getElementById('reportAd');
    const helpLink = document.getElementById('helpLink');
    const feedbackLink = document.getElementById('feedbackLink');
    const donateLink = document.getElementById('donateLink');
    const lastUpdatedEl = document.getElementById('lastUpdated');
    const installDateEl = document.getElementById('installDate');

    // Settings checkboxes
    const blockVideoAdsEl = document.getElementById('blockVideoAds');
    const blockBannerAdsEl = document.getElementById('blockBannerAds');
    const blockSponsoredContentEl = document.getElementById('blockSponsoredContent');
    const autoSkipAdsEl = document.getElementById('autoSkipAds');
    const showNotificationsEl = document.getElementById('showNotifications');

    // Session tracking
    let sessionStartTime = Date.now();
    let sessionInterval;

    // Initialize popup
    function init() {
        loadStatistics();
        loadSettings();
        startSessionTimer();
        updateLastUpdated();
        setupEventListeners();
    }

    // Load statistics from storage
    function loadStatistics() {
        chrome.storage.local.get(['blockedAds', 'totalAds', 'installDate'], (result) => {
            const blockedCount = result.blockedAds || 0;
            const totalCount = result.totalAds || 0;
            
            blockedCountEl.textContent = formatNumber(blockedCount);
            totalAdsEl.textContent = formatNumber(totalCount);
            
            // Update install date
            if (result.installDate) {
                const installDate = new Date(result.installDate);
                installDateEl.textContent = installDate.toLocaleDateString();
            }
        });
    }

    // Load settings from storage
    function loadSettings() {
        chrome.storage.sync.get([
            'blockVideoAds',
            'blockBannerAds', 
            'blockSponsoredContent',
            'autoSkipAds',
            'showNotifications'
        ], (result) => {
            blockVideoAdsEl.checked = result.blockVideoAds !== false;
            blockBannerAdsEl.checked = result.blockBannerAds !== false;
            blockSponsoredContentEl.checked = result.blockSponsoredContent !== false;
            autoSkipAdsEl.checked = result.autoSkipAds !== false;
            showNotificationsEl.checked = result.showNotifications !== false;
        });
    }

    // Save settings to storage
    function saveSettings() {
        const settings = {
            blockVideoAds: blockVideoAdsEl.checked,
            blockBannerAds: blockBannerAdsEl.checked,
            blockSponsoredContent: blockSponsoredContentEl.checked,
            autoSkipAds: autoSkipAdsEl.checked,
            showNotifications: showNotificationsEl.checked
        };
        
        chrome.storage.sync.set(settings, () => {
            showToast('Settings saved successfully!');
            
            // Notify content script about setting changes
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                if (tabs[0] && tabs[0].url.includes('youtube.com')) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'updateSettings',
                        settings: settings
                    });
                }
            });
        });
    }

    // Start session timer
    function startSessionTimer() {
        sessionInterval = setInterval(() => {
            const elapsed = Date.now() - sessionStartTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            sessionTimeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    // Update last updated timestamp
    function updateLastUpdated() {
        chrome.storage.local.get(['lastUpdated'], (result) => {
            if (result.lastUpdated) {
                const lastUpdated = new Date(result.lastUpdated);
                lastUpdatedEl.textContent = `Last updated: ${lastUpdated.toLocaleString()}`;
            }
        });
    }

    // Setup event listeners
    function setupEventListeners() {
        // Settings change listeners
        [blockVideoAdsEl, blockBannerAdsEl, blockSponsoredContentEl, autoSkipAdsEl, showNotificationsEl]
            .forEach(checkbox => {
                checkbox.addEventListener('change', saveSettings);
            });

        // Button click listeners
        resetStatsBtn.addEventListener('click', resetStatistics);
        whitelistSiteBtn.addEventListener('click', whitelistCurrentSite);
        reportAdBtn.addEventListener('click', reportUnblockedAd);

        // Link click listeners
        helpLink.addEventListener('click', (e) => {
            e.preventDefault();
            openLink('https://github.com/youtube-adblocker/help');
        });

        feedbackLink.addEventListener('click', (e) => {
            e.preventDefault();
            openLink('https://github.com/youtube-adblocker/feedback');
        });

        donateLink.addEventListener('click', (e) => {
            e.preventDefault();
            openLink('https://github.com/youtube-adblocker/donate');
        });

        // Check extension status
        checkExtensionStatus();
    }

    // Check if extension is properly enabled
    function checkExtensionStatus() {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            const currentTab = tabs[0];
            
            if (currentTab && currentTab.url.includes('youtube.com')) {
                // Test if content script is working
                chrome.tabs.sendMessage(currentTab.id, {action: 'ping'}, (response) => {
                    if (chrome.runtime.lastError) {
                        // Content script not injected
                        statusDot.classList.add('inactive');
                        statusText.textContent = 'Inactive';
                    } else {
                        statusDot.classList.remove('inactive');
                        statusText.textContent = 'Active';
                    }
                });
            } else {
                statusText.textContent = 'Not on YouTube';
            }
        });
    }

    // Reset statistics
    function resetStatistics() {
        if (confirm('Are you sure you want to reset all statistics?')) {
            chrome.storage.local.set({
                blockedAds: 0,
                totalAds: 0
            }, () => {
                loadStatistics();
                showToast('Statistics reset successfully!');
            });
        }
    }

    // Whitelist current site
    function whitelistCurrentSite() {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            const currentTab = tabs[0];
            const hostname = new URL(currentTab.url).hostname;
            
            chrome.storage.sync.get(['whitelistedSites'], (result) => {
                const whitelistedSites = result.whitelistedSites || [];
                
                if (whitelistedSites.includes(hostname)) {
                    // Remove from whitelist
                    const index = whitelistedSites.indexOf(hostname);
                    whitelistedSites.splice(index, 1);
                    whitelistSiteBtn.textContent = 'Whitelist Site';
                    showToast(`${hostname} removed from whitelist`);
                } else {
                    // Add to whitelist
                    whitelistedSites.push(hostname);
                    whitelistSiteBtn.textContent = 'Remove from Whitelist';
                    showToast(`${hostname} added to whitelist`);
                }
                
                chrome.storage.sync.set({whitelistedSites});
            });
        });
    }

    // Report unblocked ad
    function reportUnblockedAd() {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            const currentTab = tabs[0];
            
            // Take screenshot (requires activeTab permission)
            chrome.tabs.captureVisibleTab(null, {format: 'png'}, (dataUrl) => {
                const report = {
                    url: currentTab.url,
                    timestamp: new Date().toISOString(),
                    screenshot: dataUrl,
                    userAgent: navigator.userAgent,
                    extensionVersion: chrome.runtime.getManifest().version
                };
                
                // Store report for later submission
                chrome.storage.local.get(['adReports'], (result) => {
                    const reports = result.adReports || [];
                    reports.push(report);
                    chrome.storage.local.set({adReports: reports.slice(-10)}); // Keep last 10 reports
                    
                    showToast('Ad report submitted! Thank you for helping improve the ad blocker.');
                });
            });
        });
    }

    // Open external link
    function openLink(url) {
        chrome.tabs.create({url: url});
    }

    // Show toast notification
    function showToast(message) {
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

    // Format large numbers
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // Get real-time stats from content script
    function updateRealTimeStats() {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            const currentTab = tabs[0];
            
            if (currentTab && currentTab.url.includes('youtube.com')) {
                chrome.tabs.sendMessage(currentTab.id, {action: 'getStats'}, (response) => {
                    if (response && !chrome.runtime.lastError) {
                        blockedCountEl.textContent = formatNumber(response.blockedAds);
                    }
                });
            }
        });
    }

    // Update stats every 2 seconds
    setInterval(updateRealTimeStats, 2000);

    // Cleanup on popup close
    window.addEventListener('beforeunload', () => {
        if (sessionInterval) {
            clearInterval(sessionInterval);
        }
    });

    // Initialize the popup
    init();
});
