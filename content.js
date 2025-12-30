// YouTube Ad Blocker Content Script
(function() {
  'use strict';

  let blockedCount = 0;
  let observer;
  let videoElement;
  let skipButtonInterval;

  // Function to hide elements by selector
  function hideElements(selectors) {
    selectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (element && element.style.display !== 'none') {
            element.style.display = 'none';
            blockedCount++;
            console.log(`Hidden ad element: ${selector}`);
            
            // Notify background script
            if (chrome && chrome.runtime) {
              chrome.runtime.sendMessage({ action: 'adBlocked' });
            }
          }
        });
      } catch (error) {
        console.error(`Error hiding elements with selector ${selector}:`, error);
      }
    });
  }

  // Comprehensive list of ad selectors
  const adSelectors = [
    // Video ads
    '.video-ads',
    '.ad-container',
    '.ad-display',
    '.ad-showing',
    '.ytp-ad-module',
    '.ytp-ad-overlay-slot',
    '.ytp-ad-player-overlay',
    '.ytp-ad-skip-button-container',
    '.ytp-ad-preview-container',
    '.ytp-ad-text',
    
    // Banner ads
    '.ytd-display-ad-renderer',
    '.ytd-promoted-sparkles-text-renderer',
    '.ytd-promoted-video-renderer',
    '.ytd-in-feed-ad-layout-renderer',
    '.ytd-action-companion-ad-renderer',
    '.ytd-masthead-ad-renderer',
    '.ytd-banner-promo-renderer',
    
    // Sidebar ads
    '#player-ads',
    '#watch-buy-urls',
    '#watch-channel-brand-div',
    '#watch7-sidebar-ads',
    '#watch-pyv-conn',
    
    // Overlay ads
    '.ytp-ad-overlay-container',
    '.ytp-ad-action-interstitial-overlay-container',
    '.ytp-ad-image-overlay',
    
    // Sponsored content
    '[data-ad-type]',
    '[data-ad-impression]',
    '[aria-label*="Ad"]',
    '[aria-label*="Sponsored"]',
    '[title*="Ad"]',
    '[title*="Sponsored"]',
    
    // YouTube Music ads
    '.ytmusic-ad-slot-renderer',
    '.ytmusic-ad-overlay',
    
    // General ad patterns
    '*[class*="ad-"]',
    '*[id*="ad-"]',
    '*[class*="ads"]',
    '*[id*="ads"]',
    '.companion-ad-container',
    '.ad_creative',
    '.ad_wrapper',
    '.google_ads',
    '.adsbygoogle'
  ];

  // Function to skip video ads automatically
  function skipVideoAds() {
    const video = document.querySelector('video');
    if (!video) return;

    // Check if video is an ad
    const isAd = document.querySelector('.ad-showing, .ytp-ad-module, .ytp-ad-preview-container');
    
    if (isAd && video.duration && video.duration < 300) { // Ads are usually shorter than 5 minutes
      // Try to find and click skip button
      const skipButton = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-ad-skip-button-container button');
      if (skipButton) {
        skipButton.click();
        console.log('Clicked skip ad button');
        blockedCount++;
        return;
      }
      
      // If no skip button, try to fast forward to the end
      if (video.duration && video.currentTime < video.duration - 1) {
        video.currentTime = video.duration;
        console.log('Fast forwarded ad to end');
        blockedCount++;
      }
    }
  }

  // Function to remove ad segments from timeline
  function removeAdSegments() {
    const progressBar = document.querySelector('.ytp-progress-bar');
    if (!progressBar) return;

    // Remove ad segment markers
    const adSegments = progressBar.querySelectorAll('.ytp-ad-progress-list, .ytp-ad-progress');
    adSegments.forEach(segment => segment.remove());
  }

  // Function to intercept and modify player data
  function interceptPlayerData() {
    // Override fetch to intercept player API calls
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const url = args[0];
      
      if (typeof url === 'string' && 
          (url.includes('youtubei/v1/player') || url.includes('get_video_info'))) {
        
        return originalFetch.apply(this, args).then(response => {
          const clonedResponse = response.clone();
          
          clonedResponse.json().then(data => {
            try {
              // Remove ad data from player response
              if (data.playerResponse) {
                delete data.playerResponse.adPlacements;
                delete data.playerResponse.playerAds;
                delete data.playerResponse.adSlots;
                
                if (data.playerResponse.videoDetails) {
                  data.playerResponse.videoDetails.isLive = false;
                }
              }
              
              if (data.adPlacements) {
                delete data.adPlacements;
              }
              
              if (data.playerAds) {
                delete data.playerAds;
              }
            } catch (error) {
              console.error('Error modifying player data:', error);
            }
          }).catch(() => {
            // Ignore JSON parsing errors
          });
          
          return response;
        });
      }
      
      return originalFetch.apply(this, args);
    };
  }

  // Function to monitor DOM changes for dynamic ads
  function startMutationObserver() {
    if (observer) observer.disconnect();
    
    observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Check for new ad elements
          setTimeout(() => {
            hideElements(adSelectors);
            skipVideoAds();
            removeAdSegments();
          }, 100);
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Function to periodically check for ads
  function periodicAdCheck() {
    setInterval(() => {
      hideElements(adSelectors);
      skipVideoAds();
      removeAdSegments();
    }, 2000);
  }

  // Initialize the ad blocker
  function init() {
    console.log('YouTube Ad Blocker Content Script Initialized');
    
    // Initial ad removal
    setTimeout(() => {
      hideElements(adSelectors);
    }, 500);
    
    // Set up monitoring
    startMutationObserver();
    periodicAdCheck();
    
    // Intercept player data
    interceptPlayerData();
    
    // Set up video ad skipping
    skipButtonInterval = setInterval(skipVideoAds, 500);
    
    // Monitor page navigation
    let currentUrl = window.location.href;
    setInterval(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        console.log('Page navigation detected, reinitializing ad blocker');
        setTimeout(() => {
          hideElements(adSelectors);
        }, 1000);
      }
    }, 1000);
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    if (observer) observer.disconnect();
    if (skipButtonInterval) clearInterval(skipButtonInterval);
  });

  // Expose blocked count for popup
  window.getAdBlockerStats = () => ({ blockedCount });

  // Message handler for communication with popup
  if (chrome && chrome.runtime) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'ping') {
        sendResponse({ status: 'ok' });
      }
      
      if (request.action === 'getStats') {
        const stats = window.getAdBlockerStats();
        sendResponse(stats);
      }
      
      if (request.action === 'updateSettings') {
        // Apply new settings
        console.log('Content script received new settings:', request.settings);
      }
    });
  }
})();
