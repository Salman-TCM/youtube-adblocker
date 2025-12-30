# YouTube Ad Blocker Pro 🛡️

An advanced, AI-powered YouTube ad blocker with real-time analytics, customizable rules, and a modern interface.

## ✨ Features

### 🤖 AI-Powered Detection
- **Machine Learning**: Advanced neural network-inspired pattern recognition
- **Smart Classification**: Automatically identifies new ad formats
- **Adaptive Blocking**: Learns from YouTube's changes in real-time
- **Performance Optimized**: Efficient AI algorithms with minimal resource usage

### 📊 Real-Time Analytics
- **Live Statistics**: Track ads blocked, success rate, and performance
- **Historical Data**: View blocking trends over time
- **Performance Metrics**: Monitor CPU usage, memory, and response times
- **Interactive Charts**: Visual representation of blocking effectiveness

### 🎛️ Advanced Customization
- **Custom Rules**: Add your own CSS selectors and URL patterns
- **Whitelist/Blacklist**: Manage sites to exclude or specifically block
- **Granular Controls**: Toggle specific ad types independently
- **Import/Export Settings**: Backup and share your configuration

### 🎨 Modern Interface
- **Dark/Light Themes**: Automatic theme switching with manual override
- **Tabbed Navigation**: Organized settings and advanced options
- **Responsive Design**: Works perfectly on all screen sizes
- **Smooth Animations**: Professional transitions and micro-interactions

### ⚡ Performance Features
- **Optimized Engine**: Minimal impact on browser performance
- **Performance Mode**: Automatic optimization for low-end devices
- **Resource Monitoring**: Real-time CPU and memory tracking
- **Efficient Algorithms**: Smart caching and throttling

### 🎯 Advanced Blocking
- **Video Ads**: Skips and removes video advertisements
- **Banner Ads**: Eliminates display ads and overlays
- **Sponsored Content**: Hides promoted videos and placements
- **Tracking Prevention**: Blocks ad trackers and analytics
- **Network Interception**: Stops ads at the request level

### ⌨️ Keyboard Shortcuts
- `Ctrl+K` (Cmd+K on Mac): Toggle pause/resume blocking
- `Ctrl+D` (Cmd+D on Mac): Toggle theme
- `Ctrl+R` (Cmd+R on Mac): Reset statistics

## 🚀 Installation

### From Source
1. Clone this repository:
   ```bash
   git clone https://github.com/Salman-TCM/youtube-adblocker.git
   cd youtube-adblocker
   ```

2. Load extension in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the extension folder

### From Chrome Web Store
*(Coming soon)*

## 📖 Usage

### Basic Usage
1. **Install** the extension
2. **Visit YouTube** - ads are blocked automatically
3. **Click the icon** to view statistics and settings

### Advanced Features

#### AI Detection
- Enable "AI-Powered Detection" in Settings
- The extension will learn and adapt to new ad formats
- Monitor AI effectiveness in the Performance tab

#### Custom Rules
1. Go to Advanced tab
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
