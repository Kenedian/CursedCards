<script setup>
import { computed }
from "vue"

import useGameStore
from "../stores/gameStore"

import useGameRound
from "../composables/game/useGameRound"

import { GAME_PHASES }
from "../../../shared/constants/gamePhases"

import TopBar
from "../components/game/TopBar.vue"

import PlayersSideBar
from "../components/game/PlayersSideBar.vue"

const emit = defineEmits([
  "leave",
  "back-to-lobby"
])

const {
  players,
  submissions,

  getRandomWhiteCards,
  getRandomBlackCard
} = useGameStore()

const {

  gamePhase,

  round,
  maxRounds,

  blackCard,
  handCards,

  selectedCards,
  selectedVoteId,

  currentPhase,
  canReady,

  toggleCard,
  selectVote,

  nextRound,
  resetGame

} = useGameRound({
  getRandomWhiteCards,
  getRandomBlackCard
})

function backToLobby() {

  resetGame()

  emit("back-to-lobby")
}

function toggleReady() {

  players.value[0].ready =
    !players.value[0].ready
}

const sortedPlayers = computed(() => {

  return [...players.value]
    .sort(
      (a, b) =>
        b.score - a.score
    )
})

const readyCount = computed(() => {

  return players.value.filter(
    player => player.ready
  ).length
})

const totalPlayers = computed(() => {

  return players.value.length
})
</script>

<template>
  <div class="game-container">

  <TopBar
    :phase="gamePhase"

    :can-ready="canReady"

    :is-host="true"

    :is-ready="
      players[0]?.ready
    "

    :round="round"

    :max-rounds="
      maxRounds
    "

    :ready-count="
      readyCount
    "

    :total-players="
      totalPlayers
    "

    @toggle-ready="
      toggleReady
    "

    @leave="
      emit('leave')
    "

    @next-round="
      nextRound
    "

    @back-to-lobby="
      backToLobby
    "
  />

    <div class="game-layout">

      <!-- SIDEBAR SLOT -->

      <div class="sidebar-slot">

        <transition name="sidebar">

          <PlayersSideBar
            v-if="
              gamePhase !==
              GAME_PHASES.GAME_OVER
            "

            :players="
              sortedPlayers
            "
          />

        </transition>

      </div>

      <!-- PHASE CONTENT -->

      <div class="phase-wrapper">

        <transition
          name="phase"
          mode="out-in"
        >

          <div
            class="phase-content"
            :key="gamePhase"
          >

            <component
              :is="currentPhase"

              :black-card="
                blackCard
              "

              :hand-cards="
                handCards
              "

              :submissions="
                submissions
              "

              :players="
                sortedPlayers
              "

              :selected-cards="
                selectedCards
              "

              :selected-vote-id="
                selectedVoteId
              "

              @toggle-card="
                toggleCard
              "

              @select-vote="
                selectVote
              "
            />

          </div>

        </transition>

      </div>

    </div>

    <!-- DEBUG -->

    <div class="phase-buttons">

      <button
        class="btn btn-secondary"

        @click="
          gamePhase =
          GAME_PHASES.PICKING
        "
      >
        Picking
      </button>

      <button
        class="btn btn-secondary"

        @click="
          gamePhase =
          GAME_PHASES.REVEAL
        "
      >
        Reveal
      </button>

      <button
        class="btn btn-secondary"

        @click="
          gamePhase =
          GAME_PHASES.VOTING
        "
      >
        Voting
      </button>

      <button
        class="btn btn-secondary"

        @click="
          gamePhase =
          GAME_PHASES.RESULTS
        "
      >
        Results
      </button>

      <button
        class="btn btn-secondary"

        @click="
          gamePhase =
          GAME_PHASES.GAME_OVER
        "
      >
        Game Over
      </button>

    </div>

  </div>
</template>

<style scoped>
.game-container {
  width: 100vw;
  height: 100vh;

  padding: 28px;

  display: flex;
  flex-direction: column;

  overflow: hidden;
}

.game-layout {
  flex: 1;

  display: flex;

  align-items: flex-start;

  min-height: 0;
}

/* SIDEBAR */

.sidebar-slot {
  width: 240px;

  flex-shrink: 0;

  display: flex;

  padding-top: 18px;
}

.sidebar-enter-active,
.sidebar-leave-active {
  transition:
    opacity 0.18s ease;
}

.sidebar-enter-from,
.sidebar-leave-to {
  opacity: 0;
}

/* PHASE */

.phase-wrapper {
  flex: 1;

  min-width: 0;
  min-height: 0;

  position: relative;

  display: flex;
}

.phase-content {
  flex: 1;

  display: flex;

  min-width: 0;
  min-height: 0;
}

.phase-enter-active,
.phase-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.phase-enter-from {
  opacity: 0;

  transform:
    translateY(12px)
    scale(0.985);
}

.phase-leave-to {
  opacity: 0;

  transform:
    translateY(-10px)
    scale(0.985);
}

/* DEBUG */

.phase-buttons {
  position: absolute;

  bottom: 20px;
  right: 20px;

  display: flex;
  gap: 10px;

  z-index: 9999;
}
</style>