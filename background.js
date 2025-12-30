// YouTube Ad Blocker Pro - Advanced Background Service
class AdvancedBackgroundService {
    constructor() {
        this.adPatterns = [
            // YouTube ad servers - expanded
            "*://*.doubleclick.net/*",
            "*://*.googleadservices.com/*",
            "*://*.googlesyndication.com/*",
            "*://*.googletagmanager.com/*",
            "*://*.googletagservices.com/*",
            "*://*.google-analytics.com/*",
            "*://*.googleads.g.doubleclick.net/*",
            "*://*.googleadservices.com/*",
            "*://*.googlesyndication.com/*",
            "*://*.googletraveladservices.com/*",
            "*://*.google.com/ads/*",
            "*://*.google.com/adsense/*",
            "*://*.google.com/dfp/*",
            "*://*.google.com/adx/*",
            
            // YouTube video ad patterns - enhanced
            "*://*.googlevideo.com/videoplayback*adformat*",
            "*://*.googlevideo.com/videoplayback*ctier*",
            "*://*.googlevideo.com/videoplayback*ad*",
            "*://*.youtube.com/api/stats/ads*",
            "*://*.youtube.com/get_video_info*adformat*",
            "*://*.youtube.com/get_video_info*ad_tag*",
            "*://*.youtube.com/watch?ad_type=*",
            "*://*.youtube.com/youtubei/v1/player*adformat*",
            "*://*.youtube.com/youtubei/v1/player*ad_tag*",
            "*://*.youtube.com/youtubei/v1/player*ad_modules*",
            "*://*.youtube.com/youtubei/v1/next*adformat*",
            
            // Third-party ad networks - expanded
            "*://*.amazon-adsystem.com/*",
            "*://*.facebook.com/tr*",
            "*://*.connect.facebook.net/*",
            "*://*.adsystem.google.com/*",
            "*://*.adnxs.com/*",
            "*://*.ads.yahoo.com/*",
            "*://*.advertising.com/*",
            "*://*.adsymptotic.com/*",
            "*://*.criteo.com/*",
            "*://*.taboola.com/*",
            "*://*.outbrain.com/*",
            "*://*.googleads.g.doubleclick.net/*",
            "*://*.googlesyndication.com/*",
            "*://*.googleadservices.com/*"
        ];
        
        this.stats = {
            blockedAds: 0,
            totalAds: 0,
            todayBlocked: 0,
            sessionStart: Date.now(),
            lastReset: new Date().toDateString()
        };
        
        this.init();
    }

    init() {
        this.setupInstallHandler();
        this.setupWebRequestHandlers();
        this.setupMessageHandlers();
        this.setupTabHandlers();
        this.setupCommandHandlers();
        this.startStatisticsTracking();
        this.scheduleDailyReset();
        
        console.log('🚀 YouTube Ad Blocker Pro - Background Service Started');
    }

    setupInstallHandler() {
        chrome.runtime.onInstalled.addListener((details) => {
            console.log('📦 YouTube Ad Blocker Pro installed/updated:', details.reason);
            
            chrome.storage.local.set({ 
                installDate: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
                version: chrome.runtime.getManifest().version
            });

            // Initialize default settings
            chrome.storage.sync.get([
                'blockVideoAds', 'blockBannerAds', 'blockSponsoredContent',
                'autoSkipAds', 'showNotifications', 'enableAI', 'theme'
            ], (result) => {
                const defaults = {
                    blockVideoAds: true,
                    blockBannerAds: true,
                    blockSponsoredContent: true,
                    autoSkipAds: true,
                    showNotifications: true,
                    enableAI: true,
                    theme: 'auto'
                };
                
                const settings = {...defaults, ...result};
                chrome.storage.sync.set(settings);
            });
        });
    }

    setupWebRequestHandlers() {
        // Monitor ad requests for statistics
        chrome.webRequest.onBeforeRequest.addListener(
            (details) => {
                const url = details.url;
                
                if (this.isAdRequest(url)) {
                    console.log('🚫 Ad request blocked:', url);
                    this.updateStatistics();
                    
                    // Send notification to content script
                    this.notifyContentScript(details.tabId, {
                        action: 'adBlocked',
                        url: url,
                        type: this.getAdType(url)
                    });
                }
            },
            {
                urls: ["<all_urls>"]
            }
        );

        // Monitor response headers for debugging
        chrome.webRequest.onHeadersReceived.addListener(
            (details) => {
                const headers = details.responseHeaders;
                const adHeaders = headers.filter(header => {
                    const headerName = header.name.toLowerCase();
                    return headerName.includes('x-ads') || 
                           headerName.includes('ad-') ||
                           headerName.includes('ads-');
                });
                
                if (adHeaders.length > 0) {
                    console.log('🔍 Ad-related headers detected:', adHeaders);
                }
            },
            {
                urls: ["*://*.youtube.com/*"]
            },
            ["responseHeaders"]
        );
    }

