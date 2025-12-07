// Background service worker to manage state and relay messages

let voiceFocusEnabled = false;
let deesserEnabled = false;
let reverbEnabled = false;
let volumeBoost = 100;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'VOICE_FOCUS_TOGGLE') {
    voiceFocusEnabled = request.enabled;
    deesserEnabled = request.deesserEnabled || false;
    reverbEnabled = request.reverbEnabled || false;
    console.log('[Background] Voice Focus toggled:', voiceFocusEnabled);

    // Broadcast to all YouTube tabs
    chrome.tabs.query({ url: 'https://www.youtube.com/*' }, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          type: 'VOICE_FOCUS_TOGGLE',
          enabled: voiceFocusEnabled,
          deesserEnabled: deesserEnabled,
          reverbEnabled: reverbEnabled
        }).then(() => {
          console.log('[Background] Message sent to tab', tab.id);
        }).catch(err => {
          console.log('[Background] Tab', tab.id, 'not ready yet');
        });
      });
    });

    sendResponse({ success: true, enabled: voiceFocusEnabled });
  } else if (request.type === 'DEESSER_TOGGLE') {
    deesserEnabled = request.enabled;
    console.log('[Background] De-esser toggled:', deesserEnabled);

    // Broadcast to all YouTube tabs
    chrome.tabs.query({ url: 'https://www.youtube.com/*' }, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          type: 'DEESSER_TOGGLE',
          enabled: deesserEnabled
        }).then(() => {
          console.log('[Background] De-esser message sent to tab', tab.id);
        }).catch(err => {
          console.log('[Background] Tab', tab.id, 'not ready');
        });
      });
    });

    sendResponse({ success: true, deesserEnabled: deesserEnabled });
  } else if (request.type === 'REVERB_TOGGLE') {
    reverbEnabled = request.enabled;
    console.log('[Background] Reverb toggled:', reverbEnabled);

    // Broadcast to all YouTube tabs
    chrome.tabs.query({ url: 'https://www.youtube.com/*' }, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          type: 'REVERB_TOGGLE',
          enabled: reverbEnabled
        }).then(() => {
          console.log('[Background] Reverb message sent to tab', tab.id);
        }).catch(err => {
          console.log('[Background] Tab', tab.id, 'not ready');
        });
      });
    });

    sendResponse({ success: true, reverbEnabled: reverbEnabled });
  } else if (request.type === 'VOLUME_CHANGE') {
    volumeBoost = request.volume;
    console.log('[Background] Volume changed:', volumeBoost);

    // Broadcast to all YouTube tabs
    chrome.tabs.query({ url: 'https://www.youtube.com/*' }, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          type: 'VOLUME_CHANGE',
          volume: volumeBoost
        }).then(() => {
          console.log('[Background] Volume message sent to tab', tab.id);
        }).catch(err => {
          console.log('[Background] Tab', tab.id, 'not ready');
        });
      });
    });

    sendResponse({ success: true, volumeBoost: volumeBoost });
  } else if (request.type === 'GET_STATE') {
    sendResponse({ 
      enabled: voiceFocusEnabled, 
      deesserEnabled: deesserEnabled,
      reverbEnabled: reverbEnabled,
      volumeBoost: volumeBoost
    });
  }
});
