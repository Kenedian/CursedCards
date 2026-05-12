import {
  ref,
  watch
}
from "vue"

const STORAGE_KEY =
  "cursed-cards-audio-settings"

const defaults = {
  masterVolume: 0.55,
  effectsVolume: 1,
  ttsVolume: 0.35,
  ttsEnabled: true,
  progressiveTtsEnabled: true,
  selectedTtsVoice: null
}

const masterVolume =
  ref(defaults.masterVolume)

const effectsVolume =
  ref(defaults.effectsVolume)

const ttsVolume =
  ref(defaults.ttsVolume)

const ttsEnabled =
  ref(defaults.ttsEnabled)

const progressiveTtsEnabled =
  ref(defaults.progressiveTtsEnabled)

const selectedTtsVoice =
  ref(defaults.selectedTtsVoice)

let loaded = false

function clampVolume(value, fallback) {
  const number =
    Number(value)

  if (Number.isNaN(number)) {
    return fallback
  }

  return Math.min(
    Math.max(number, 0),
    1
  )
}

function loadSettings() {
  if (
    loaded ||
    typeof window === "undefined"
  ) {
    return
  }

  loaded = true

  try {
    const saved =
      JSON.parse(
        window.localStorage.getItem(
          STORAGE_KEY
        )
      )

    if (!saved) {
      return
    }

    masterVolume.value =
      clampVolume(
        saved.masterVolume,
        defaults.masterVolume
      )

    effectsVolume.value =
      clampVolume(
        saved.effectsVolume,
        defaults.effectsVolume
      )

    ttsVolume.value =
      clampVolume(
        saved.ttsVolume,
        defaults.ttsVolume
      )

    ttsEnabled.value =
      saved.ttsEnabled !== false

    progressiveTtsEnabled.value =
      saved.progressiveTtsEnabled !== false

    selectedTtsVoice.value =
      normalizeVoiceSetting(
        saved.selectedTtsVoice
      )
  } catch {
    window.localStorage.removeItem(
      STORAGE_KEY
    )
  }
}

function normalizeVoiceSetting(value) {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return null
  }

  return {
    voiceURI:
      String(value.voiceURI || ""),

    name:
      String(value.name || ""),

    lang:
      String(value.lang || "")
  }
}

function saveSettings() {
  if (
    typeof window === "undefined" ||
    !loaded
  ) {
    return
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      masterVolume:
        masterVolume.value,

      effectsVolume:
        effectsVolume.value,

      ttsVolume:
        ttsVolume.value,

      ttsEnabled:
        ttsEnabled.value,

      progressiveTtsEnabled:
        progressiveTtsEnabled.value,

      selectedTtsVoice:
        selectedTtsVoice.value
    })
  )
}

function resetAudioSettings() {
  masterVolume.value =
    defaults.masterVolume

  effectsVolume.value =
    defaults.effectsVolume

  ttsVolume.value =
    defaults.ttsVolume

  ttsEnabled.value =
    defaults.ttsEnabled

  progressiveTtsEnabled.value =
    defaults.progressiveTtsEnabled

  selectedTtsVoice.value =
    defaults.selectedTtsVoice
}

watch(
  [
    masterVolume,
    effectsVolume,
    ttsVolume,
    ttsEnabled,
    progressiveTtsEnabled,
    selectedTtsVoice
  ],
  saveSettings
)

export default function useAudioSettings() {
  loadSettings()

  return {
    masterVolume,
    effectsVolume,
    ttsVolume,
    ttsEnabled,
    progressiveTtsEnabled,
    selectedTtsVoice,
    resetAudioSettings
  }
}
