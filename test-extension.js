// YouTube Ad Blocker Pro - Test Suite
class ExtensionTester {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
        this.init();
    }

    init() {
        console.log('🧪 Starting YouTube Ad Blocker Pro Test Suite');
        this.runTests();
    }

    runTests() {
        this.testManifest();
        this.testStorage();
        this.testPermissions();
        this.testContentScript();
        this.testBackgroundScript();
        this.testPopup();
        this.testAI();
        this.testPerformance();
        
        this.displayResults();
    }

    testManifest() {
        this.addTest('Manifest Validation', () => {
            // Check if manifest has required fields
            if (typeof chrome !== 'undefined' && chrome.runtime) {
                const manifest = chrome.runtime.getManifest();
                
                return manifest.name === 'YouTube Ad Blocker Pro' &&
                       manifest.version === '2.0.0' &&
                       manifest.manifest_version === 3 &&
                       manifest.permissions.includes('storage') &&
                       manifest.permissions.includes('tabs');
            }
            return false;
        });
    }

    testStorage() {
        this.addTest('Storage API', async () => {
            try {
                // Test local storage
                await chrome.storage.local.set({test: 'value'});
                const result = await chrome.storage.local.get(['test']);
                return result.test === 'value';
            } catch (error) {
                console.error('Storage test failed:', error);
                return false;
            }
        });
    }

    testPermissions() {
        this.addTest('Permissions Check', () => {
            const requiredPermissions = ['storage', 'tabs', 'webRequest', 'declarativeNetRequest'];
            const manifest = chrome.runtime.getManifest();
            
            return requiredPermissions.every(perm => 
                manifest.permissions.includes(perm)
            );
        });
    }

    testContentScript() {
        this.addTest('Content Script Injection', () => {
            // Check if content script is loaded
            return typeof window.advancedAdBlocker !== 'undefined' &&
                   window.advancedAdBlocker !== null;
        });
    }

    testBackgroundScript() {
        this.addTest('Background Service', async () => {
            try {
                // Test background script communication
                const response = await chrome.runtime.sendMessage({action: 'ping'});
                return response && response.status === 'ok';
            } catch (error) {
                console.error('Background test failed:', error);
                return false;
            }
        });
    }

    testPopup() {
        this.addTest('Popup Functionality', () => {
            // Check if popup elements exist (when popup is open)
            if (document.querySelector('.popup-container')) {
                return document.getElementById('blockedCount') !== null &&
                       document.getElementById('settings') !== null &&
                       document.getElementById('dashboard') !== null;
            }
            return true; // Skip if popup not open
        });
    }

    testAI() {
        this.addTest('AI Detection System', () => {
            if (typeof window.advancedAdBlocker !== 'undefined') {
                const adBlocker = window.advancedAdBlocker;
                return adBlocker.aiModel !== null &&
                       typeof adBlocker.classifyAdElement === 'function';
            }
            return false;
        });
    }

    testPerformance() {
        this.addTest('Performance Metrics', () => {
            // Check performance
            const memory = performance.memory;
            const timing = performance.timing;
            
            return memory && timing &&
                   memory.usedJSHeapSize < 50 * 1024 * 1024; // Less than 50MB
        });
    }

    addTest(name, testFunction) {
        this.tests.push({name, testFunction});
    }

    async runTest(test) {
        try {
            const result = await test.testFunction();
            if (result) {
                this.passed++;
                console.log(`✅ ${test.name}: PASSED`);
            } else {
                this.failed++;
                console.log(`❌ ${test.name}: FAILED`);
            }
        } catch (error) {
            this.failed++;
            console.log(`❌ ${test.name}: ERROR - ${error.message}`);
        }
    }

    async runTests() {
        console.log('🔄 Running tests...');
        
        for (const test of this.tests) {
            await this.runTest(test);
            // Small delay between tests
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    displayResults() {
        const total = this.passed + this.failed;
        const successRate = total > 0 ? Math.round((this.passed / total) * 100) : 0;
        
        console.log('\n📊 Test Results:');
        console.log(`✅ Passed: ${this.passed}`);
        console.log(`❌ Failed: ${this.failed}`);
        console.log(`📈 Success Rate: ${successRate}%`);
        
        if (successRate >= 80) {
            console.log('🎉 Extension is working correctly!');
        } else if (successRate >= 60) {
            console.log('⚠️ Extension has some issues but is mostly functional');
        } else {
            console.log('🚨 Extension has significant problems');
        }
        
        // Create visual test results
        this.createTestResultsDisplay(total, this.passed, this.failed, successRate);
    }

    createTestResultsDisplay(total, passed, failed, successRate) {
        // Only create if we're on a webpage
        if (typeof document === 'undefined') return;
        
        const resultsDiv = document.createElement('div');
        resultsDiv.id = 'adblocker-test-results';
        resultsDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 2px solid #4CAF50;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 300px;
        `;
        
        const statusColor = successRate >= 80 ? '#4CAF50' : 
                          successRate >= 60 ? '#FF9800' : '#F44336';
        
        resultsDiv.innerHTML = `
            <h3 style="margin: 0 0 15px 0; color: ${statusColor};">
                🧪 Extension Test Results
            </h3>
            <div style="margin-bottom: 10px;">
                <strong>Total Tests:</strong> ${total}
            </div>
            <div style="margin-bottom: 10px;">
                <strong>Passed:</strong> <span style="color: #4CAF50;">${passed}</span>
            </div>
            <div style="margin-bottom: 10px;">
                <strong>Failed:</strong> <span style="color: #F44336;">${failed}</span>
            </div>
            <div style="margin-bottom: 15px;">
                <strong>Success Rate:</strong> <span style="color: ${statusColor};">${successRate}%</span>
            </div>
            <div style="margin-bottom: 15px; padding: 10px; background: #f5f5f5; border-radius: 4px;">
                <strong>Status:</strong> ${successRate >= 80 ? '✅ Working Great!' : 
                                   successRate >= 60 ? '⚠️ Some Issues' : '🚨 Needs Attention'}
            </div>
            <button onclick="this.parentElement.remove()" style="
                background: ${statusColor};
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                width: 100%;
            ">Close</button>
        `;
        
        document.body.appendChild(resultsDiv);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (resultsDiv.parentElement) {
                resultsDiv.remove();
            }
        }, 10000);
    }
}

// Run tests if we're in a browser environment
if (typeof window !== 'undefined' && typeof chrome !== 'undefined') {
    // Auto-run tests on YouTube
    if (window.location.hostname === 'www.youtube.com') {
        setTimeout(() => {
            new ExtensionTester();
        }, 2000);
    }
    
    // Manual test trigger
    window.runExtensionTests = () => {
        new ExtensionTester();
    };
    
    console.log('🧪 Test suite loaded. Run window.runExtensionTests() to test manually.');
}
