# 🎵 YouTube Voice Focus

<img width="481" height="898" alt="image" src="https://github.com/user-attachments/assets/81aa8a64-86ba-404a-b573-42de3f8d2d3e" />


A powerful Chrome extension that reduces background music and enhances voice clarity on YouTube videos. Perfect for tutorials, podcasts, vlogs, and any content where you need to hear the speaker clearly.

## Features

### 🎙️ Voice Focus (Main Toggle)
- **Reduces background music** while preserving voice clarity
- Uses advanced notch filtering to target specific music frequencies
- Compresses audio to tame loud music peaks
- Dynamic audio processing that adapts to different video types

### 🔇 De-Esser
- Reduces harsh sibilant sounds (S, T, SH frequencies)
- Surgically removes 5 kHz sibilants for smoother audio
- Prevents listening fatigue during long viewing sessions
- Works independently with the voice focus system

### ✨ Reverb
- Adds spacious, room-like ambience to audio
- 15% wet reverb blend for natural sound
- 2-second exponential decay for realistic spatial effect
- Toggle on/off based on personal preference

### 🔊 Volume Boost
- Adjustable volume control from 1% to 300%
- Real-time adjustment without needing to restart
- Perfect for videos with naturally low audio levels
- Shows current percentage in real-time

## How It Works

The extension uses Web Audio API to create a sophisticated audio processing chain:

```
Video Source
    ↓
High-Pass Filter (removes sub-bass below 80 Hz)
    ↓
Notch Filter 1 (removes kick drums/bass at 160 Hz)
    ↓
Notch Filter 2 (removes guitars/synths at 600 Hz)
    ↓
Notch Filter 3 (removes conflicting instruments at 1500 Hz)
    ↓
De-Esser [Optional] (removes sibilants at 5 kHz)
    ↓
Dynamics Compressor (tames loud peaks)
    ↓
Reverb [Optional] (adds spatial ambience)
    ↓
Volume Gain (final volume control)
    ↓
Output to Speakers
```

## Installation

1. Clone or download this extension folder
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top right)
4. Click **Load unpacked**
5. Select the `yt-voice-focus` folder
6. The extension icon should appear in your toolbar

## Usage

1. **Open YouTube** and play any video
2. **Click the extension icon** to open the popup
3. **Click "Enable"** to activate voice focus
4. **Toggle features** as needed:
   - ✓ De-Esser (reduces harsh S sounds)
   - ✓ Reverb (adds room ambience)
5. **Adjust Volume Boost** slider (1-300%) for optimal levels
6. **Enjoy crystal-clear dialogue!**

## Audio Settings

### Default Voice Focus Settings
- **Highpass Frequency:** 80 Hz (removes sub-bass)
- **Notch 1:** 160 Hz, Q=2.0 (bass/kick drums)
- **Notch 2:** 600 Hz, Q=2.0 (guitars/synths)
- **Notch 3:** 1500 Hz, Q=1.5 (mid instruments)
- **Compression Ratio:** 3:1
- **Compression Threshold:** -25 dB
- **Compression Attack:** 5ms
- **Compression Release:** 250ms

### De-Esser Settings
- **Frequency:** 5000 Hz (sibilant range)
- **Q:** 2.5 (tight notch)
- **Reduction:** -8 dB

### Reverb Settings
- **Decay Time:** 2 seconds
- **Wet Signal:** 15% (subtle ambience)
- **Dry Signal:** 85% (preserved original)

## Best For

- 📚 Educational tutorials and courses
- 🎙️ Podcasts and interviews
- 📺 Vlogs and commentary videos
- 🎬 Movies and TV shows with background music
- 🎮 Gaming videos with music overlays
- 📹 Any content where clarity is important

## File Structure

```
yt-voice-focus/
├── manifest.json          # Extension configuration
├── background.js          # Service worker (state management)
├── content-script.js      # Audio processing logic
├── popup.html             # UI interface
├── popup.js               # UI functionality
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              # This file
```

## Technical Details

- **Manifest Version:** 3 (Chrome Extension Manifest V3)
- **API Used:** Web Audio API
- **Permissions:** `scripting`, `tabs`, YouTube host permissions
- **Background:** Service worker for state persistence
- **Content Script:** Real-time audio processing on YouTube tabs

## Troubleshooting

### Extension not working on YouTube
- Ensure the extension is **enabled** on the tab
- Try **refreshing** the YouTube page
- Check that you have the latest version

### Volume changes not applying
- Ensure Voice Focus is **enabled** first
- Try **adjusting the slider** again
- Volume only works when extension is active

### No audio effect heard
- Make sure the **status indicator is green** (active)
- Try **clicking Enable** again
- Check your system volume

## Performance

- Minimal CPU/memory overhead
- Real-time processing with <5ms latency
- No lag or stuttering
- Works smoothly on most systems

## Browser Support

- ✅ Google Chrome (v90+)
- ✅ Chromium-based browsers (Edge, Brave, Opera)
- ❌ Firefox (requires separate version)
- ❌ Safari (requires separate version)

## Limitations

- Only works on YouTube videos
- Audio processing happens in real-time only
- Cannot export/save processed audio
- Settings reset when browser closes (persists across tabs during session)

## Future Enhancements

- [ ] Custom frequency presets
- [ ] Individual gain controls for each filter
- [ ] Preset saving/loading
- [ ] A/B comparison toggle
- [ ] Support for other video platforms
- [ ] Equalizer interface
- [ ] Audio visualization

## Contributing

Found a bug or have a suggestion? Feel free to report it!

## License

This extension is provided as-is for personal use.

## Credits

**Icon Design:** [Afif Fudin](https://www.flaticon.com/authors/afif-fudin) - [Enable sound icons from Flaticon](https://www.flaticon.com/free-icons/enable-sound)

## Support

For issues or questions, check the Chrome Web Store page or verify all files are present in the extension folder.

---

**Made with ❤️ for better audio clarity on YouTube**
