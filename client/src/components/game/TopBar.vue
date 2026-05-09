<script setup>
import {
  computed
} from "vue"

import { GAME_PHASES }
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
  computed(() =>
    props.round >=
    props.maxRounds
  )
</script>

<template>
  <div class="top-bar">

    <div class="top-left">

      <button
        class="btn btn-danger leave-button"

        @click="emit('leave')"
      >
        Leave
      </button>

      <transition name="capsule-fade">

        <div
          v-if="
            phase === GAME_PHASES.PICKING ||
            phase === GAME_PHASES.VOTING
          "
          class="capsule"
        >
          Ready {{ readyCount }} / {{ totalPlayers }}
        </div>

      </transition>

    </div>

    <div class="top-right">

      <transition
        name="topbar"
        mode="out-in"
      >

        <div
          :key="phase"
          class="top-right-content"
        >

          <!-- PICKING + VOTING -->

          <template
            v-if="
              phase === GAME_PHASES.PICKING ||
              phase === GAME_PHASES.VOTING
            "
          >

            <button
              class="btn ready-button"

              :class="
                isReady
                  ? 'btn-danger'
                  : 'btn-success'
              "

              :disabled="!canReady"

              @click="
                emit('toggle-ready')
              "
            >

              {{
                isReady
                  ? 'Unready'
                  : 'Ready'
              }}

            </button>

          </template>

          <!-- RESULTS -->

          <template
            v-else-if="
              phase === GAME_PHASES.RESULTS
            "
          >

            <button
              v-if="isHost"

              class="
                btn
                btn-primary
                ready-button
              "

              @click="
                emit('next-round')
              "
            >

              {{
                isLastRound
                  ? "Finish"
                  : "Next Round"
              }}

            </button>

            <button
              v-else

              class="
                btn
                btn-secondary
                ready-button
              "

              disabled
            >
              Waiting...
            </button>

          </template>

          <!-- GAME OVER -->

          <template
            v-else-if="
              phase === GAME_PHASES.GAME_OVER
            "
          >

            <button
              v-if="isHost"

              class="
                btn
                btn-primary
                ready-button
              "

              @click="
                emit('back-to-lobby')
              "
            >
              Back To Lobby
            </button>

            <button
              v-else

              class="
                btn
                btn-secondary
                ready-button
              "

              disabled
            >
              Waiting...
            </button>

          </template>

        </div>

      </transition>

      <!-- ROUND COUNTER -->

      <transition name="capsule-fade">

        <div
          v-if="
            phase !==
            GAME_PHASES.GAME_OVER
          "

          class="capsule"
        >
          Round {{ round }} / {{ maxRounds }}
        </div>

      </transition>

    </div>

  </div>
</template>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 2px;

  z-index: 50;
}

.top-left,
.top-right {
  display: flex;
  align-items: center;

  gap: 10px;
}

.top-right-content {
  display: flex;
}

.ready-button {
  width: 148px;
  height: 38px;

  padding: 0;

  border: none;
  border-radius: 14px;

  font-size: 16px;
  font-weight: 600;

  box-shadow:
    0 0 18px rgba(0,0,0,0.18);

  transition:
    transform 0.16s,
    box-shadow 0.16s,
    filter 0.16s;
}

.ready-button:hover:not(:disabled) {
  transform:
    translateY(-1px);

  filter: brightness(1.04);

  box-shadow:
    0 0 24px rgba(0,0,0,0.24);
}

.leave-button {
  height: 38px;

  padding: 0 16px;

  border: none;
  border-radius: 14px;

  font-size: 16px;
  font-weight: 600;

  box-shadow:
    0 0 18px rgba(0,0,0,0.18);

  transition:
    transform 0.16s,
    box-shadow 0.16s,
    filter 0.16s;
}

.leave-button:hover {
  transform:
    translateY(-1px);

  filter: brightness(1.04);

  box-shadow:
    0 0 24px rgba(0,0,0,0.24);
}

.capsule {
  height: 38px;

  padding: 0 16px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 999px;

  background:
    rgba(255,255,255,0.05);

  border:
    1px solid rgba(255,255,255,0.05);

  backdrop-filter: blur(8px);

  font-size: 15px;
  font-weight: 600;

  color:
    rgba(255,255,255,0.9);

  box-shadow:
    0 0 16px rgba(0,0,0,0.14);
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