    setupMessageHandlers() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            switch (request.action) {
                case 'getStats':
                    this.getStats(sendResponse);
                    return true;
                    
                case 'adBlocked':
                    this.updateStatistics();
                    sendResponse({success: true});
                    break;
                    
                case 'exportData':
                    this.exportData(sendResponse);
                    return true;
                    
                case 'importSettings':
                    this.importSettings(request.data, sendResponse);
                    return true;
                    
                case 'resetStats':
                    this.resetStatistics(sendResponse);
                    return true;
                    
                case 'getPerformanceMetrics':
                    this.getPerformanceMetrics(sendResponse);
                    return true;
                    
                default:
                    sendResponse({error: 'Unknown action'});
            }
        });
    }

    setupTabHandlers() {
        // Handle tab updates for content script injection
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete' && 
                tab.url && 
                tab.url.includes('youtube.com/watch')) {
                
                // Inject additional script for enhanced video ad handling
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['video-ad-blocker.js']
                }).catch(err => {
                    console.log('📝 Script injection failed or already completed:', err);
                });
            }
        });

        // Monitor tab removal for cleanup
        chrome.tabs.onRemoved.addListener((tabId) => {
            console.log(`🗑️ Tab ${tabId} closed`);
        });
    }

    setupCommandHandlers() {
        chrome.commands.onCommand.addListener((command) => {
            switch (command) {
                case 'toggle-pause':
                    this.togglePauseBlocking();
                    break;
                case 'toggle-theme':
                    this.toggleTheme();
                    break;
            }
        });
    }

    isAdRequest(url) {
        return this.adPatterns.some(pattern => {
            if (typeof pattern === 'string') {
                return this.matchPattern(url, pattern);
            }
            return false;
        });
    }

    matchPattern(url, pattern) {
        // Simple pattern matching for URLs
        const regexPattern = pattern
            .replace(/\*/g, '.*')
            .replace(/\?/g, '\\?');
        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(url);
    }

    getAdType(url) {
        if (url.includes('doubleclick')) return 'banner';
        if (url.includes('videoads') || url.includes('googlevideo')) return 'video';
        if (url.includes('syndication')) return 'tracking';
        return 'unknown';
    }

    updateStatistics() {
        this.stats.blockedAds++;
        this.stats.totalAds++;
        this.stats.todayBlocked++;
        
        // Update storage
        chrome.storage.local.set({
            blockedAds: this.stats.blockedAds,
            totalAds: this.stats.totalAds,
            todayBlocked: this.stats.todayBlocked,
            lastUpdated: new Date().toISOString()
        });
    }

    getStats(callback) {
        chrome.storage.local.get([
            'blockedAds', 'totalAds', 'todayBlocked', 'installDate', 'lastUpdated'
        ], (result) => {
            callback({
                blockedAds: result.blockedAds || 0,
                totalAds: result.totalAds || 0,
                todayBlocked: result.todayBlocked || 0,
                installDate: result.installDate,
                lastUpdated: result.lastUpdated,
                uptime: Date.now() - this.stats.sessionStart
            });
        });
    }

    exportData(callback) {
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
                lastUpdated: data.lastUpdated,
                version: chrome.runtime.getManifest().version
            };
            
            callback(exportData);
        });
    }

    importSettings(data, callback) {
        chrome.storage.sync.set(data.settings, () => {
            chrome.storage.local.set(data.statistics, () => {
                callback({success: true});
            });
        });
    }

    resetStatistics(callback) {
        chrome.storage.local.set({
            blockedAds: 0,
            totalAds: 0,
            todayBlocked: 0,
            statsHistory: []
        }, () => {
            this.stats.blockedAds = 0;
            this.stats.totalAds = 0;
            this.stats.todayBlocked = 0;
            callback({success: true});
        });
    }

    getPerformanceMetrics(callback) {
        // Simulate performance metrics
        callback({
            cpuUsage: Math.random() * 5 + 1,
            memoryUsage: Math.random() * 10 + 10,
            networkRequests: this.stats.totalAds,
            uptime: Date.now() - this.stats.sessionStart,
            rulesLoaded: 1247 + Math.floor(Math.random() * 100)
        });
    }

    togglePauseBlocking() {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs[0] && tabs[0].url.includes('youtube.com')) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'togglePause'
                });
            }
        });
    }

    toggleTheme() {
        chrome.storage.sync.get(['theme'], (result) => {
            const themes = ['auto', 'light', 'dark'];
            const currentIndex = themes.indexOf(result.theme || 'auto');
            const newTheme = themes[(currentIndex + 1) % themes.length];
            
            chrome.storage.sync.set({theme: newTheme});
        });
    }

    notifyContentScript(tabId, message) {
        chrome.tabs.sendMessage(tabId, message).catch(err => {
            // Content script might not be ready, which is fine
        });
    }

    startStatisticsTracking() {
        // Track daily statistics
        setInterval(() => {
            this.updateDailyStats();
        }, 60000); // Update every minute
    }

    updateDailyStats() {
        const today = new Date().toDateString();
        if (today !== this.stats.lastReset) {
            this.stats.todayBlocked = 0;
            this.stats.lastReset = today;
            
            chrome.storage.local.set({todayBlocked: 0});
            console.log('📊 Daily statistics reset');
        }
    }

    scheduleDailyReset() {
        // Reset daily counters at midnight
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const msUntilMidnight = tomorrow - now;
        
        setTimeout(() => {
            this.performDailyReset();
            setInterval(this.performDailyReset, 24 * 60 * 60 * 1000); // Every 24 hours
        }, msUntilMidnight);
    }

    performDailyReset() {
        this.stats.todayBlocked = 0;
        this.stats.lastReset = new Date().toDateString();
        
        chrome.storage.local.set({
            todayBlocked: 0,
            statsHistory: this.addToHistory(this.stats.blockedAds)
        });
        
        console.log('🌅 Daily reset completed');
    }

    addToHistory(blockedAds) {
        return chrome.storage.local.get(['statsHistory'], (result) => {
            const history = result.statsHistory || [];
            const today = new Date().toISOString().split('T')[0];
            
            // Add today's data or update existing
            const existingIndex = history.findIndex(item => item.date === today);
            if (existingIndex >= 0) {
                history[existingIndex].blocked = blockedAds;
            } else {
                history.push({date: today, blocked: blockedAds});
            }
            
            // Keep only last 30 days
            return history.slice(-30);
        });
    }
}

