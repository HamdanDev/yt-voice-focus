let enabled = false;
let deesserEnabled = false;
let reverbEnabled = false;
let volumeBoost = 100;
const toggleBtn = document.getElementById('toggle');
const deesserCheckbox = document.getElementById('deesser');
const reverbCheckbox = document.getElementById('reverb');
const volumeSlider = document.getElementById('volumeSlider');
const volumeValue = document.getElementById('volumeValue');
const indicator = document.getElementById('indicator');
const statusText = document.getElementById('statusText');

// Load initial state from background
chrome.runtime.sendMessage({ type: 'GET_STATE' }, (response) => {
  enabled = response?.enabled || false;
  deesserEnabled = response?.deesserEnabled || false;
  reverbEnabled = response?.reverbEnabled || false;
  volumeBoost = response?.volumeBoost || 100;
  updateUI();
});

toggleBtn.addEventListener('click', () => {
  enabled = !enabled;
  updateUI();

  // Send toggle message to background worker
  chrome.runtime.sendMessage({
    type: 'VOICE_FOCUS_TOGGLE',
    enabled,
    deesserEnabled,
    reverbEnabled
  });
});

deesserCheckbox.addEventListener('change', () => {
  deesserEnabled = deesserCheckbox.checked;

  // Send de-esser toggle to background worker
  chrome.runtime.sendMessage({
    type: 'DEESSER_TOGGLE',
    enabled: deesserEnabled,
    voiceFocusActive: enabled
  });
});

reverbCheckbox.addEventListener('change', () => {
  reverbEnabled = reverbCheckbox.checked;

  // Send reverb toggle to background worker
  chrome.runtime.sendMessage({
    type: 'REVERB_TOGGLE',
    enabled: reverbEnabled,
    voiceFocusActive: enabled
  });
});

volumeSlider.addEventListener('input', () => {
  volumeBoost = parseInt(volumeSlider.value);
  volumeValue.textContent = volumeBoost + '%';

  // Send volume change to background worker
  chrome.runtime.sendMessage({
    type: 'VOLUME_CHANGE',
    volume: volumeBoost
  });
});

function updateUI() {
  updateButtonText();
  updateStatusIndicator();
  updateDeesserCheckbox();
  updateReverbCheckbox();
  updateVolumeSlider();
}

function updateButtonText() {
  toggleBtn.textContent = enabled ? 'Disable' : 'Enable';
}

function updateStatusIndicator() {
  if (enabled) {
    indicator.classList.add('active');
    statusText.textContent = 'Status: Active';
  } else {
    indicator.classList.remove('active');
    statusText.textContent = 'Status: Disabled';
  }
}

function updateDeesserCheckbox() {
  deesserCheckbox.checked = deesserEnabled;
}

function updateReverbCheckbox() {
  reverbCheckbox.checked = reverbEnabled;
}

function updateVolumeSlider() {
  volumeSlider.value = volumeBoost;
  volumeValue.textContent = volumeBoost + '%';
}
