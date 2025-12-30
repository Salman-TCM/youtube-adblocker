# YouTube Ad Blocker Pro

I built this extension because I was tired of YouTube ads interrupting videos. It uses advanced algorithms to block every type of ad YouTube throws at you.

## Features

### Ad Blocking
- Skips video ads (pre-roll, mid-roll, post-roll)
- Removes banner ads and overlays
- Hides sponsored content and promoted videos
- Blocks ad trackers and analytics

### Smart Detection
- Learns and adapts to new ad formats
- Pattern recognition for reliable identification
- Quick adaptation to YouTube changes
- Lightweight performance

### Analytics
- Real-time statistics and performance tracking
- Historical blocking trends
- Resource monitoring (CPU, memory)
- Success rate metrics

### Customization
- Custom CSS selector rules
- Whitelist/blacklist management
- Granular ad type controls
- Settings import/export

### Interface
- Dark/light/auto themes
- Clean tabbed navigation
- Responsive design
- Keyboard shortcuts (Ctrl+K, Ctrl+D, Ctrl+R)

## Installation

### Quick Install

1. Download the latest release from [Releases page](https://github.com/Salman-TCM/youtube-adblocker/releases)
2. Unzip the file somewhere you'll remember
3. Open Chrome and go to `chrome://extensions/`
4. Turn on "Developer mode" (top right toggle)
5. Click "Load unpacked" and select the folder you unzipped
6. Done! YouTube ads should now be blocked automatically

### Install from Source

```bash
git clone https://github.com/Salman-TCM/youtube-adblocker.git
cd youtube-adblocker
```

Then follow steps 3-6 from the Quick Install guide.

### Chrome Web Store
Coming soon!

## Usage

### Basic Usage
1. Install the extension
2. Visit YouTube - ads are blocked automatically
3. Click the icon to view statistics and settings

### Advanced Features

#### AI Detection
- Enable "AI-Powered Detection" in Settings
- The extension will learn and adapt to new ad formats
- Monitor AI effectiveness in the Performance tab

#### Custom Rules
1. Go to the Advanced tab
2. Enter CSS selectors or URL patterns
3. Click "Add Rule" to apply

#### Whitelist/Blacklist
1. Navigate to Advanced > Whitelist/Blacklist
2. Add domains or URL patterns
3. Toggle between whitelist and blacklist tabs

#### Export/Import
1. Settings > Export Settings to backup
2. Share your configuration with others
3. Import settings on new devices

## 🔧 Configuration

### Settings Explained

| Setting | Description | Default |
|---------|-------------|----------|
| Block Video Ads | Skip and remove video advertisements | ✅ |
| Block Banner Ads | Remove display ads and banners | ✅ |
| Block Sponsored Content | Hide sponsored videos and placements | ✅ |
| Auto-Skip Ads | Automatically skip ads when possible | ✅ |
| Show Notifications | Display blocking notifications | ✅ |
| AI-Powered Detection | Use advanced AI for ad detection | ✅ |

### Performance Options
- **Theme**: Auto/Light/Dark
- **Animation Speed**: Fast/Normal/Slow
- **Performance Mode**: Enabled automatically on low-end devices

### Custom Rules Format
```css
/* CSS Selectors */
.ad-container
.promoted-video
[data-ad-type]

/* URL Patterns */
*://*.ads.example.com/*
*://tracker.example.com/*
```

## 🛠️ Development

### Project Structure
```
youtube-adblocker/
├── manifest.json          # Extension manifest
├── popup.html            # Main popup interface
├── popup.css             # Modern styling
├── popup.js              # Advanced popup logic
├── content.js            # AI-powered content script
├── background.js         # Background service worker
├── styles.css           # Content injection styles
├── video-ad-blocker.js  # Video-specific handling
├── rules.json           # Declarative net request rules
└── icons/              # Extension icons
```

### Key Technologies
- **Manifest V3**: Latest Chrome extension standards
- **Service Workers**: Efficient background processing
- **Declarative Net Request**: High-performance request blocking
- **CSS Injection**: Dynamic content modification
- **Chrome Storage API**: Persistent settings and statistics

### AI Implementation
The AI detection system uses:
- **Feature Extraction**: Analyzes element attributes, position, and content
- **Pattern Classification**: Neural network-inspired scoring system
- **Adaptive Learning**: Updates detection patterns based on success rate
- **Performance Optimization**: Efficient algorithms with minimal overhead

## 📊 Statistics & Analytics

### Tracked Metrics
- **Ads Blocked**: Total number of advertisements blocked
- **Success Rate**: Percentage of ads successfully blocked
- **Performance**: CPU usage, memory consumption, response time
- **History**: Daily and weekly blocking trends
- **Session Data**: Current session statistics

### Data Storage
- **Local Storage**: Statistics, reports, and temporary data
- **Sync Storage**: Settings and preferences across devices
- **Automatic Cleanup**: Old data pruned to maintain performance

## 🔒 Privacy & Security

### Data Collection
- **No Personal Data**: No tracking of user content or behavior
- **Local Storage**: All data stored locally on user device
- **Optional Analytics**: Statistics tracking can be disabled
- **Open Source**: Full code transparency and auditability

### Security Features
- **Content Security Policy**: Strict security headers
- **Permission Minimization**: Only necessary permissions requested
- **Sandboxed Execution**: Isolated content script environment
- **Regular Updates**: Security patches and improvements

## 🐛 Troubleshooting

### Common Issues

#### Extension Not Working
1. Check if extension is enabled in `chrome://extensions/`
2. Ensure YouTube is fully refreshed (Ctrl+F5)
3. Check for conflicting ad blockers
4. Review error messages in extension popup

#### High CPU Usage
1. Disable AI detection if not needed
2. Reduce checking frequency in settings
3. Enable performance mode
4. Clear custom rules that may be inefficient

#### Ads Not Blocked
1. Update to latest version
2. Check if YouTube changed their interface
3. Enable AI detection for adaptive blocking
4. Report unblocked ads for analysis

### Debug Information
Enable developer console for detailed logging:
- Press F12 on YouTube
- Check Console tab for "🚀 YouTube Ad Blocker Pro" messages
- Report issues with console output

## 🤝 Contributing

### How to Contribute
1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### Development Setup
```bash
# Clone the repository
git clone https://github.com/Salman-TCM/youtube-adblocker.git
cd youtube-adblocker

# Load in Chrome for development
# Open chrome://extensions/ > Developer mode > Load unpacked
```

### Code Style
- **ES6+**: Modern JavaScript features
- **Classes**: Organized object-oriented code
- **Comments**: Comprehensive documentation
- **Performance**: Optimized for efficiency

## 📝 Changelog

### Version 2.0.0
- ✨ AI-powered ad detection
- 📊 Real-time analytics dashboard
- 🎨 Complete UI redesign
- ⚡ Performance optimizations
- 🎛️ Advanced customization options
- ⌨️ Keyboard shortcuts
- 📱 Improved mobile responsiveness

### Version 1.0.0
- 🛡️ Basic ad blocking
- 📊 Simple statistics
- ⚙️ Basic settings

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **YouTube Team**: For the platform we enhance
- **Open Source Community**: For inspiration and tools
- **Contributors**: For making this extension better
- **Users**: For feedback and support

## 📞 Support

### Get Help
- **GitHub Issues**: [Report bugs](https://github.com/Salman-TCM/youtube-adblocker/issues)
- **Discussions**: [Community support](https://github.com/Salman-TCM/youtube-adblocker/discussions)
- **Documentation**: [Wiki](https://github.com/Salman-TCM/youtube-adblocker/wiki)

### Report Issues
When reporting issues, please include:
- Chrome version
- Extension version
- YouTube URL where issue occurs
- Console error messages
- Screenshots if applicable

---

**YouTube Ad Blocker Pro** - Enjoy an ad-free YouTube experience! 🚀
