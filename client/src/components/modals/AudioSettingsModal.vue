<script setup>
import {
  computed
}
from "vue"

import useAudioSettings
from "../../composables/useAudioSettings"

import {
  playSound
}
from "../../composables/useGameAudio"

import useSpeechSynthesis
from "../../composables/game/useSpeechSynthesis"

const emit = defineEmits([
  "close"
])

const {
  masterVolume,
  effectsVolume,
  ttsVolume,
  ttsEnabled,
  progressiveTtsEnabled,
  selectedTtsVoice,
  resetAudioSettings
} = useAudioSettings()

const {
  speak,
  availableVoices,
  getBestVoice,
  setSelectedVoice
} = useSpeechSynthesis()

const selectedVoiceKey = computed({
  get() {
    return (
      voiceKey(
        availableVoices.value.find(
          voice =>
            (
              selectedTtsVoice.value?.voiceURI &&
              voice.voiceURI === selectedTtsVoice.value.voiceURI
            ) ||
            (
              voice.name === selectedTtsVoice.value?.name &&
              voice.lang === selectedTtsVoice.value?.lang
            )
        )

        ||

        getBestVoice()
      )
    )
  },

  set(value) {
    setSelectedVoice(
      availableVoices.value.find(
        voice =>
          voiceKey(voice) === value
      )

      ||

      null
    )
  }
})

function percent(value) {
  return Math.round(
    value * 100
  )
}

function voiceKey(voice) {
  if (!voice) {
    return ""
  }

  return [
    voice.voiceURI,
    voice.name,
    voice.lang
  ].join("|")
}

function voiceLabel(voice) {
  return `${voice.name} (${voice.lang})`
}

function previewEffects() {
  playSound("uiClick")
}

function previewTts() {
  speak(
    "Test hlasového čtení. Karty jsou připravené."
  )
}
</script>

<template>
  <div
    class="modal-backdrop"
    @click="emit('close')"
  >
    <section
      class="settings-modal"
      aria-modal="true"
      role="dialog"
      aria-labelledby="audio-settings-title"
      @click.stop
    >
      <div class="modal-header">
        <div>
          <p class="eyebrow">
            Settings
          </p>

          <h2 id="audio-settings-title">
            Audio
          </h2>
        </div>

        <button
          class="icon-button"
          type="button"
          aria-label="Close audio settings"
          title="Close"
          @click="emit('close')"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="settings-list">
        <label class="slider-row">
          <span>
            Master
          </span>

          <input
            v-model.number="masterVolume"
            type="range"
            min="0"
            max="1"
            step="0.01"
          >

          <strong>
            {{ percent(masterVolume) }}%
          </strong>
        </label>

        <label class="slider-row">
          <span>
            Effects
          </span>

          <input
            v-model.number="effectsVolume"
            type="range"
            min="0"
            max="1"
            step="0.01"
          >

          <strong>
            {{ percent(effectsVolume) }}%
          </strong>
        </label>

        <label class="slider-row">
          <span>
            TTS
          </span>

          <input
            v-model.number="ttsVolume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            :disabled="!ttsEnabled"
          >

          <strong>
            {{ percent(ttsVolume) }}%
          </strong>
        </label>

        <label class="toggle-row">
          <span>
            TTS enabled
          </span>

          <input
            v-model="ttsEnabled"
            type="checkbox"
          >
        </label>

        <label
          class="toggle-row"
          :class="{
            disabled: !ttsEnabled
          }"
        >
          <span>
            Progressive TTS
          </span>

          <input
            v-model="progressiveTtsEnabled"
            type="checkbox"
            :disabled="!ttsEnabled"
          >
        </label>

        <label
          class="voice-row"
          :class="{
            disabled: !ttsEnabled
          }"
        >
          <span>
            TTS voice
          </span>

          <select
            v-model="selectedVoiceKey"
            class="form-control voice-select"
            :disabled="
              !ttsEnabled ||
              availableVoices.length === 0
            "
          >
            <option
              v-if="availableVoices.length === 0"
              value=""
            >
              No browser voices found
            </option>

            <option
              v-for="voice in availableVoices"
              :key="voiceKey(voice)"
              :value="voiceKey(voice)"
            >
              {{ voiceLabel(voice) }}
            </option>
          </select>
        </label>
      </div>

      <div class="modal-actions">
        <button
          class="btn test-button"
          type="button"
          @click="previewEffects"
        >
          Test FX
        </button>

        <button
          class="btn tts-test-button"
          type="button"
          :disabled="!ttsEnabled"
          @click="previewTts"
        >
          Test TTS
        </button>

        <button
          class="btn reset-button"
          type="button"
          @click="resetAudioSettings"
        >
          Reset
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;

  z-index: 200;

  display: flex;
  align-items: center;
  justify-content: center;

  padding:
    calc(18px + env(safe-area-inset-top))
    18px
    calc(18px + env(safe-area-inset-bottom));

  background:
    rgba(0,0,0,0.66);

  backdrop-filter:
    blur(8px);
}

