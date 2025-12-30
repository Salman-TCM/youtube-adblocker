// List of ad-related patterns to block
const adPatterns = [
  // YouTube ad servers
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
  
  // YouTube video ad patterns
  "*://*.googlevideo.com/videoplayback*adformat*",
  "*://*.googlevideo.com/videoplayback*ctier*",
  "*://*.googlevideo.com/videoplayback*ad*",
  "*://*.youtube.com/api/stats/ads*",
  "*://*.youtube.com/get_video_info*adformat*",
  "*://*.youtube.com/get_video_info*ad_tag*",
  "*://*.youtube.com/watch?ad_type=*",
  
  // YouTube ad tracking
  "*://*.youtube.com/pagead/*",
  "*://*.youtube.com/youtubei/v1/player*adformat*",
  "*://*.youtube.com/youtubei/v1/player*ad_tag*",
  "*://*.youtube.com/youtubei/v1/player*ad_modules*",
  "*://*.youtube.com/youtubei/v1/next*adformat*",
  
  // Third-party ad networks
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
  "*://*.outbrain.com/*"
];

// Set up on extension startup
chrome.runtime.onInstalled.addListener(() => {
  console.log('YouTube Ad Blocker installed');
  chrome.storage.local.set({ 
    installDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  });
});

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
