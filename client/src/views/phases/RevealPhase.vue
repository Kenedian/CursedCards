<script setup>
import {
  ref,
  onMounted,
  onUnmounted
} from "vue"

import SubmissionGrid
from "../../components/game/SubmissionGrid.vue"

import formatBlackCardText
from "../../utils/cards/formatBlackCardText"

const props = defineProps({
  blackCard: Object,
  submissions: Array
})

let cancelled = false

const activeRevealIndex =
  ref(-1)

function wait(ms) {

  return new Promise(resolve =>
    setTimeout(resolve, ms)
  )
}

function isCancelled() {

  return cancelled
}

function getBestVoice() {

  const voices =
    speechSynthesis.getVoices()

  return (

    // Microsoft Jakub first

    voices.find(
      voice =>
        voice.name.includes(
          "Jakub"
        )
    )

    ||

    // Any Microsoft Czech

    voices.find(
      voice =>
        voice.lang === "cs-CZ"
        &&
        voice.name.includes(
          "Microsoft"
        )
    )

    ||

    // Any Czech voice

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

    ||

    // fallback

    voices[0]
  )
}

function speak(text) {

  if (isCancelled()) {
    return Promise.resolve()
  }

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

async function startReveal() {

  await wait(1200)

  if (isCancelled()) {
    return
  }

  for (
    let i = 0;
    i < props.submissions.length;
    i++
  ) {

    if (isCancelled()) {
      return
    }

    const submission =
      props.submissions[i]

    activeRevealIndex.value =
      i

    await wait(350)

    if (isCancelled()) {
      return
    }

    const fullText =
      formatBlackCardText(
        props.blackCard.text,
        submission.cards
      )

    await speak(fullText)

    if (isCancelled()) {
      return
    }

    await wait(250)
  }

  if (isCancelled()) {
    return
  }

  await wait(900)

  if (isCancelled()) {
    return
  }

  activeRevealIndex.value =
    -1
}

onMounted(() => {

  cancelled = false

  speechSynthesis.cancel()

  const loadVoices = () => {

    const voices =
      speechSynthesis.getVoices()
  }

  loadVoices()

  speechSynthesis.onvoiceschanged =
    loadVoices

  startReveal()
})

onUnmounted(() => {

  cancelled = true

  speechSynthesis.cancel()
})
</script>

<template>
  <SubmissionGrid
    :black-card="blackCard"

    :submissions="submissions"

    :active-reveal-index="
      activeRevealIndex
    "

    reveal-mode
  />
</template>