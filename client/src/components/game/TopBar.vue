<script setup>
import {
  computed
}
from "vue"

import {
  GAME_PHASES
}
from "../../../../shared/constants/gamePhases"

const props = defineProps({
  phase: String,

  isHost: Boolean,
  isReady: Boolean,

  round: Number,
  maxRounds: Number,

  readyCount: Number,
  totalPlayers: Number,

  canReady: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits([
  "leave",
  "next-round",
  "back-to-lobby",
  "toggle-ready"
])

const isLastRound =
  computed(() => {

    return (
      props.round >=
      props.maxRounds
    )
  })

const showReadyCapsule =
  computed(() => {

    return (

      props.phase ===
      GAME_PHASES.PICKING

      ||

      props.phase ===
      GAME_PHASES.VOTING
    )
  })

const showRoundCapsule =
  computed(() => {

    return (

      props.phase !==
      GAME_PHASES.GAME_OVER
    )
  })

const phaseConfig =
  computed(() => {

    switch (props.phase) {

      // PICKING

      case GAME_PHASES.PICKING:

        return {

          text:

            props.isReady
              ? "Unready"
              : "Ready",

          className:

            props.isReady
              ? "btn-danger"
              : "btn-success",

          disabled:
            !props.canReady,

          action:
            "toggle-ready"
        }

      // REVEAL

      case GAME_PHASES.REVEAL:

        return {

          text:
            "Revealing...",

          className:
            "btn-secondary",

          disabled: true
        }

      // VOTING

      case GAME_PHASES.VOTING:

        return {

          text:

            props.isReady
              ? "Unready"
              : "Vote",

          className:

            props.isReady
              ? "btn-danger"
              : "btn-success",

          disabled:
            !props.canReady,

          action:
            "toggle-ready"
        }

      // RESULTS

      case GAME_PHASES.RESULTS:

        if (props.isHost) {

          return {

            text:

              isLastRound.value
                ? "Finish"
                : "Next Round",

            className:
              "btn-primary",

            disabled: false,

            action:
              "next-round"
          }
        }

        return {

          text:
            "Waiting...",

          className:
            "btn-secondary",

          disabled: true
        }

      // GAME OVER

      case GAME_PHASES.GAME_OVER:

        if (props.isHost) {

          return {

            text:
              "Back To Lobby",

            className:
              "btn-primary",

            disabled: false,

            action:
              "back-to-lobby"
          }
        }

        return {

          text:
            "Waiting...",

          className:
            "btn-secondary",

          disabled: true
        }

      default:

        return null
    }
  })

function handleAction() {

  if (
    !phaseConfig.value?.action
  ) {

    return
  }

  emit(
    phaseConfig.value.action
  )
}
</script>

<template>
  <div class="top-bar">

    <!-- LEFT -->

    <div class="top-left">

      <button
        class="
          btn
          btn-danger
          leave-button
        "

        @click="
          emit('leave')
        "
      >
        Leave
      </button>

      <transition
        name="capsule-fade"
      >

        <div
          v-if="
            showReadyCapsule
          "

          class="capsule"
        >

          Ready
          {{ readyCount }}
          /
          {{ totalPlayers }}

        </div>

      </transition>

    </div>

    <!-- RIGHT -->

    <div class="top-right">

      <transition
        name="topbar"
        mode="out-in"
      >

        <div
          class="
            top-right-content
          "
        >

          <button
            v-if="
              phaseConfig
            "

            class="
              btn
              ready-button
            "

            :class="
              phaseConfig.className
            "

            :disabled="
              phaseConfig.disabled
            "

            @click="
              handleAction
            "
          >

            {{
              phaseConfig.text
            }}

          </button>

        </div>

      </transition>

      <!-- ROUND -->

      <transition
        name="capsule-fade"
      >

        <div
          v-if="
            showRoundCapsule
          "

          class="capsule"
        >

          Round
          {{ round }}
          /
          {{ maxRounds }}

        </div>

      </transition>

    </div>

  </div>
</template>

<style scoped>
.top-bar {
  display: flex;

  justify-content:
    space-between;

  align-items: center;

  padding-bottom: 16px;

  border-bottom:
    1px solid rgba(255,255,255,0.04);

  margin-bottom: 12px;

  z-index: 50;
}

.top-left,
.top-right {
  display: flex;

  align-items: center;

  gap: 12px;
}

.top-right-content {
  display: flex;
}

.ready-button {
  width: 160px;
  height: 42px;

  padding: 0;

  border: none;
  border-radius: 16px;

  font-size: 17px;
  font-weight: 600;

  transition:
    transform 0.16s,
    box-shadow 0.16s,
    filter 0.16s;
}

.ready-button:hover:not(:disabled) {
  transform:
    translateY(-2px);

  filter:
    brightness(1.05);
}

.ready-button.btn-success {
  box-shadow:
    0 0 24px rgba(47,230,107,0.25);
}

.ready-button.btn-danger {
  box-shadow:
    0 0 24px rgba(255,80,80,0.22);
}

.leave-button {
  height: 42px;

  padding: 0 18px;

  border: none;
  border-radius: 16px;

  font-size: 17px;
  font-weight: 600;

  transition:
    transform 0.16s,
    box-shadow 0.16s,
    filter 0.16s;
}

.leave-button:hover {
  transform:
    translateY(-2px);

  filter:
    brightness(1.05);

  box-shadow:
    0 0 24px rgba(255,80,80,0.18);
}

.capsule {
  height: 42px;

  padding: 0 18px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 999px;

  background:
    rgba(255,255,255,0.045);

  border:
    1px solid rgba(255,255,255,0.05);

  backdrop-filter:
    blur(10px);

  font-size: 15px;
  font-weight: 600;

  color:
    rgba(255,255,255,0.92);

  box-shadow:
    0 0 18px rgba(0,0,0,0.18);
}

.topbar-enter-active,
.topbar-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.topbar-enter-from {
  opacity: 0;

  transform:
    translateY(4px);
}

.topbar-leave-to {
  opacity: 0;

  transform:
    translateY(-4px);
}

.capsule-fade-enter-active,
.capsule-fade-leave-active {
  transition:
    opacity 0.16s ease;
}

.capsule-fade-enter-from,
.capsule-fade-leave-to {
  opacity: 0;
}
</style>