// We'll reuse the same AudioContext and nodes.
let audioContext = null;
let sourceNode = null;
let highpass = null;
let notchLow = null;
let notchMid = null;
let notchHigh = null;
let deesser = null;
let compressor = null;
let gainNode = null;
let convolver = null;
let dryGain = null;
let wetGain = null;
let volumeGain = null;
let connected = false;
let lastEnabledState = false;
let deesserEnabled = false;
let reverbEnabled = false;
let volumeBoost = 100;

// Generate simple reverb impulse response
function generateReverbImpulse(audioContext) {
  const rate = audioContext.sampleRate;
  const length = rate * 2; // 2 seconds of reverb
  const impulse = audioContext.createBuffer(2, length, rate);
  const left = impulse.getChannelData(0);
  const right = impulse.getChannelData(1);
  
  for (let i = 0; i < length; i++) {
    left[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
    right[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
  }
  return impulse;
}

function setupAudioGraph(video, enabled) {
  if (!video) {
    console.warn('[VoiceFocus] No video element found');
    return;
  }

  // If already created, just update enabled state
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Create source from the <video>
    sourceNode = audioContext.createMediaElementSource(video);

    // High-pass: remove sub-bass rumble below 80 Hz (music fundamentals)
    highpass = audioContext.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 80; // Hz

    // Notch 1: Remove low bass music (100-250 Hz) where bass lines and kick drums live
    notchLow = audioContext.createBiquadFilter();
    notchLow.type = 'notch';
    notchLow.frequency.value = 160; // Hz
    notchLow.Q = 2.0; // Aggressive notch for music elimination

    // Notch 2: Remove mid-range music energy (400-800 Hz) where guitars/synths sit
    notchMid = audioContext.createBiquadFilter();
    notchMid.type = 'notch';
    notchMid.frequency.value = 600; // Hz
    notchMid.Q = 2.0;

    // Notch 3: Remove upper-mid music (1000-2000 Hz) where some instruments conflict
    notchHigh = audioContext.createBiquadFilter();
    notchHigh.type = 'notch';
    notchHigh.frequency.value = 1500; // Hz
    notchHigh.Q = 1.5; // Slightly less aggressive to preserve some clarity

    // De-esser: reduce harsh sibilants (S, T, SH) at 4-8 kHz
    deesser = audioContext.createBiquadFilter();
    deesser.type = 'notch';
    deesser.frequency.value = 5000; // Hz (sibilant frequency)
    deesser.Q = 2.5; // Tight notch for sibilants
    deesser.gain.value = -8; // Reduce sibilants

    // Reverb setup (convolver for spatial effect)
    convolver = audioContext.createConvolver();
    convolver.buffer = generateReverbImpulse(audioContext);
    
    // Separate dry/wet control for reverb
    dryGain = audioContext.createGain();
    dryGain.gain.value = 1.0;
    
    wetGain = audioContext.createGain();
    wetGain.gain.value = 0.15; // 15% wet (reduced from 30%)

    // Compressor: tame remaining peaks
    compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.value = -25; // dB
    compressor.knee.value = 30;
    compressor.ratio.value = 3; // 3:1 compression
    compressor.attack.value = 0.005; // 5ms
    compressor.release.value = 0.25; // 250ms

    // Output gain (boost to compensate for notch cuts)
    gainNode = audioContext.createGain();
    gainNode.gain.value = 2.5; // Stronger boost for notch-reduced audio

    // Volume control (for user-adjustable volume boost)
    volumeGain = audioContext.createGain();
    volumeGain.gain.value = volumeBoost / 100; // Convert percentage to decimal

    // Default connection is: source → destination (no processing)
    sourceNode.connect(audioContext.destination);

    connected = false;
  }

  // Connect or bypass filters based on 'enabled'
  if (enabled && !connected) {
    console.log('[VoiceFocus] Enabling voice focus with notch filtering');
    sourceNode.disconnect();

    // Build base chain: source → highpass → notch filters
    sourceNode
      .connect(highpass)
      .connect(notchLow)
      .connect(notchMid)
      .connect(notchHigh);
    
    // Conditionally add de-esser to chain
    let lastNode = notchHigh;
    if (deesserEnabled) {
      notchHigh.connect(deesser);
      lastNode = deesser;
    }
    
    // Add compressor
    lastNode.connect(compressor);
    
    // Set up reverb chain
    compressor.connect(dryGain);
    dryGain.connect(gainNode);
    gainNode.connect(volumeGain);
    
    if (reverbEnabled) {
      compressor.connect(convolver);
      convolver.connect(wetGain);
      wetGain.connect(gainNode);
    }
    
    volumeGain.connect(audioContext.destination);

    connected = true;
  } else if (!enabled && connected) {
    console.log('[VoiceFocus] Disabling voice focus filters');
    // Disconnect processing chain and revert to direct playback
    try {
      sourceNode.disconnect();
      highpass.disconnect();
      notchLow.disconnect();
      notchMid.disconnect();
      notchHigh.disconnect();
      if (deesserEnabled) deesser.disconnect();
      compressor.disconnect();
      dryGain.disconnect();
      if (reverbEnabled) {
        convolver.disconnect();
        wetGain.disconnect();
      }
      gainNode.disconnect();
      volumeGain.disconnect();
    } catch (e) {
      console.warn('[VoiceFocus] Disconnect error:', e);
    }

    sourceNode.connect(audioContext.destination);
    connected = false;
  }

  lastEnabledState = enabled;
}

/**
 * Try to find the main <video> element on the page.
 */
function findYoutubeVideo() {
  // YouTube usually has a single main video element
  return document.querySelector('video');
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'VOICE_FOCUS_TOGGLE') {
    deesserEnabled = message.deesserEnabled || false;
    reverbEnabled = message.reverbEnabled || false;
    const video = findYoutubeVideo();
    if (video) {
      setupAudioGraph(video, message.enabled);
      sendResponse({ ok: true });
    } else {
      console.warn('[VoiceFocus] Video element not found when toggling');
      sendResponse({ ok: false, error: 'No video element' });
    }
  } else if (message.type === 'DEESSER_TOGGLE') {
    deesserEnabled = message.enabled;
    console.log('[VoiceFocus] De-esser toggled:', deesserEnabled);
    
    // Rebuild chain immediately if voice focus is active
    if (audioContext && sourceNode) {
      const video = findYoutubeVideo();
      if (video && connected) {
        // Disconnect and reconnect with new de-esser state
        try {
          sourceNode.disconnect();
          highpass.disconnect();
          notchLow.disconnect();
          notchMid.disconnect();
          notchHigh.disconnect();
          if (deesserEnabled) deesser.disconnect();
          compressor.disconnect();
          dryGain.disconnect();
          if (reverbEnabled) {
            convolver.disconnect();
            wetGain.disconnect();
          }
          gainNode.disconnect();
        } catch (e) {}
        
        // Rebuild the chain with new de-esser state
        sourceNode
          .connect(highpass)
          .connect(notchLow)
          .connect(notchMid)
          .connect(notchHigh);
        
        let lastNode = notchHigh;
        if (deesserEnabled) {
          notchHigh.connect(deesser);
          lastNode = deesser;
        }
        
        lastNode.connect(compressor);
        compressor.connect(dryGain);
        dryGain.connect(gainNode);
        gainNode.connect(volumeGain);
        
        if (reverbEnabled) {
          compressor.connect(convolver);
          convolver.connect(wetGain);
          wetGain.connect(gainNode);
        }
        
        volumeGain.connect(audioContext.destination);
        console.log('[VoiceFocus] De-esser chain updated');
      }
    }
  } else if (message.type === 'REVERB_TOGGLE') {
    reverbEnabled = message.enabled;
    console.log('[VoiceFocus] Reverb toggled:', reverbEnabled);
    
    // Rebuild chain immediately if voice focus is active
    if (audioContext && sourceNode) {
      const video = findYoutubeVideo();
      if (video && connected) {
        // Disconnect and reconnect with new reverb state
        try {
          sourceNode.disconnect();
          highpass.disconnect();
          notchLow.disconnect();
          notchMid.disconnect();
          notchHigh.disconnect();
          if (deesserEnabled) deesser.disconnect();
          compressor.disconnect();
          dryGain.disconnect();
          if (reverbEnabled) {
            convolver.disconnect();
            wetGain.disconnect();
          }
          gainNode.disconnect();
          volumeGain.disconnect();
        } catch (e) {}
        
        // Rebuild the chain with new reverb state
        sourceNode
          .connect(highpass)
          .connect(notchLow)
          .connect(notchMid)
          .connect(notchHigh);
        
        let lastNode = notchHigh;
        if (deesserEnabled) {
          notchHigh.connect(deesser);
          lastNode = deesser;
        }
        
        lastNode.connect(compressor);
        compressor.connect(dryGain);
        dryGain.connect(gainNode);
        gainNode.connect(volumeGain);
        
        if (reverbEnabled) {
          compressor.connect(convolver);
          convolver.connect(wetGain);
          wetGain.connect(gainNode);
        }
        
        volumeGain.connect(audioContext.destination);
        console.log('[VoiceFocus] Reverb chain updated');
      }
    }
  } else if (message.type === 'VOLUME_CHANGE') {
    volumeBoost = message.volume;
    console.log('[VoiceFocus] Volume changed:', volumeBoost);
    
    // Update volume gain immediately
    if (volumeGain && audioContext) {
      volumeGain.gain.value = volumeBoost / 100;
      console.log('[VoiceFocus] Volume gain updated to', volumeBoost / 100);
    }
  }
});

// Optional: auto-attach when the page loads (no filters until user clicks)
(function init() {
  const observer = new MutationObserver(() => {
    const video = findYoutubeVideo();
    if (video && audioContext === null) {
      console.log('[VoiceFocus] Video element detected');
      // Prepare the audio graph but keep it disabled until popup tells us
      setupAudioGraph(video, lastEnabledState);
    }
  });

  observer.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true
  });

  // Try once immediately
  const video = findYoutubeVideo();
  if (video) {
    setupAudioGraph(video, lastEnabledState);
  }
})();
