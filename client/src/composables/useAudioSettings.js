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
  ttsEnabled: true
}

const masterVolume =
  ref(defaults.masterVolume)

const effectsVolume =
  ref(defaults.effectsVolume)

const ttsVolume =
  ref(defaults.ttsVolume)

const ttsEnabled =
  ref(defaults.ttsEnabled)

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
  } catch {
    window.localStorage.removeItem(
      STORAGE_KEY
    )
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
        ttsEnabled.value
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
}

watch(
  [
    masterVolume,
    effectsVolume,
    ttsVolume,
    ttsEnabled
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
    resetAudioSettings
  }
}
