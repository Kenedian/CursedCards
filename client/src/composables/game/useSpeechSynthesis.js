import {
  ref,
  onUnmounted
}
from "vue"

import useAudioSettings
from "../useAudioSettings"

let speechUnlockAttempted = false
let speechUnlockInProgress = false
let speechUnlocked = false
let voiceLoadingInitialized = false
let voicesChangedHandler = null

const availableVoices =
  ref([])

function canUseSpeechSynthesis() {
  return (
    typeof window !== "undefined" &&
    Boolean(window.speechSynthesis)
  )
}

function voiceMatchesSetting(
  voice,
  setting
) {
  if (
    !voice ||
    !setting
  ) {
    return false
  }

  return (
    (
      setting.voiceURI &&
      voice.voiceURI === setting.voiceURI
    ) ||
    (
      voice.name === setting.name &&
      voice.lang === setting.lang
    )
  )
}

function serializeVoice(voice) {
  if (!voice) {
    return null
  }

  return {
    voiceURI:
      voice.voiceURI || "",

    name:
      voice.name || "",

    lang:
      voice.lang || ""
  }
}

function preferCzechVoice(voices) {
  return (
    voices.find(
      voice =>
        voice.name.toLowerCase().includes(
          "jakub"
        )
    )

    ||

    voices.find(
      voice =>
        voice.lang.startsWith("cs") &&
        voice.name.toLowerCase().includes(
          "microsoft"
        )
    )

    ||

    voices.find(
      voice =>
        voice.lang === "cs-CZ"
    )

    ||

    voices.find(
      voice =>
        voice.lang.startsWith(
          "cs"
        )
    )
  )
}

function preferEnglishVoice(voices) {
  return (
    voices.find(
      voice =>
        voice.lang === "en-US"
    )

    ||

    voices.find(
      voice =>
        voice.lang.startsWith(
          "en"
        )
    )
  )
}

function refreshAvailableVoices() {
  if (!canUseSpeechSynthesis()) {
    availableVoices.value = []

    return []
  }

  availableVoices.value =
    window.speechSynthesis.getVoices()

  if (
    availableVoices.value.length > 0 &&
    voicesChangedHandler
  ) {
    window.speechSynthesis.removeEventListener?.(
      "voiceschanged",
      voicesChangedHandler
    )

    if (
      window.speechSynthesis.onvoiceschanged ===
      voicesChangedHandler
    ) {
      window.speechSynthesis.onvoiceschanged =
        null
    }

    voicesChangedHandler =
      null
  }

  return availableVoices.value
}

export function getAvailableVoices() {
  return availableVoices.value
}

export function getSelectedVoice() {
  const {
    selectedTtsVoice
  } = useAudioSettings()

  const voices =
    availableVoices.value

  return (
    voices.find(
      voice =>
        voiceMatchesSetting(
          voice,
          selectedTtsVoice.value
        )
    )

    ||

    null
  )
}

export function setSelectedVoice(voice) {
  const {
    selectedTtsVoice
  } = useAudioSettings()

  selectedTtsVoice.value =
    serializeVoice(voice)
}

export function getBestVoice() {
  const {
    selectedTtsVoice
  } = useAudioSettings()

  const voices =
    availableVoices.value

  if (!voices.length) {
    return null
  }

  return (
    voices.find(
      voice =>
        voiceMatchesSetting(
          voice,
          selectedTtsVoice.value
        )
    )

    ||

    preferCzechVoice(voices)

    ||

    preferEnglishVoice(voices)

    ||

    voices[0]
  )
}

function initializeVoiceLoading() {
  if (
    voiceLoadingInitialized ||
    !canUseSpeechSynthesis()
  ) {
    return
  }

  voiceLoadingInitialized =
    true

  const voices =
    refreshAvailableVoices()

  if (voices.length > 0) {
    return
  }

  voicesChangedHandler =
    refreshAvailableVoices

  window.speechSynthesis.addEventListener?.(
    "voiceschanged",
    voicesChangedHandler
  )

  if (!window.speechSynthesis.addEventListener) {
    window.speechSynthesis.onvoiceschanged =
      voicesChangedHandler
  }
}

export function unlockSpeechSynthesis() {
  if (
    speechUnlocked ||
    speechUnlockInProgress ||
    !canUseSpeechSynthesis()
  ) {
    return
  }

  speechUnlockAttempted =
    true

  speechUnlockInProgress =
    true

  try {
    const voice =
      getBestVoice()

    window.speechSynthesis.getVoices()

    window.speechSynthesis.resume()

    window.speechSynthesis.cancel()

    const utterance =
      new SpeechSynthesisUtterance(".")

    utterance.lang =
      voice?.lang || "cs-CZ"

    if (voice) {
      utterance.voice =
        voice
    }

    utterance.volume =
      0.000001

    utterance.rate =
      10

    const unlockTimeout =
      setTimeout(() => {
        if (speechUnlocked) {
          return
        }

        speechUnlockInProgress =
          false
      }, 1500)

    function markUnlocked() {
      speechUnlocked =
        true

      speechUnlockInProgress =
        false

      clearTimeout(unlockTimeout)
    }

    utterance.onstart =
      markUnlocked

    utterance.onend =
      () => {
        markUnlocked()
      }

    utterance.onerror =
      () => {
        speechUnlockInProgress =
          false

        clearTimeout(unlockTimeout)
      }

    window.speechSynthesis.speak(
      utterance
    )
  } catch {
    speechUnlockInProgress =
      false
  }
}

export default function useSpeechSynthesis() {
  const {
    masterVolume,
    ttsVolume,
    ttsEnabled
  } = useAudioSettings()

  function speak(
    text,
    options = {}
  ) {

    return new Promise(resolve => {
      if (!ttsEnabled.value) {
        setTimeout(
          resolve,
          Math.min(
            Math.max(
              1800,
              text.length * 35
            ),
            5000
          )
        )

        return
      }

      if (!canUseSpeechSynthesis()) {
        resolve()

        return
      }

      if (!speechUnlocked) {
        unlockSpeechSynthesis()
      }

      let finished = false

      const fallbackTimer =
        setTimeout(() => {
          finish()
        }, Math.max(6000, text.length * 90))

      window.speechSynthesis.cancel()

      const utterance =

        new SpeechSynthesisUtterance(
          text
        )

      const voice =
        getBestVoice()

      utterance.lang =
        voice?.lang || "cs-CZ"

      utterance.rate =
        0.95

      utterance.pitch =
        1

      utterance.volume =
        Math.min(
          Math.max(
            masterVolume.value *
            ttsVolume.value,
            0
          ),
          1
        )

      if (voice) {

        utterance.voice =
          voice
      }

      function finish() {
        if (finished) {
          return
        }

        finished = true

        clearTimeout(fallbackTimer)

        resolve()
      }

      utterance.onend =
        finish

      utterance.onerror =
        finish

      utterance.onboundary =
        event => {
          options.onBoundary?.({
            charIndex:
              event.charIndex || 0,

            name:
              event.name
          })
        }

      window.speechSynthesis.speak(
        utterance
      )
    })
  }

  function cancelSpeech() {
    if (!canUseSpeechSynthesis()) {
      return
    }

    window.speechSynthesis.cancel()
  }

  initializeVoiceLoading()

  onUnmounted(() => {

    cancelSpeech()
  })

  return {

    speak,

    cancelSpeech,

    availableVoices,

    getBestVoice,

    getSelectedVoice,

    setSelectedVoice
  }
}
