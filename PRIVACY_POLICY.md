# Privacy Policy for YouTube Voice Focus

## Data Collection
YouTube Voice Focus does NOT collect, store, transmit, or share any user data.

## How It Works
- All audio processing is performed locally on your device using the Web Audio API
- No data is sent to external servers
- No personal information is collected
- No tracking or analytics are used
- No cookies are stored
- No user activity is monitored or logged

## Permissions Explained

### Host Permission (youtube.com)
Required to access and process audio from YouTube videos in real-time. This permission allows the extension to inject audio filters into YouTube's video player.

### Scripting Permission
Required to inject the content script into YouTube pages. The script creates and manages the Web Audio API audio processing chain.

### Tabs Permission
Required to query YouTube tabs and send messages from the background service worker to content scripts, enabling communication between the popup and YouTube pages.

### Why These Permissions?
All permissions are used solely for the core audio processing functionality. They do NOT collect any data about you, your browsing habits, or your videos.

## Audio Processing
- Voice focus filters are applied locally to reduce background music
- De-esser, reverb, and volume boost effects are processed on your device
- The audio never leaves your computer
- YouTube still receives your standard viewing data (as per YouTube's own privacy policy)

## Third-Party Services
This extension does NOT integrate with any third-party services, analytics tools, or data collection platforms.

## Changes to This Policy
We may update this privacy policy from time to time. Any changes will be reflected in this document and you'll be notified of significant changes.

## Contact
For questions about this privacy policy or the extension, please visit:
- **GitHub Repository:** https://github.com/HamdanDev/yt-voice-focus
- **Issues/Questions:** https://github.com/HamdanDev/yt-voice-focus/issues

## Compliance
This extension complies with:
- Chrome Web Store Developer Program Policies
- GDPR (as no personal data is collected)
- CCPA (as no personal data is collected)

---

**Last Updated:** December 9, 2025