.settings-modal {
  width: min(520px, 100%);
  max-height: calc(100dvh - 36px - env(safe-area-inset-top) - env(safe-area-inset-bottom));

  padding: 24px;

  overflow-y: auto;

  border:
    1px solid var(--game-line);

  border-radius: 14px;

  background:
    linear-gradient(
      180deg,
      var(--game-panel-strong),
      rgba(8,10,9,0.98)
    );

  box-shadow:
    var(--game-shadow),
    inset 0 1px 0 rgba(255,255,255,0.08);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  gap: 18px;

  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 4px;

  color:
    var(--game-yellow);

  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
}

h2 {
  margin: 0;

  font-size: 34px;
  font-weight: 900;
  text-transform: uppercase;
}

.icon-button {
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border:
    1px solid rgba(255,255,255,0.12);

  border-radius: 10px;

  background:
    rgba(255,255,255,0.06);

  color:
    white;

  font-size: 20px;

  transition:
    transform 0.16s ease,
    background 0.16s ease,
    border-color 0.16s ease;
}

.icon-button:hover,
.icon-button:focus {
  transform:
    translateY(-2px);

  border-color:
    rgba(255,255,255,0.24);

  background:
    rgba(255,255,255,0.1);
}

.settings-list {
  display: flex;
  flex-direction: column;

  gap: 18px;
}

.slider-row,
.toggle-row,
.voice-row {
  display: grid;
  grid-template-columns: 104px 1fr 58px;
  align-items: center;

  gap: 16px;

  min-height: 54px;

  padding: 0 14px;

  border:
    1px solid rgba(255,255,255,0.08);

  border-radius: 10px;

  background:
    rgba(255,255,255,0.04);
}

.slider-row span,
.toggle-row span,
.voice-row span {
  color:
    rgba(255,255,255,0.9);

  font-size: 16px;
  font-weight: 900;
  text-transform: uppercase;
}

.slider-row strong {
  text-align: right;

  color:
    var(--game-yellow);

  font-size: 15px;
  font-weight: 900;
}

input[type="range"] {
  width: 100%;

  accent-color:
    var(--game-green);
}

input[type="range"]:disabled {
  opacity: 0.35;
}

.toggle-row {
  grid-template-columns: 1fr 54px;
}

.toggle-row input {
  width: 28px;
  height: 28px;

  justify-self: end;

  accent-color:
    var(--game-green);
}

.toggle-row.disabled {
  opacity: 0.48;
}

.voice-row {
  grid-template-columns: 104px minmax(0, 1fr);

  padding:
    12px
    14px;
}

.voice-select {
  min-width: 0;
  height: 44px;

  padding:
    0
    12px;

  font-size: 14px;
}

.voice-row.disabled {
  opacity: 0.58;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;

  gap: 12px;

  margin-top: 24px;
}

.test-button,
.tts-test-button,
.reset-button {
  height: 44px;

  padding: 0 18px;

  font-size: 14px;
}

.test-button {
  background:
    linear-gradient(
      180deg,
      #5ba7ff,
      #1f6fff 58%,
      #1649ad
    );
}

.tts-test-button {
  background:
    linear-gradient(
      180deg,
      #43f27d,
      #24b85a 58%,
      #12682e
    );
}

.reset-button {
  background:
    linear-gradient(
      180deg,
      #777f78,
      #515a53 58%,
      #323833
    );
}

@media (max-width: 620px) {
  .settings-modal {
    padding: 18px;
  }

  h2 {
    font-size: 28px;
  }

  .slider-row {
    grid-template-columns: 1fr 58px;
    grid-template-rows: auto auto;

    padding: 12px;
  }

  .slider-row input {
    grid-column: 1 / 3;
  }

  .voice-row {
    grid-template-columns: 1fr;

    gap: 10px;
  }

  .voice-select {
    width: 100%;
  }

  .modal-actions {
    gap: 8px;
  }

  .test-button,
  .tts-test-button,
  .reset-button {
    flex: 1;

    height: 40px;

    padding: 0 8px;

    font-size: 12px;
  }
}
</style>
