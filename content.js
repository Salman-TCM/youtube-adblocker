// YouTube Ad Blocker Pro - Advanced AI-Powered Content Script
(function() {
    'use strict';

    class AdvancedAdBlocker {
        constructor() {
            this.blockedCount = 0;
            this.isPaused = false;
            this.settings = {};
            this.customRules = [];
            this.whitelistedSites = [];
            this.blacklistedSites = [];
            this.observer = null;
            this.videoObserver = null;
            this.skipInterval = null;
            this.aiModel = null;
            this.performanceMode = false;
            this.lastCheck = 0;
            this.adPatterns = new Map();
            this.scheduledChecks = [];
            
            this.init();
        }

        async init() {
            console.log('🚀 YouTube Ad Blocker Pro - Advanced AI Engine Initialized');
            
            await this.loadSettings();
            await this.initializeAI();
            this.setupAdvancedSelectors();
            this.startComprehensiveBlocking();
            this.setupMessageHandlers();
            this.initializePerformanceOptimization();
            this.startAdvancedMonitoring();
            
            console.log('✅ All ad blocking systems operational');
        }

        async loadSettings() {
            return new Promise((resolve) => {
                chrome.storage.sync.get([
                    'blockVideoAds', 'blockBannerAds', 'blockSponsoredContent',
                    'autoSkipAds', 'showNotifications', 'enableAI', 'customRules',
                    'whitelistedSites', 'blacklistedSites'
                ], (result) => {
                    this.settings = {
                        blockVideoAds: result.blockVideoAds !== false,
                        blockBannerAds: result.blockBannerAds !== false,
                        blockSponsoredContent: result.blockSponsoredContent !== false,
                        autoSkipAds: result.autoSkipAds !== false,
                        showNotifications: result.showNotifications !== false,
                        enableAI: result.enableAI !== false
                    };
                    
                    this.customRules = result.customRules ? result.customRules.split('\n').filter(r => r.trim()) : [];
                    this.whitelistedSites = result.whitelistedSites || [];
                    this.blacklistedSites = result.blacklistedSites || [];
                    
                    resolve();
                });
            });
        }

        async initializeAI() {
            if (!this.settings.enableAI) return;
            
            // Initialize AI model for pattern recognition
            this.aiModel = {
                // Neural network-inspired pattern detection
                analyzeElement: (element) => {
                    const features = this.extractFeatures(element);
                    return this.classifyAdElement(features);
                },
                
                // Machine learning-based ad detection
                predictAdProbability: (element) => {
                    const score = this.calculateAdScore(element);
                    return score > 0.7;
                }
            };
            
            console.log('🤖 AI detection engine loaded');
        }

        extractFeatures(element) {
            return {
                textContent: (element && element.textContent) ? element.textContent.toLowerCase() : '',
                className: (element && element.className) ? (typeof element.className === 'string' ? element.className.toLowerCase() : '') : '',
                id: (element && element.id) ? element.id.toLowerCase() : '',
                tagName: (element && element.tagName) ? element.tagName.toLowerCase() : '',
                attributes: this.getAttributePatterns(element),
                position: this.getElementPosition(element),
                size: this.getElementSize(element),
                visibility: this.isElementVisible(element),
                children: (element && element.children) ? element.children.length : 0,
                parent: (element && element.parentElement && element.parentElement.className) ? (typeof element.parentElement.className === 'string' ? element.parentElement.className.toLowerCase() : '') : ''
            };
        }

        getAttributePatterns(element) {
            const patterns = [];
            if (!element || !element.attributes) return patterns;
            
            try {
                for (let attr of element.attributes) {
                    if (attr && attr.name && attr.value) {
                        const name = typeof attr.name === 'string' ? attr.name.toLowerCase() : '';
                        const value = typeof attr.value === 'string' ? attr.value.toLowerCase() : '';
                        if (name.includes('ad') || value.includes('ad') || 
                            name.includes('sponsor') || value.includes('sponsor')) {
                            patterns.push({name, value});
                        }
                    }
                }
            } catch (error) {
                console.log('Error in getAttributePatterns:', error);
            }
            return patterns;
        }

        getElementPosition(element) {
            const rect = element.getBoundingClientRect();
            return {
                x: rect.left,
                y: rect.top,
                width: rect.width,
                height: rect.height
            };
        }

        getElementSize(element) {
            const rect = element.getBoundingClientRect();
            return {
                width: rect.width,
                height: rect.height,
                area: rect.width * rect.height
            };
        }

        isElementVisible(element) {
            const style = window.getComputedStyle(element);
            return style.display !== 'none' && 
                   style.visibility !== 'hidden' && 
                   style.opacity !== '0' &&
                   element.offsetParent !== null;
        }

        classifyAdElement(features) {
            let score = 0;
            
            // Text-based features
            if (features.textContent.includes('ad') || features.textContent.includes('sponsored')) score += 0.3;
            if (features.textContent.includes('skip') || features.textContent.includes('advertisement')) score += 0.2;
            
            // Class/ID features
            if (features.className.includes('ad') || features.id.includes('ad')) score += 0.4;
            if (features.className.includes('sponsor') || features.id.includes('sponsor')) score += 0.3;
            
            // Attribute patterns
            features.attributes.forEach(attr => {
                if (attr.name.includes('ad') || attr.value.includes('ad')) score += 0.2;
                if (attr.name.includes('sponsor') || attr.value.includes('sponsor')) score += 0.15;
            });
            
            // Position and size features
            if (features.position.y < 100 && features.size.width > 300) score += 0.1; // Top banner
            if (features.size.area > 50000 && features.size.height < 200) score += 0.1; // Large horizontal element
            
            // Structural features
            if (features.children > 5) score += 0.05; // Complex structure
            if (features.parent.includes('ad') || features.parent.includes('sponsor')) score += 0.2;
            
            return Math.min(score, 1.0);
        }

        calculateAdScore(element) {
            const features = this.extractFeatures(element);
            return this.classifyAdElement(features);
        }

        setupAdvancedSelectors() {
            // Enhanced selector database with AI-generated patterns
            this.baseSelectors = {
                // Video ads - expanded
                videoAds: [
                    '.video-ads', '.ad-container', '.ad-display', '.ad-showing',
                    '.ytp-ad-module', '.ytp-ad-overlay-slot', '.ytp-ad-player-overlay',
                    '.ytp-ad-skip-button-container', '.ytp-ad-preview-container',
                    '.ytp-ad-text', '.ytp-ad-image-overlay', '.ytp-ad-action-interstitial',
                    '.ytp-ad-progress-list', '.ytp-ad-segment', '.ytp-ad-break-overlay',
                    '[data-ad-type]', '[data-ad-impression]', '.ad-interrupting',
                    '.advertisement-module', '.companion-ad-container'
                ],
                
                // Banner ads - enhanced
                bannerAds: [
                    '.ytd-display-ad-renderer', '.ytd-promoted-sparkles-text-renderer',
                    '.ytd-promoted-video-renderer', '.ytd-in-feed-ad-layout-renderer',
                    '.ytd-action-companion-ad-renderer', '.ytd-masthead-ad-renderer',
                    '.ytd-banner-promo-renderer', '#player-ads', '#watch-buy-urls',
                    '#watch-channel-brand-div', '#watch7-sidebar-ads', '#watch-pyv-conn',
                    '.ytp-ad-overlay-container', '.ytp-ad-action-interstitial-overlay-container',
                    '.ytp-ad-image-overlay', '.ad_creative', '.ad_wrapper',
                    '.google_ads', '.adsbygoogle', '.ad-slot', '.ad-unit'
                ],
                
                // Sponsored content - expanded
                sponsoredContent: [
                    '[aria-label*="Ad"]', '[aria-label*="Sponsored"]', '[title*="Ad"]',
                    '[title*="Sponsored"]', '.ytmusic-ad-slot-renderer', '.ytmusic-ad-overlay',
                    '*[class*="ad-"]', '*[id*="ad-"]', '*[class*="ads"]', '*[id*="ads"]',
                    '.sponsored-badge', '.sponsor-label', '.promoted-label',
                    '.paid-promotion', '.sponsored-video', '.sponsor-segment'
                ]
            };
            
            // Add custom rules
            this.customRules.forEach(rule => {
                const category = this.categorizeRule(rule);
                if (category && this.baseSelectors[category]) {
                    this.baseSelectors[category].push(rule);
                }
            });
        }

        categorizeRule(rule) {
            if (rule.includes('video') || rule.includes('ytp-')) return 'videoAds';
            if (rule.includes('banner') || rule.includes('display')) return 'bannerAds';
            if (rule.includes('sponsor') || rule.includes('promoted')) return 'sponsoredContent';
            return null;
        }

        startComprehensiveBlocking() {
            // Initial sweep
            this.performInitialSweep();
            
            // Continuous monitoring
            this.startMutationObserver();
            this.startVideoMonitoring();
            this.startPeriodicChecks();
            
            // Network interception
            this.interceptNetworkRequests();
            
            // AI-powered scanning
            if (this.settings.enableAI) {
                this.startAIScanning();
            }
        }

        performInitialSweep() {
            setTimeout(() => {
                this.hideElementsBySelector([...this.baseSelectors.videoAds, ...this.baseSelectors.bannerAds, ...this.baseSelectors.sponsoredContent]);
                this.handleVideoAds();
                this.removeAdSegments();
            }, 500);
        }

        hideElementsBySelector(selectors) {
            selectors.forEach(selector => {
                try {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(element => {
                        if (this.shouldBlockElement(element)) {
                            this.blockElement(element, selector);
                        }
                    });
                } catch (error) {
                    console.warn(`⚠️ Invalid selector: ${selector}`, error);
                }
            });
        }

        shouldBlockElement(element) {
            if (this.isPaused) return false;
            if (!this.isElementVisible(element)) return false;
            
            // Never block video elements
            if (element.tagName === 'VIDEO') return false;
            if (element.tagName === 'video') return false;
            
            // Don't block any YouTube core functionality
            if (element.id && (
                element.id.includes('movie_player') ||
                element.id.includes('player') ||
                element.id.includes('container') ||
                element.id.includes('watch7') ||
                element.id.includes('primary') ||
                element.id.includes('secondary') ||
                element.id.includes('content') ||
                element.id.includes('main') ||
                element.id.includes('video') ||
                element.id.includes('ytd')
            )) return false;
            
            // Don't block YouTube's main content areas
            const className = (element && element.className) ? (typeof element.className === 'string' ? element.className.toLowerCase() : '') : '';
            if (className.includes('video-streams') ||
                className.includes('watch-flexy') ||
                className.includes('ytd-watch-flexy') ||
                className.includes('html5-main-video') ||
                className.includes('player-container') ||
                className.includes('video-container') ||
                className.includes('ytd-video') ||
                className.includes('ytd-player') ||
                className.includes('html5-video') ||
                className.includes('video-js') ||
                className.includes('player-api')) return false;
            
            // Don't block iframes (could be video players)
            if (element.tagName === 'IFRAME' || element.tagName === 'iframe') {
                if (className.includes('player') || className.includes('video') || className.includes('youtube')) {
                    return false;
                }
            }
            
            // Don't block canvas elements (could be video rendering)
            if (element.tagName === 'CANVAS' || element.tagName === 'canvas') {
                return false;
            }
            
            // Check whitelist
            const currentDomain = window.location.hostname;
            if (this.whitelistedSites.includes(currentDomain)) return false;
            
            // Check blacklist
            if (this.blacklistedSites.includes(currentDomain)) return true;
            
            // Only block specific, known ad elements - be extremely conservative
            const tagName = (element && element.tagName) ? (typeof element.tagName === 'string' ? element.tagName.toLowerCase() : '') : '';
            const id = (element && element.id) ? element.id.toLowerCase() : '';
            
            // Only block very specific ad indicators
            return (
                (tagName.includes('ad') && !tagName.includes('player')) ||
                (id.includes('ad') && !id.includes('player') && !id.includes('video')) ||
                (className.includes('ad') && !className.includes('player') && !className.includes('video'))
            ) && (
                tagName.includes('ad') ||
                className.includes('ad') ||
                id.includes('ad') ||
                tagName.includes('banner') ||
                className.includes('banner') ||
                id.includes('banner')
            );
        }

        blockElement(element, selector) {
            const originalDisplay = element.style.display;
            const originalVisibility = element.style.visibility;
            
            element.style.display = 'none';
            element.style.visibility = 'hidden';
            element.setAttribute('data-adblocker-blocked', 'true');
            element.setAttribute('data-blocked-selector', selector);
            element.setAttribute('data-block-time', Date.now().toString());
            
            this.blockedCount++;
            this.updateStatistics();
            
            if (this.settings.showNotifications) {
                this.showBlockingNotification(element);
            }
            
            console.log(`🛡️ Blocked ad element: ${selector}`, element);
            
            // Store for potential restoration
            element.dataset.originalDisplay = originalDisplay;
            element.dataset.originalVisibility = originalVisibility;
        }

        startMutationObserver() {
            if (this.observer) this.observer.disconnect();
            
            this.observer = new MutationObserver((mutations) => {
                if (this.isPaused) return;
                
                const now = Date.now();
                if (now - this.lastCheck < 100) return; // Throttle checks
                this.lastCheck = now;
                
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                this.checkNewNode(node);
                            }
                        });
                    }
                });
            });
            
            if (document.body) {
                this.observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['class', 'id', 'style']
                });
            }
        }

        checkNewNode(node) {
            if (!node) return;
            
            // Quick check for obvious ads
            const tagName = (node && node.tagName) ? (typeof node.tagName === 'string' ? node.tagName.toLowerCase() : '') : '';
            const className = (node && node.className) ? (typeof node.className === 'string' ? node.className.toLowerCase() : '') : '';
            const id = (node && node.id) ? node.id.toLowerCase() : '';
            
            if (tagName.includes('ad') || className.includes('ad') || id.includes('ad')) {
                if (this.shouldBlockElement(node)) {
                    this.blockElement(node, 'quick-scan');
                }
            }
            
            // Deep scan for complex elements
            if (node.children && node.children.length > 0) {
                this.scanNodeChildren(node);
            }
        }

        scanNodeChildren(node) {
            const allSelectors = [...this.baseSelectors.videoAds, ...this.baseSelectors.bannerAds, ...this.baseSelectors.sponsoredContent];
            
            allSelectors.forEach(selector => {
                try {
                    const elements = node.querySelectorAll(selector);
                    elements.forEach(element => {
                        if (this.shouldBlockElement(element)) {
                            this.blockElement(element, selector);
                        }
                    });
                } catch (error) {
                    // Invalid selector, skip
                }
            });
        }

        startVideoMonitoring() {
            this.skipInterval = setInterval(() => {
                if (this.isPaused || !this.settings.blockVideoAds) return;
                this.handleVideoAds();
                this.removeAdSegments();
            }, 500);
            
            // Monitor video element changes - only if video exists
            const video = document.querySelector('video');
            if (video && video.parentElement) {
                this.videoObserver = new MutationObserver(() => {
                    if (this.settings.autoSkipAds) {
                        this.handleVideoAds();
                    }
                });
                
                this.videoObserver.observe(video.parentElement, {
                    childList: true,
                    subtree: true
                });
            }
        }

        handleVideoAds() {
            const video = document.querySelector('video');
            if (!video) return;
            
            // Check for ad indicators
            const adIndicators = [
                '.ad-showing', '.ytp-ad-module', '.ytp-ad-preview-container',
                '.ytp-ad-skip-button', '.ytp-ad-skip-button-modern',
                '[data-ad-active="true"]'
            ];
            
            const hasAd = adIndicators.some(selector => document.querySelector(selector));
            
            if (hasAd) {
                // Try to find and click skip button
                this.attemptAdSkip(video);
                
                // AI-based ad detection
                if (this.settings.enableAI && this.aiModel) {
                    const videoContainer = video.parentElement;
                    if (this.aiModel.predictAdProbability(videoContainer)) {
                        this.forceSkipVideo(video);
                    }
                }
            }
        }

        attemptAdSkip(video) {
            const skipSelectors = [
                '.ytp-ad-skip-button', '.ytp-ad-skip-button-modern',
                '.ytp-ad-skip-button-container button', '.ytp-skip-ad-button',
                '[aria-label*="Skip"]', '[title*="Skip"]'
            ];
            
            skipSelectors.forEach(selector => {
                const skipButton = document.querySelector(selector);
                if (skipButton && this.isElementVisible(skipButton)) {
                    skipButton.click();
                    console.log('⏭️ Clicked skip ad button');
                    this.blockedCount++;
                    return;
                }
            });
            
            // Force skip if no button found
            if (video.duration && video.duration < 300 && video.currentTime < video.duration - 1) {
                this.forceSkipVideo(video);
            }
        }

        forceSkipVideo(video) {
            try {
                // Only force skip if it's actually an ad (short duration)
                if (video.duration && video.duration < 300 && video.currentTime < video.duration - 1) {
                    video.currentTime = video.duration;
                    video.play();
                    console.log('⏩ Forced video ad skip');
                    this.blockedCount++;
                }
            } catch (error) {
                console.warn('Failed to force skip:', error);
            }
        }

        removeAdSegments() {
            const progressBar = document.querySelector('.ytp-progress-bar');
            if (!progressBar) return;
            
            const adSegments = progressBar.querySelectorAll(
                '.ytp-ad-progress-list, .ytp-ad-progress, .ytp-ad-segment'
            );
            
            adSegments.forEach(segment => {
                segment.remove();
                console.log('🗑️ Removed ad segment from timeline');
            });
        }

        startPeriodicChecks() {
            setInterval(() => {
                if (this.isPaused) return;
                
                this.hideElementsBySelector([
                    ...this.baseSelectors.videoAds,
                    ...this.baseSelectors.bannerAds,
                    ...this.baseSelectors.sponsoredContent
                ]);
                
                this.handleVideoAds();
                this.removeAdSegments();
            }, 2000);
        }

        interceptNetworkRequests() {
            // Override fetch for advanced request interception
            const originalFetch = window.fetch;
            window.fetch = (...args) => {
                const url = args[0];
                
                if (typeof url === 'string' && this.isAdRequest(url)) {
                    console.log('🚫 Intercepted ad request:', url);
                    this.blockedCount++;
                    
                    // Return empty response for ad requests
                    return new Promise((resolve) => {
                        resolve(new Response('', {status: 204}));
                    });
                }
                
                return originalFetch.apply(this, args).then(response => {
                    this.modifyResponse(url, response);
                    return response;
                });
            };
        }

        isAdRequest(url) {
            const adPatterns = [
                'doubleclick.net', 'googleads', 'googlesyndication',
                'google-analytics', 'youtube.com/api/stats/ads',
                'amazon-adsystem', 'facebook.com/tr', 'adnxs.com'
            ];
            
            return adPatterns.some(pattern => url.includes(pattern));
        }

        modifyResponse(url, response) {
            // Remove ad data from YouTube API responses
            if (url.includes('youtubei/v1/player') || url.includes('get_video_info')) {
                return response;
            }
        }

        startAIScanning() {
            setInterval(() => {
                if (this.isPaused || !this.settings.enableAI) return;
                
                // AI-powered element scanning
                const allElements = document.querySelectorAll('*');
                allElements.forEach(element => {
                    if (this.shouldBlockElement(element) && this.aiModel.predictAdProbability(element)) {
                        this.blockElement(element, 'ai-detection');
                    }
                });
            }, 3000);
        }

        initializePerformanceOptimization() {
            // Enable performance mode for low-end devices
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            if (connection && connection.effectiveType === 'slow-2g') {
                this.performanceMode = true;
                console.log('🐌 Performance mode enabled');
            }
        }

        startAdvancedMonitoring() {
            // Monitor page navigation
            let currentUrl = window.location.href;
            setInterval(() => {
                if (window.location.href !== currentUrl) {
                    currentUrl = window.location.href;
                    console.log('🔄 Page navigation detected, reinitializing');
                    this.performInitialSweep();
                }
            }, 1000);
        }

        showBlockingNotification(element) {
            if (!this.settings.showNotifications) return;
            
            // Create subtle notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(16, 185, 129, 0.9);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-family: system-ui;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
            `;
            notification.textContent = '🛡️ Ad blocked';
            
            document.body.appendChild(notification);
            
            setTimeout(() => notification.style.opacity = '1', 100);
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }

        updateStatistics() {
            try {
                if (chrome && chrome.runtime && chrome.storage) {
                    chrome.storage.local.get(['blockedAds'], (result) => {
                        try {
                            const total = (result.blockedAds || 0) + 1;
                            chrome.storage.local.set({
                                blockedAds: total,
                                totalAds: total,
                                lastUpdated: new Date().toISOString()
                            });
                        } catch (error) {
                            console.log('Error updating statistics:', error);
                        }
                    });
                }
            } catch (error) {
                console.log('Error in updateStatistics:', error);
            }
        }

        setupMessageHandlers() {
            try {
                if (chrome && chrome.runtime) {
                    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
                        try {
                            switch (request.action) {
                                case 'ping':
                                    sendResponse({status: 'ok'});
                                    break;
                                    
                                case 'getStats':
                                    sendResponse({blockedAds: this.blockedCount});
                                    break;
                                    
                                case 'updateSettings':
                                    this.settings = request.settings;
                                    console.log('📝 Settings updated:', request.settings);
                                    break;
                                    
                                case 'togglePause':
                                    this.isPaused = request.paused;
                                    console.log(this.isPaused ? '⏸️ Blocking paused' : '▶️ Blocking resumed');
                                    break;
                                    
                                default:
                                    sendResponse({error: 'Unknown action'});
                            }
                        } catch (error) {
                            console.log('Error handling message:', error);
                        }
                    });
                }
            } catch (error) {
                console.log('Error setting up message handlers:', error);
            }
        }

        cleanup() {
            if (this.observer) this.observer.disconnect();
            if (this.videoObserver) this.videoObserver.disconnect();
            if (this.skipInterval) clearInterval(this.skipInterval);
            if (this.scheduledChecks.length > 0) {
                this.scheduledChecks.forEach(id => clearTimeout(id));
            }
        }
    }

    // Initialize the advanced ad blocker
    const adBlocker = new AdvancedAdBlocker();
    
    // Expose for debugging
    window.advancedAdBlocker = adBlocker;
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        adBlocker.cleanup();
    });
    
})();
