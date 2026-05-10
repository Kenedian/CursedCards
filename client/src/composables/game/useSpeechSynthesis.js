import {
  onUnmounted
}
from "vue"

function getBestVoice() {

  const voices =
    speechSynthesis.getVoices()

  return (

    voices.find(
      voice =>
        voice.name.includes(
          "Jakub"
        )
    )

    ||

    voices.find(
      voice =>

        voice.lang ===
        "cs-CZ"

        &&

        voice.name.includes(
          "Microsoft"
        )
    )

    ||

    voices.find(
      voice =>
        voice.lang ===
        "cs-CZ"
    )

    ||

    voices.find(
      voice =>
        voice.lang.startsWith(
          "cs"
        )
    )

    ||

    voices[0]
  )
}

export default function useSpeechSynthesis() {

  function loadVoices() {

    speechSynthesis.getVoices()
  }

  function speak(text) {

    return new Promise(resolve => {

      speechSynthesis.cancel()

      const utterance =

        new SpeechSynthesisUtterance(
          text
        )

      utterance.lang =
        "cs-CZ"

      utterance.rate =
        0.95

      utterance.pitch =
        1

      utterance.volume =
        0.35

      const voice =
        getBestVoice()

      if (voice) {

        utterance.voice =
          voice
      }

      const finish = () => {

        resolve()
      }

      utterance.onend =
        finish

      utterance.onerror =
        finish

      speechSynthesis.speak(
        utterance
      )
    })
  }

  function cancelSpeech() {

    speechSynthesis.cancel()
  }

  loadVoices()

  speechSynthesis.onvoiceschanged =
    loadVoices

  onUnmounted(() => {

    cancelSpeech()
  })

  return {

    speak,

    cancelSpeech
  }
}