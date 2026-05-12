import useAudioSettings
from "./useAudioSettings"

import {
  unlockSpeechSynthesis
}
from "./game/useSpeechSynthesis"

const SOUND_FILES = {
  uiHover: "/sounds/ui-hover.mp3",
  uiClick: "/sounds/ui-click.mp3",
  cardHover: "/sounds/card-hover.mp3",
  cardPick: "/sounds/card-pick.mp3",
  toastError: "/sounds/toast-error.mp3",
  adminOpen: "/sounds/admin-open.mp3",
  gameOverWinner: "/sounds/game-over-winner.mp3"
}

const SYNTHS = {
  uiHover: {
    type: "sine",
    frequency: 520,
    duration: 0.045,
    gain: 0.018
  },

  uiClick: {
    type: "triangle",
    frequency: 210,
    duration: 0.07,
    gain: 0.04
  },

  cardHover: {
    type: "sine",
    frequency: 320,
    duration: 0.055,
    gain: 0.025
  },

  cardPick: {
    type: "square",
    frequency: 180,
    duration: 0.09,
    gain: 0.035
  },

  toastError: {
    type: "sawtooth",
    frequency: 160,
    duration: 0.14,
    gain: 0.035,
    sweepTo: 110
  },

  adminOpen: {
    type: "triangle",
    frequency: 260,
    duration: 0.2,
    gain: 0.04,
    sweepTo: 520
  },

  gameOverWinner: {
    type: "sawtooth",
    frequency: 180,
    duration: 0.32,
    gain: 0.05,
    sweepTo: 720
  }
}

const volumes = {
  uiHover: 0.55,
  uiClick: 0.75,
  cardHover: 0.55,
  cardPick: 0.82,
  toastError: 0.8,
  adminOpen: 0.85,
  gameOverWinner: 1
}

let audioContext = null
let initialized = false
let lastHoverTarget = null
let lastHoverAt = 0

function getAudioContext() {

  if (!audioContext) {

    const AudioContext =
      window.AudioContext ||
      window.webkitAudioContext

    if (!AudioContext) {
      return null
    }

    audioContext =
      new AudioContext()
  }

  return audioContext
}

function unlockAudio() {

  unlockSpeechSynthesis()

  const context =
    getAudioContext()

  if (
    context &&
    context.state === "suspended"
  ) {

    context.resume()
  }
}

function playFile(src, volume, fallbackName) {

  const audio =
    new Audio(src)

  audio.volume =
    Math.min(
      Math.max(volume, 0),
      1
    )

  audio.play()
    .catch(() => {

      playSynth(
        fallbackName,
        volume
      )
    })
}

function playSynth(name, volume) {

  const context =
    getAudioContext()

  const config =
    SYNTHS[name]

  if (
    !context ||
    !config
  ) {
    return
  }

  const now =
    context.currentTime

  const oscillator =
    context.createOscillator()

  const gain =
    context.createGain()

  oscillator.type =
    config.type

  oscillator.frequency.setValueAtTime(
    config.frequency,
    now
  )

  if (config.sweepTo) {

    oscillator.frequency.exponentialRampToValueAtTime(
      config.sweepTo,
      now + config.duration
    )
  }

  gain.gain.setValueAtTime(
    0.0001,
    now
  )

  gain.gain.exponentialRampToValueAtTime(
    config.gain * volume,
    now + 0.01
  )

  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    now + config.duration
  )

  oscillator.connect(gain)

  gain.connect(
    context.destination
  )

  oscillator.start(now)

  oscillator.stop(
    now + config.duration + 0.02
  )
}

export function playSound(name) {

  if (
    typeof window === "undefined" ||
    !SYNTHS[name]
  ) {
    return
  }

  const {
    masterVolume,
    effectsVolume
  } = useAudioSettings()

  const volume =
    masterVolume.value *
    effectsVolume.value *
    (volumes[name] || 1)

  const src =
    SOUND_FILES[name]

  if (src) {
    playFile(
      src,
      volume,
      name
    )

    return
  }

  playSynth(name, volume)
}

function closestInteractive(target) {

  return target.closest(
    [
      "button:not(:disabled)",
      ".btn:not(:disabled)",
      ".white-card-wrapper:not(.preview-mode)",
      ".reveal-card.clickable",
      ".card-wrapper.edit",
      ".card-wrapper.delete"
    ].join(",")
  )
}

function isCardTarget(target) {

  return Boolean(
    target.closest(
      [
        ".white-card-wrapper:not(.preview-mode)",
        ".reveal-card.clickable",
        ".card-wrapper.edit",
        ".card-wrapper.delete"
      ].join(",")
    )
  )
}

function handlePointerOver(event) {

  const target =
    closestInteractive(event.target)

  if (
    !target ||
    target === lastHoverTarget
  ) {
    return
  }

  const now =
    performance.now()

  if (now - lastHoverAt < 45) {
    return
  }

  lastHoverTarget =
    target

  lastHoverAt =
    now

  playSound(
    isCardTarget(target)
      ? "cardHover"
      : "uiHover"
  )
}

function handlePointerOut(event) {

  if (
    lastHoverTarget &&
    !lastHoverTarget.contains(event.relatedTarget)
  ) {
    lastHoverTarget = null
  }
}

function handleClick(event) {

  unlockSpeechSynthesis()

  const target =
    closestInteractive(event.target)

  if (!target) {
    return
  }

  playSound(
    isCardTarget(target)
      ? "cardPick"
      : "uiClick"
  )
}

export function initGameAudio() {

  if (
    initialized ||
    typeof window === "undefined"
  ) {
    return
  }

  initialized = true

  window.addEventListener(
    "pointerdown",
    unlockAudio,
    {
      passive: true
    }
  )

  window.addEventListener(
    "keydown",
    unlockAudio
  )

  document.addEventListener(
    "pointerover",
    handlePointerOver,
    true
  )

  document.addEventListener(
    "pointerout",
    handlePointerOut,
    true
  )

  document.addEventListener(
    "click",
    handleClick,
    true
  )
}

export default function useGameAudio() {

  return {
    playSound
  }
}
