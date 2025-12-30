# YouTube Ad Blocker Pro - Installation Guide 🚀

## 📋 Prerequisites

- **Chrome Browser**: Version 88 or higher
- **Developer Mode**: Enabled in Chrome extensions
- **File Access**: Permission to load unpacked extensions

## 🛠️ Installation Steps

### Method 1: From Source Code

#### Step 1: Download the Extension
```bash
# Clone the repository
git clone https://github.com/Salman-TCM/youtube-adblocker.git

# Or download as ZIP and extract
# https://github.com/Salman-TCM/youtube-adblocker/archive/main.zip
```

#### Step 2: Open Chrome Extensions
1. Open Chrome browser
2. Navigate to `chrome://extensions/`
3. Enable **"Developer mode"** (top right toggle)
4. Click **"Load unpacked"** button

#### Step 3: Load Extension
1. Navigate to the extracted extension folder
2. Select the entire folder (not individual files)
3. Click **"Select Folder"**

#### Step 4: Verify Installation
- Look for "YouTube Ad Blocker Pro" in your extensions list
- Check that the extension icon appears in your toolbar
- Visit YouTube to verify ads are being blocked

### Method 2: From Chrome Web Store
*(Coming soon - will be available once published)*

## ✅ Verification Steps

### 1. Check Extension Status
1. Click the extension icon in your toolbar
2. Verify the popup opens with the "Ad Blocker Pro" interface
3. Check that the status shows "Active"

### 2. Test on YouTube
1. Navigate to `https://www.youtube.com`
2. Play a video that typically has ads
3. Observe that ads are skipped or removed
4. Check the extension popup for increasing blocked count

### 3. Run Test Suite
1. Open YouTube in a new tab
2. Open Developer Console (F12)
3. Type `window.runExtensionTests()` and press Enter
4. Verify all tests pass (80%+ success rate)

## 🔧 Configuration

### Initial Setup
1. **Click the extension icon**
2. **Review Settings** in the Settings tab
3. **Enable AI Detection** for best results
4. **Choose Theme** (Auto/Light/Dark)
5. **Set Preferences** for notifications and auto-skip

### Advanced Configuration
1. **Go to Advanced tab**
2. **Add Custom Rules** if needed
3. **Configure Whitelist/Blacklist**
4. **Export Settings** for backup

## 🚨 Troubleshooting

### Extension Not Working

#### Check Installation
```bash
# Verify extension is enabled
1. Go to chrome://extensions/
2. Find "YouTube Ad Blocker Pro"
3. Ensure the toggle is ON
4. Check for error messages
```

#### Refresh YouTube
```bash
# Clear cache and refresh
1. Open YouTube (Ctrl+T)
2. Press Ctrl+F5 to hard refresh
3. Try a different video
```

#### Check Permissions
```bash
# Verify required permissions
1. chrome://extensions/
2. Click "Details" for the extension
3. Review permissions under "Site access"
4. Ensure "Allow on all sites" is enabled
```

### Common Issues

#### Ads Still Showing
1. **Update Extension**: Download latest version
2. **Enable AI Detection**: Settings > AI-Powered Detection
3. **Clear Cache**: Chrome settings > Clear browsing data
4. **Disable Conflicting Extensions**: Turn off other ad blockers temporarily

#### Extension Icon Missing
1. **Pin Extension**: Click puzzle icon > Pin extension
2. **Check Extensions List**: chrome://extensions/ > Find extension
3. **Restart Chrome**: Close and reopen browser

#### Performance Issues
1. **Disable AI**: If CPU usage is high
2. **Performance Mode**: Enable in Advanced settings
3. **Reduce Check Frequency**: Adjust settings
4. **Clear Statistics**: Reset to improve performance

### Error Messages

#### "Extension Inactive"
- **Cause**: Content script failed to load
- **Solution**: Refresh YouTube page, restart browser

#### "Storage Error"
- **Cause**: Chrome storage quota exceeded
- **Solution**: Clear statistics, export settings first

#### "Network Error"
- **Cause**: Background script communication failed
- **Solution**: Restart browser, check network connection

## 🔄 Updates

### Manual Updates
```bash
# Download latest version
git pull origin main

# Or re-download from GitHub
# 1. Visit repository page
# 2. Click "Code" > "Download ZIP"
# 3. Extract and replace extension folder
```

### Auto Updates (Web Store Version)
- Extensions update automatically through Chrome
- Check for updates in chrome://extensions/
- Enable "Developer mode" for immediate updates

## 📱 Mobile Support

### Chrome on Android
- **Not Supported**: Chrome extensions don't work on mobile
- **Alternative**: Use YouTube Premium or mobile browsers with built-in ad blocking

### Alternative Solutions
- **Brave Browser**: Built-in ad blocking
- **Firefox Mobile**: Extension support (desktop extensions)
- **YouTube Premium**: Official ad-free experience

## 🔒 Security & Privacy

### Data Storage
- **Local Only**: All data stored locally on your device
- **No Tracking**: No user behavior monitoring
- **Optional Analytics**: Can be disabled in settings

### Permissions Explained
| Permission | Purpose | Necessary |
|-------------|---------|-----------|
| storage | Save settings and statistics | ✅ Required |
| tabs | Detect YouTube pages, communicate | ✅ Required |
| webRequest | Block ad network requests | ✅ Required |
| declarativeNetRequest | Efficient request blocking | ✅ Required |
| scripting | Inject content scripts | ✅ Required |
| activeTab | Screenshot for reports | ✅ Required |

### Security Features
- **Content Security Policy**: Strict security headers
- **Sandboxed Execution**: Isolated environment
- **No Remote Code**: All functionality self-contained
- **Open Source**: Full code transparency

## 🎯 Best Practices

### Performance Optimization
1. **Enable Performance Mode** on older devices
2. **Disable AI Detection** if not needed
3. **Clear Statistics** periodically
4. **Use Custom Rules** sparingly

### Privacy Protection
1. **Disable Telemetry** if concerned
2. **Export Settings** for backup
3. **Review Permissions** regularly
4. **Update Frequently** for security

### Troubleshooting Routine
1. **Check Extension Status** first
2. **Refresh YouTube Page**
3. **Run Test Suite** for diagnostics
4. **Report Issues** with details

## 📞 Support

### Getting Help
- **Documentation**: [README.md](README.md)
- **Issues**: [GitHub Issues](https://github.com/Salman-TCM/youtube-adblocker/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Salman-TCM/youtube-adblocker/discussions)

### Reporting Bugs
When reporting issues, include:
- Chrome version
- Extension version
- YouTube URL
- Error messages
- Steps to reproduce

### Feature Requests
- Submit via GitHub Issues
- Label as "enhancement"
- Describe use case clearly
- Consider implementation complexity

## 🎉 Uninstallation

### Remove Extension
1. Go to `chrome://extensions/`
2. Find "YouTube Ad Blocker Pro"
3. Click "Remove" button
4. Confirm removal

### Clear Data
```bash
# Optionally clear all data
1. Before uninstalling: Settings > Export Settings
2. After uninstalling: chrome://settings/content > Site data
3. Search for youtube-adblocker and remove
```

---

**🚀 Enjoy your ad-free YouTube experience!**

If you encounter any issues, please check the [troubleshooting section](#-troubleshooting) or visit our [GitHub repository](https://github.com/Salman-TCM/youtube-adblocker) for support.
