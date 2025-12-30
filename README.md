# YouTube Ad Blocker

A powerful browser extension that blocks YouTube ads, sponsored content, and promotional material across YouTube's platform.

## Features

- **Video Ad Blocking**: Automatically skips or removes video ads
- **Banner Ad Removal**: Hides display ads and banners
- **Sponsored Content Blocking**: Removes sponsored videos and product placements
- **Real-time Statistics**: Track how many ads have been blocked
- **Customizable Settings**: Choose which types of ads to block
- **Whitelist Support**: Allow ads on specific channels if desired
- **Ad Reporting**: Report unblocked ads to improve the blocker
- **Lightweight & Fast**: Minimal impact on browser performance

## Installation

### For Chrome/Edge/Brave (Chromium-based browsers)

1. **Download the extension**
   ```bash
   git clone https://github.com/yourusername/youtube-adblocker.git
   cd youtube-adblocker
   ```

2. **Load the extension in your browser**
   - Open Chrome/Edge/Brave
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `youtube-adblocker` folder

3. **Verify installation**
   - The extension icon should appear in your browser toolbar
   - Visit YouTube to see the ad blocker in action

### For Firefox

1. **Download the extension**
   ```bash
   git clone https://github.com/yourusername/youtube-adblocker.git
   cd youtube-adblocker
   ```

2. **Load the extension in Firefox**
   - Open Firefox
   - Navigate to `about:debugging`
   - Click "This Firefox"
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file

3. **Verify installation**
   - The extension should appear in your extensions list
   - Visit YouTube to see the ad blocker in action

## Usage

### Basic Usage

1. **Automatic Protection**: The extension works automatically once installed
2. **Extension Popup**: Click the extension icon to view:
   - Blocking statistics
   - Settings and preferences
   - Whitelist management
   - Ad reporting tools

### Settings Configuration

- **Block Video Ads**: Toggle video ad blocking on/off
- **Block Banner Ads**: Control display ad removal
- **Block Sponsored Content**: Remove sponsored videos and promotions
- **Auto-Skip Ads**: Automatically skip ads when possible
- **Show Notifications**: Display notifications when ads are blocked

### Whitelist Management

1. **Whitelist Current Site**: Click "Whitelist Site" in the popup
2. **Manage Whitelist**: Use the popup to add/remove sites from whitelist
3. **Temporary Disable**: Disable the extension for specific sites if needed

### Reporting Issues

1. **Report Unblocked Ad**: Click "Report Unblocked Ad" in the popup
2. **Include Screenshots**: The extension captures screenshots automatically
3. **Submit Feedback**: Reports help improve ad detection

## How It Works

### Network-Level Blocking

The extension blocks ad-related network requests:
- Google AdSense and DoubleClick servers
- YouTube ad delivery endpoints
- Third-party ad networks

### DOM Manipulation

Removes ad elements from the page:
- Video ad overlays
- Banner advertisements
- Sponsored content markers
- Product placement prompts

### Video Player Integration

- Detects ad indicators in the YouTube player
- Automatically clicks skip buttons
- Mutes ads during playback
- Fast-forwards through unskippable ads

### API Interception

- Modifies YouTube API responses
- Removes ad data from video metadata
- Prevents ad segment markers in timeline

## Technical Details

### File Structure

```
youtube-adblocker/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for network blocking
├── content.js             # Content script for DOM manipulation
├── video-ad-blocker.js    # Specialized video ad handler
├── styles.css             # CSS rules for hiding ads
├── popup.html             # Extension popup interface
├── popup.css              # Popup styling
├── popup.js               # Popup functionality
├── icons/
│   └── icon.svg           # Extension icon
└── README.md              # This file
```

### Permissions Required

- `webRequest`: Block ad-related network requests
- `webRequestBlocking`: Intercept and block requests
- `storage`: Save settings and statistics
- `tabs`: Access current tab information

### Browser Compatibility

- ✅ Chrome (Manifest V3)
- ✅ Edge (Manifest V3)
- ✅ Brave (Manifest V3)
- ✅ Opera (Manifest V3)
- ⚠️ Firefox (Requires Manifest V2 conversion)

## Troubleshooting

### Common Issues

1. **Extension not working**
   - Ensure developer mode is enabled
   - Check if the extension is properly loaded
   - Try refreshing YouTube pages

2. **Ads still showing**
   - Check extension settings
   - Try clearing browser cache
   - Report unblocked ads for improvement

3. **Performance issues**
   - Extension is optimized for minimal impact
   - Check browser console for errors
   - Disable unnecessary features in settings

### Debug Mode

Enable debug logging:
1. Open browser developer tools (F12)
2. Go to Console tab
3. Filter for "YouTube Ad Blocker" messages

## Privacy & Security

### Data Collection

- **No personal data collected**
- **No browsing history stored**
- **Statistics stored locally only**
- **Anonymous error reporting only**

### Security Measures

- No external server connections
- No third-party tracking
- Minimal permission usage
- Code is open source and auditable

## Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Adding New Ad Selectors

Update `adSelectors` array in `content.js`:
```javascript
const adSelectors = [
  // Add new selectors here
  '.new-ad-class',
  '[data-ad-type="new"]'
];
```

### Updating Ad Patterns

Add new patterns to `adPatterns` in `background.js`:
```javascript
const adPatterns = [
  // Add new URL patterns here
  "*://*.new-ad-domain.com/*"
];
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### Version 1.0.0
- Initial release
- Video ad blocking
- Banner ad removal
- Sponsored content filtering
- Statistics tracking
- Settings management
- Whitelist support
- Ad reporting system

## Support

- **Issues**: Report bugs on GitHub Issues
- **Features**: Request features on GitHub Discussions
- **Security**: Report security issues privately
- **Donations**: Support development (see popup for link)

## Disclaimer

This extension is for educational and personal use only. It may violate YouTube's Terms of Service. Use at your own risk. The developers are not responsible for any consequences of using this extension.

---

**Made with ❤️ for a better YouTube experience**
