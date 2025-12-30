// YouTube Video Ad Blocker - Minimal Video Ad Handling
(function() {
    'use strict';
    
    console.log('⏸️ Video Ad Blocker - Minimal mode enabled');
    
    let skipInterval;
    
    // Function to handle video ads without interfering with normal videos
    function handleVideoAds() {
        const video = document.querySelector('video');
        if (!video) return;
        
        // Check for ad indicators - only act if ads are definitely present
        const adIndicators = [
            '.ad-showing',
            '.ytp-ad-module',
            '.ytp-ad-preview-container',
            '.ytp-ad-player-overlay',
            '.ytp-ad-overlay-slot'
        ];
        
        const hasAd = adIndicators.some(selector => {
            const element = document.querySelector(selector);
            return element && element.offsetParent !== null;
        });
        
        if (hasAd) {
            console.log('🎯 Ad detected, attempting to skip');
            skipAd(video);
            muteAd(video);
        }
    }
    
    // Function to skip ads
    function skipAd(video) {
        const skipSelectors = [
            '.ytp-ad-skip-button',
            '.ytp-ad-skip-button-modern',
            '.ytp-ad-skip-button-container button',
            '.ytp-ad-skip-button-modern button',
            '[aria-label*="Skip"]',
            '[aria-label*="skip"]'
        ];
        
        skipSelectors.forEach(selector => {
            try {
                const skipButton = document.querySelector(selector);
                if (skipButton && skipButton.offsetParent !== null) {
                    skipButton.click();
                    console.log('⏭️ Clicked skip button:', selector);
                    return;
                }
            } catch (error) {
                // Ignore click errors
            }
        });
    }
    
    // Function to mute ads
    function muteAd(video) {
        try {
            if (video.muted === false) {
                video.muted = true;
                console.log('🔇 Muted ad audio');
            }
        } catch (error) {
            // Ignore mute errors
        }
    }
    
    // Start minimal monitoring - only check for ads, don't interfere with normal videos
    function startMinimalMonitoring() {
        if (skipInterval) clearInterval(skipInterval);
        
        skipInterval = setInterval(() => {
            try {
                handleVideoAds();
            } catch (error) {
                // Ignore monitoring errors
            }
        }, 1000); // Check every second
    }
    
    // Initialize after page loads
    setTimeout(() => {
        console.log('🎬 Starting minimal video ad monitoring');
        startMinimalMonitoring();
    }, 2000);
    
    // Handle page navigation
    let currentUrl = window.location.href;
    setInterval(() => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            setTimeout(() => {
                startMinimalMonitoring();
            }, 1000);
        }
    }, 1000);
    
    // Cleanup
    window.addEventListener('beforeunload', () => {
        if (skipInterval) clearInterval(skipInterval);
    });
    
})();