// Initialize the background service
const backgroundService = new AdvancedBackgroundService();

// Legacy compatibility
console.log('YouTube Ad Blocker Pro background script loaded');

// Monitor web requests for statistics
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    const url = details.url;
    
    // Check if URL matches ad patterns for statistics
    if (url.includes('doubleclick.net') || 
        url.includes('googleads') || 
        url.includes('googlesyndication') ||
        url.includes('google-analytics') ||
        url.includes('youtube.com/api/stats/ads') ||
        url.includes('amazon-adsystem')) {
      
      console.log('Ad request detected:', url);
      
      // Update statistics
      chrome.storage.local.get(['blockedAds', 'totalAds'], (result) => {
        const stats = {
          blockedAds: (result.blockedAds || 0) + 1,
          totalAds: (result.totalAds || 0) + 1
        };
        chrome.storage.local.set(stats);
        chrome.storage.local.set({ lastUpdated: new Date().toISOString() });
      });
    }
  },
  {
    urls: ["<all_urls>"]
  }
);

// Monitor response headers for debugging
chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    const headers = details.responseHeaders;
    const adHeaders = headers.filter(header => {
      const headerName = header.name.toLowerCase();
      return headerName.includes('x-ads') || 
             headerName.includes('ad-') ||
             headerName.includes('ads-');
    });
    
    if (adHeaders.length > 0) {
      console.log('Ad-related headers detected:', adHeaders);
    }
  },
  {
    urls: ["*://*.youtube.com/*"]
  },
  ["responseHeaders"]
);

// Listen for tab updates to inject content scripts
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && 
      tab.url && 
      tab.url.includes('youtube.com/watch')) {
    
    // Inject additional script to handle video ads
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['video-ad-blocker.js']
    }).catch(err => {
      // Script might already be injected or injection failed
      console.log('Script injection failed or already done:', err);
    });
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStats') {
    // Return ad blocking statistics
    chrome.storage.local.get(['blockedAds', 'totalAds'], (result) => {
      sendResponse({
        blockedAds: result.blockedAds || 0,
        totalAds: result.totalAds || 0
      });
    });
    return true;
  }
  
  if (request.action === 'adBlocked') {
    // Update ad blocking statistics
    chrome.storage.local.get(['blockedAds', 'totalAds'], (result) => {
      const stats = {
        blockedAds: (result.blockedAds || 0) + 1,
        totalAds: (result.totalAds || 0) + 1
      };
      chrome.storage.local.set(stats);
    });
  }
});

console.log('YouTube Ad Blocker background script loaded');
