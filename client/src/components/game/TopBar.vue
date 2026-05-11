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
  },

  needsReconnect: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  "leave",
  "next-round",
  "back-to-lobby",
  "reconnect",
  "open-settings",
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

      <button
        class="settings-button"
        type="button"
        aria-label="Open audio settings"
        title="Settings"
        @click="
          emit('open-settings')
        "
      >
        <i class="fa-solid fa-gear"></i>
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

          <button
            v-if="props.needsReconnect"
            class="
              btn
              reconnect-button
            "

            @click="
              emit('reconnect')
            "
          >
            Reconnect
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

  padding:
    clamp(8px, 0.65vw, 18px)
    clamp(10px, 0.9vw, 24px)
    clamp(10px, 0.8vw, 20px);

  border-bottom:
    1px solid rgba(47,230,107,0.18);

  margin-bottom:
    clamp(8px, 0.8vw, 20px);

  z-index: 50;

  background:
    linear-gradient(
      180deg,
      rgba(12,16,14,0.82),
      rgba(6,8,7,0.38)
    );

  border-radius: 12px;

  box-shadow:
    0 18px 32px rgba(0,0,0,0.22),
    inset 0 1px 0 rgba(255,255,255,0.06);
}

.top-left,
.top-right {
  display: flex;

  align-items: center;

  gap: clamp(10px, 0.75vw, 20px);
}

.top-right-content {
  display: flex;

  gap: clamp(8px, 0.65vw, 18px);
}

.ready-button {
  width: clamp(150px, 8.5vw, 230px);
  height: clamp(38px, 2.35vw, 60px);

  padding: 0;

  border: none;
  border-radius: 10px;

  font-size: clamp(15px, 0.9vw, 22px);
  font-weight: 900;
  text-transform: uppercase;

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

.reconnect-button {
  height: clamp(38px, 2.35vw, 60px);

  padding: 0 clamp(12px, 0.8vw, 22px);

  border:
    1px solid rgba(255,216,77,0.34);

  border-radius: 10px;

  background:
    rgba(255,216,77,0.14);

  color:
    var(--game-yellow);

  font-size: clamp(13px, 0.8vw, 20px);
  font-weight: 900;
  text-transform: uppercase;

  box-shadow:
    0 0 20px rgba(255,216,77,0.12);

  transition:
    transform 0.16s,
    background 0.16s,
    border-color 0.16s,
    box-shadow 0.16s;
}

.reconnect-button:hover,
.reconnect-button:focus {
  transform:
    translateY(-2px);

  border-color:
    rgba(255,216,77,0.52);

  background:
    rgba(255,216,77,0.22);

  color:
    #ffe680;

  box-shadow:
    0 0 28px rgba(255,216,77,0.2);
}

.leave-button {
  height: clamp(38px, 2.35vw, 60px);

  padding: 0 clamp(16px, 1vw, 28px);

  border: none;
  border-radius: 10px;

  font-size: clamp(15px, 0.9vw, 22px);
  font-weight: 900;
  text-transform: uppercase;

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

.settings-button {
  width: clamp(38px, 2.35vw, 60px);
  height: clamp(38px, 2.35vw, 60px);

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;

  border:
    1px solid rgba(255,255,255,0.12);

  border-radius: 10px;

  background:
    linear-gradient(
      180deg,
      #777f78,
      #515a53 58%,
      #323833
    );

  color:
    white;

  box-shadow:
    0 10px 0 rgba(0,0,0,0.28),
    0 18px 30px rgba(0,0,0,0.22),
    inset 0 1px 0 rgba(255,255,255,0.12);

  transition:
    transform 0.16s ease,
    filter 0.16s ease,
    box-shadow 0.16s ease;
}

.settings-button:hover {
  transform:
    translateY(-2px);

  filter:
    brightness(1.05);

  box-shadow:
    0 0 22px rgba(255,255,255,0.12);
}

.settings-button i {
  font-size: clamp(16px, 1vw, 24px);
}

.capsule {
  height: clamp(38px, 2.35vw, 60px);

  padding: 0 clamp(16px, 1vw, 30px);

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 10px;

  background:
    linear-gradient(
      180deg,
      rgba(24,30,27,0.96),
      rgba(7,10,8,0.96)
    );

  border:
    1px solid rgba(255,255,255,0.1);

  backdrop-filter:
    blur(10px);

  font-size: clamp(13px, 0.8vw, 20px);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;

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

@media (max-width: 1100px) {
  .top-bar {
    padding: 8px 10px 10px;
  }

  .top-left,
  .top-right {
    gap: 8px;
  }

  .top-right-content {
    gap: 8px;
  }

  .leave-button {
    height: 34px;

    padding: 0 12px;

    font-size: 13px;
  }

  .settings-button {
    width: 34px;
    height: 34px;
  }

  .settings-button i {
    font-size: 15px;
  }

  .ready-button {
    width: 118px;
    height: 34px;

    font-size: 13px;
  }

  .reconnect-button {
    height: 34px;

    padding: 0 10px;

    font-size: 12px;
  }

  .capsule {
    min-width: 70px;
    height: 34px;

    padding: 0 12px;

    font-size: 12px;
  }
}

@media (max-width: 900px) {
  .ready-button {
    width: 104px;
  }

  .capsule {
    padding: 0 9px;
  }
}

@media (max-width: 760px) {
  .top-bar {
    align-items: stretch;
    flex-direction: column;

    gap: 8px;

    padding: 8px;
  }

  .top-left,
  .top-right {
    justify-content: space-between;

    gap: 6px;
  }

  .top-right-content {
    flex: 1;
  }

  .leave-button,
  .ready-button,
  .reconnect-button,
  .capsule {
    height: 32px;

    font-size: 11px;
  }

  .leave-button {
    padding: 0 10px;
  }

  .ready-button {
    flex: 1;
    width: auto;
  }

  .settings-button {
    width: 32px;
    height: 32px;
  }

  .settings-button i {
    font-size: 14px;
  }

  .capsule {
    min-width: 0;

    padding: 0 8px;

    white-space: nowrap;
  }
}

@media (max-width: 420px) and (max-height: 720px) {
  .top-bar {
    gap: 6px;

    padding: 6px;

    margin-bottom: 6px;
  }

  .top-left,
  .top-right {
    gap: 5px;
  }

  .leave-button,
  .ready-button,
  .reconnect-button,
  .capsule {
    height: 28px;

    font-size: 10px;
  }

  .settings-button {
    width: 28px;
    height: 28px;
  }

  .settings-button i {
    font-size: 12px;
  }

  .capsule {
    padding: 0 6px;
  }
}
</style>
