// YouTube Video Ad Blocker - Specialized script for video ads
(function() {
    'use strict';

    let videoObserver;
    let playerObserver;
    let currentVideo = null;
    let adSkipInterval;
    let volumeInterval;

    // Function to detect and handle video ads
    function handleVideoAds() {
        const video = document.querySelector('video');
        if (!video) return;

        currentVideo = video;

        // Check for ad indicators
        const adIndicators = [
            '.ad-showing',
            '.ytp-ad-module',
            '.ytp-ad-preview-container',
            '.ytp-ad-player-overlay',
            '.ytp-ad-overlay-slot'
        ];

        const hasAd = adIndicators.some(selector => document.querySelector(selector));

        if (hasAd) {
            handleAdPlayback(video);
        } else {
            // Reset normal playback
            resetNormalPlayback(video);
        }
    }

    // Function to handle ad playback
    function handleAdPlayback(video) {
        // Try to skip the ad immediately
        skipAd();

        // Set up continuous ad skipping
        if (!adSkipInterval) {
            adSkipInterval = setInterval(() => {
                skipAd();
                muteAd(video);
                fastForwardAd(video);
            }, 100);
        }

        // Mute ads automatically
        muteAd(video);

        // Try to fast forward to end
        fastForwardAd(video);

        // Notify background script
        if (chrome && chrome.runtime) {
            chrome.runtime.sendMessage({ action: 'adBlocked' });
        }
    }

    // Function to reset normal playback
    function resetNormalPlayback(video) {
        if (adSkipInterval) {
            clearInterval(adSkipInterval);
            adSkipInterval = null;
        }

        if (volumeInterval) {
            clearInterval(volumeInterval);
            volumeInterval = null;
        }

        // Restore volume if it was muted for ads
        const savedVolume = sessionStorage.getItem('ytp-volume');
        if (savedVolume && video.volume < parseFloat(savedVolume)) {
            video.volume = parseFloat(savedVolume);
        }
    }

    // Function to skip ads
    function skipAd() {
        const skipSelectors = [
            '.ytp-ad-skip-button',
            '.ytp-ad-skip-button-modern',
            '.ytp-ad-skip-button-container button',
            '.ytp-ad-skip-button-modern button',
            '[aria-label*="Skip"]',
            '[aria-label*="skip"]'
        ];

        skipSelectors.forEach(selector => {
            const skipButton = document.querySelector(selector);
            if (skipButton && skipButton.offsetParent !== null) {
                skipButton.click();
                console.log('Clicked skip button:', selector);
                return;
            }
        });
    }

    // Function to mute ads
    function muteAd(video) {
        if (video.muted === false) {
            // Save current volume
            sessionStorage.setItem('ytp-volume', video.volume.toString());
            video.muted = true;
            
            // Show notification that ad is muted
            const muteIndicator = document.querySelector('.ytp-mute-button');
            if (muteIndicator) {
                muteIndicator.setAttribute('aria-label', 'Ad muted');
            }
        }
    }

    // Function to fast forward ads
    function fastForwardAd(video) {
        if (video.duration && video.currentTime < video.duration - 0.5) {
            // Jump to near the end
            video.currentTime = video.duration - 0.1;
        }
    }

    // Function to intercept player API calls
    function interceptPlayerAPI() {
        try {
            // Override XMLHttpRequest to catch ad-related API calls
            if (typeof window.XMLHttpRequest === 'function') {
                const originalXHR = window.XMLHttpRequest;
                window.XMLHttpRequest = function() {
                    const xhr = new originalXHR();
                    const originalOpen = xhr.open;
                    const originalSend = xhr.send;

                    xhr.open = function(method, url, ...args) {
                        try {
                            if (typeof url === 'string' && 
                                (url.includes('youtubei/v1/player') || 
                                 url.includes('get_video_info'))) {
                                
                                xhr.addEventListener('readystatechange', function() {
                                    if (xhr.readyState === 4 && xhr.status === 200) {
                                        try {
                                            const response = JSON.parse(xhr.responseText);
                                            
                                            // Remove ad data from response
                                            if (response.adPlacements) {
                                                delete response.adPlacements;
                                            }
                                            if (response.playerAds) {
                                                delete response.playerAds;
                                            }
                                            if (response.adSlots) {
                                                delete response.adSlots;
                                            }
                                            
                                            // Modify response object
                                            Object.defineProperty(xhr, 'responseText', {
                                                value: JSON.stringify(response),
                                                writable: false
                                            });
                                            
                                            Object.defineProperty(xhr, 'response', {
                                                value: response,
                                                writable: false
                                            });
                                            
                                        } catch (e) {
                                            // Ignore JSON parsing errors
                                        }
                                    }
                                });
                            }
                        } catch (error) {
                            console.log('Error in XHR open:', error);
                        }
                        
                        return originalOpen.call(this, method, url, ...args);
                    };

                    return xhr;
                };
            }
        } catch (error) {
            console.log('Error in interceptPlayerAPI:', error);
        }
    }

    // Function to monitor player changes
    function startPlayerObserver() {
        const player = document.querySelector('#movie_player');
        if (!player) return;

        playerObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'class' || 
                     mutation.attributeName === 'aria-label')) {
                    
                    setTimeout(handleVideoAds, 100);
                }
            });
        });

        playerObserver.observe(player, {
            attributes: true,
            attributeFilter: ['class', 'aria-label'],
            subtree: true
        });
    }

    // Function to monitor video element changes
    function startVideoObserver() {
        videoObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // Check for new video elements
                    const videos = document.querySelectorAll('video');
                    videos.forEach(video => {
                        if (video !== currentVideo) {
                            currentVideo = video;
                            video.addEventListener('play', handleVideoAds);
                            video.addEventListener('timeupdate', handleVideoAds);
                            video.addEventListener('loadedmetadata', handleVideoAds);
                        }
                    });
                }
            });
        });

        videoObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Function to remove ad segments from timeline
    function removeAdSegments() {
        const progressBar = document.querySelector('.ytp-progress-bar');
        if (!progressBar) return;

        const adSegments = progressBar.querySelectorAll('.ytp-ad-progress-list, .ytp-ad-progress');
        adSegments.forEach(segment => {
            segment.style.display = 'none';
            segment.remove();
        });
    }

    // Function to handle player ready state
    function handlePlayerReady() {
        try {
            const player = document.querySelector('#movie_player');
            if (player && typeof player.getPlayerState === 'function') {
                // YouTube's native player API
                const originalPlayVideo = player.playVideo;
                if (typeof originalPlayVideo === 'function') {
                    player.playVideo = function() {
                        try {
                            handleVideoAds();
                            return originalPlayVideo.call(this);
                        } catch (error) {
                            console.log('Error in overridden playVideo:', error);
                            return originalPlayVideo.call(this);
                        }
                    };
                }
            }
        } catch (error) {
            console.log('Error in handlePlayerReady:', error);
        }
    }

    // Main initialization
    function init() {
        console.log('YouTube Video Ad Blocker Initialized');

        // Initial ad check
        setTimeout(handleVideoAds, 1000);

        // Set up observers
        startPlayerObserver();
        startVideoObserver();

        // Intercept API calls
        interceptPlayerAPI();

        // Periodic checks
        setInterval(() => {
            handleVideoAds();
            removeAdSegments();
        }, 500);

        // Handle player ready
        setTimeout(handlePlayerReady, 2000);

        // Handle page navigation
        let currentUrl = window.location.href;
        setInterval(() => {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                console.log('Video ad blocker: Page navigation detected');
                setTimeout(() => {
                    handleVideoAds();
                    startPlayerObserver();
                }, 1000);
            }
        }, 1000);
    }

    // Message handler for communication with popup
    if (chrome && chrome.runtime) {
        try {
            chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
                try {
                    if (request.action === 'ping') {
                        sendResponse({ status: 'ok' });
                    }
                    
                    if (request.action === 'getStats') {
                        // Return local stats if available
                        const stats = window.getAdBlockerStats ? window.getAdBlockerStats() : { blockedCount: 0 };
                        sendResponse(stats);
                    }
                    
                    if (request.action === 'updateSettings') {
                        // Apply new settings
                        console.log('Updated settings:', request.settings);
                    }
                } catch (error) {
                    console.log('Error in message handler:', error);
                }
            });
        } catch (error) {
            console.log('Error setting up message handler:', error);
        }
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        if (videoObserver) videoObserver.disconnect();
        if (playerObserver) playerObserver.disconnect();
        if (adSkipInterval) clearInterval(adSkipInterval);
        if (volumeInterval) clearInterval(volumeInterval);
    });

})();
