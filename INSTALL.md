# Quick Installation Guide

## 🚀 Install in 2 Minutes

### Chrome/Edge/Brave/Opera (Recommended)

1. **Download the extension**
   ```bash
   # If you have the files locally, skip to step 2
   git clone https://github.com/yourusername/youtube-adblocker.git
   cd youtube-adblocker
   ```

2. **Open browser extensions**
   - Press `Ctrl+Shift+A` (or `Cmd+Shift+A` on Mac)
   - OR navigate to `chrome://extensions/`

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in top right
   - Additional options will appear

4. **Install the extension**
   - Click "Load unpacked"
   - Select the `youtube-adblocker` folder
   - Extension will appear in your extensions list

5. **Verify installation**
   - Look for the YouTube Ad Blocker icon in your toolbar
   - Visit YouTube.com
   - Ads should be automatically blocked!

### Firefox (Advanced Users)

1. **Open about:debugging**
   - Type `about:debugging` in Firefox address bar
   - Click "This Firefox"

2. **Load temporary add-on**
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file from the extension folder

3. **Verify installation**
   - Check extensions list for "YouTube Ad Blocker"
   - Visit YouTube to test

## ✅ Verification Steps

### Basic Test
1. Open YouTube.com
2. Search for any video with ads (e.g., "popular music videos")
3. Play a video
4. Ads should be automatically skipped or not appear

### Advanced Test
1. Click the extension icon in your toolbar
2. Check that statistics are updating
3. Try toggling different settings
4. Test whitelist functionality

## 🔧 Troubleshooting

### Extension Not Working
```bash
# Run the test script to validate installation
cd youtube-adblocker
node test-extension.js
```

**Common Solutions:**
- Reload the extension (`chrome://extensions/` → Reload button)
- Clear browser cache
- Restart browser
- Check for conflicting extensions

### Ads Still Showing
1. **Check Settings**
   - Click extension icon
   - Ensure "Block Video Ads" is enabled
   - Try different combinations of settings

2. **Report Issues**
   - Click "Report Unblocked Ad" in the popup
   - Include screenshots when prompted

### Performance Issues
- Disable unnecessary features in settings
- Clear extension data and reinstall
- Check browser console for errors

## 🎯 Features to Test

| Feature | How to Test | Expected Result |
|---------|--------------|-----------------|
| Video Ad Blocking | Play any video with ads | Ads are skipped automatically |
| Banner Ad Removal | Browse YouTube homepage | No banner ads visible |
| Statistics | Open extension popup | Blocked count increases |
| Settings | Toggle options | Settings save and apply |
| Whitelist | Add channel to whitelist | Ads show on whitelisted channels |

## 📱 Mobile Support

**Android (Chrome Mobile)**
- Extension support is limited on mobile
- Use alternative ad-blocking browsers like Brave
- Or use YouTube Vanced/ReVanced apps

**iOS**
- Safari extensions are possible but require different setup
- Consider content blocker apps from App Store

## 🔒 Privacy & Security

- **No data sent to external servers**
- **All statistics stored locally**
- **No tracking or analytics**
- **Open source and auditable**

## 📞 Support

**Getting Help:**
1. Check the troubleshooting section above
2. Review the full README.md documentation
3. Run the test script to diagnose issues
4. Report bugs on GitHub Issues

** contributing:**
- Fork the repository
- Make improvements
- Submit pull requests
- Help improve ad detection patterns

## 🎉 Success!

Once installed, you should see:
- ✅ No more video ads on YouTube
- ✅ Cleaner YouTube interface
- ✅ Faster page loading
- ✅ Better viewing experience

**Enjoy your ad-free YouTube experience!**

---

**Need help? Check the full [README.md](README.md) for detailed documentation.**
