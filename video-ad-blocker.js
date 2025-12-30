// YouTube Video Ad Blocker - Comprehensive Ad Blocking
(function() {
    'use strict';
    
    console.log('🛡️ YouTube Ad Blocker - Comprehensive mode activated');
    
    let skipInterval;
    let isAdActive = false;
    
    // Function to check if we're on an ad
    function isAdPlaying() {
        const video = document.querySelector('video');
        if (!video) return false;
        
        // Check for ad indicators
        const adIndicators = [
            '.ad-showing',
            '.ytp-ad-module',
            '.ytp-ad-preview-container',
            '.ytp-ad-player-overlay',
            '.ytp-ad-overlay-slot',
            '.ytp-ad-skip-button',
            '.ytp-ad-skip-button-modern',
            '.ytp-ad-button',
            '.ytp-ad-text',
            '.ytp-ad-image',
            '.ytp-ad-player-overlay-instream-info'
        ];
        
        // Check for any ad indicators
        const hasAdIndicator = adIndicators.some(selector => {
            const element = document.querySelector(selector);
            return element && (element.offsetParent !== null || 
                             window.getComputedStyle(element).display !== 'none');
        });
        
        // Check if URL contains ad indicators
        const urlHasAd = window.location.href.includes('ad_format=') || 
                         window.location.href.includes('ad_type=');
        
        // Check if video is very short (likely an ad)
        const isShortVideo = video.duration && video.duration < 90; // Less than 90 seconds
        
        // Check if player is in ad mode
        const player = document.querySelector('.html5-video-player');
        const playerHasAd = player && player.classList.contains('ad-showing');
        
        // Check for ad text content
        const adTextElements = document.querySelectorAll('[aria-label*="ad"], [aria-label*="Ad"], [aria-label*="advertisement"]');
        const hasAdText = adTextElements.length > 0;
        
        return hasAdIndicator || urlHasAd || isShortVideo || playerHasAd || hasAdText;
    }
    
    // Function to skip ads aggressively
    function skipAd() {
        const video = document.querySelector('video');
        if (!video) return;
        
        console.log('🎯 Attempting to skip ad');
        
        // Method 1: Click skip buttons
        const skipSelectors = [
            '.ytp-ad-skip-button',
            '.ytp-ad-skip-button-modern',
            '.ytp-ad-skip-button-container button',
            '.ytp-ad-skip-button-modern button',
            '[aria-label*="Skip"]',
            '[aria-label*="skip"]',
            '.ytp-ad-skip-button-container',
            '.ytp-ad-skip-modern'
        ];
        
        skipSelectors.forEach(selector => {
            try {
                const skipButton = document.querySelector(selector);
                if (skipButton) {
                    // Make button visible and clickable
                    skipButton.style.display = 'block';
                    skipButton.style.visibility = 'visible';
                    skipButton.style.opacity = '1';
                    skipButton.style.pointerEvents = 'auto';
                    skipButton.click();
                    console.log('⏭️ Clicked skip button:', selector);
                }
            } catch (error) {
                // Continue trying other methods
            }
        });
        
        // Method 2: Force video to end
        try {
            if (video.duration && video.currentTime < video.duration - 0.5) {
                video.currentTime = video.duration;
                video.play().catch(() => {});
                console.log('⏩ Forced video to end');
            }
        } catch (error) {
            // Continue trying other methods
        }
        
        // Method 3: Mute and set high playback rate
        try {
            video.muted = true;
            video.playbackRate = 16; // Maximum speed
            console.log('🔇 Muted and sped up ad');
        } catch (error) {
            // Continue if this fails
        }
        
        // Method 4: Hide ad overlays
        const adOverlays = document.querySelectorAll('.ytp-ad-player-overlay, .ytp-ad-overlay-slot, .ytp-ad-module');
        adOverlays.forEach(overlay => {
            try {
                overlay.style.display = 'none';
                overlay.style.visibility = 'hidden';
                overlay.style.opacity = '0';
            } catch (error) {
                // Continue if this fails
            }
        });
    }
    
    // Function to handle ads
    function handleAds() {
        const currentlyAdActive = isAdPlaying();
        
        if (currentlyAdActive && !isAdActive) {
            // Ad just started
            isAdActive = true;
            console.log('🚨 Ad detected, taking action');
            skipAd();
        } else if (currentlyAdActive && isAdActive) {
            // Ad is still active, keep trying to skip
            skipAd();
        } else if (!currentlyAdActive && isAdActive) {
            // Ad just ended
            isAdActive = false;
            console.log('✅ Ad ended,恢复正常播放');
            
            // Restore normal playback
            const video = document.querySelector('video');
            if (video) {
                try {
                    video.muted = false;
                    video.playbackRate = 1;
                } catch (error) {
                    // Ignore errors
                }
            }
        }
    }
    
    // Function to remove ad elements
    function removeAdElements() {
        const adSelectors = [
            '.ytp-ad-module',
            '.ytp-ad-preview-container',
            '.ytp-ad-player-overlay',
            '.ytp-ad-overlay-slot',
            '.ytp-ad-button',
            '.ytp-ad-text',
            '.ytp-ad-image',
            '.ytp-ad-player-overlay-instream-info',
            '[class*="ad-"]',
            '[id*="ad-"]'
        ];
        
        adSelectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (element && element.offsetParent !== null) {
                        element.remove();
                    }
                });
            } catch (error) {
                // Continue if removal fails
            }
        });
    }
    
    // Start comprehensive monitoring
    function startComprehensiveMonitoring() {
        if (skipInterval) clearInterval(skipInterval);
        
        skipInterval = setInterval(() => {
            try {
                handleAds();
                removeAdElements();
            } catch (error) {
                // Ignore monitoring errors
            }
        }, 100); // Check every 100ms for very fast response
    }
    
    // Initialize immediately
    console.log('🎬 Starting comprehensive ad blocking');
    startComprehensiveMonitoring();
    
    // Also initialize on page load
    setTimeout(() => {
        startComprehensiveMonitoring();
    }, 1000);
    
    // Handle page navigation
    let currentUrl = window.location.href;
    setInterval(() => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            isAdActive = false; // Reset ad state
            setTimeout(() => {
                startComprehensiveMonitoring();
            }, 500);
        }
    }, 500);
    
    // Cleanup
    window.addEventListener('beforeunload', () => {
        if (skipInterval) clearInterval(skipInterval);
    });
    
})();
