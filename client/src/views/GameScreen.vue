<script setup>
import {
  GAME_PHASES
}
from "../../../shared/constants/gamePhases"

import TopBar
from "../components/game/TopBar.vue"

import PlayersSideBar
from "../components/game/PlayersSideBar.vue"

import useGameState
from "../composables/game/useGameState"

import useGameSelections
from "../composables/game/useGameSelections"

import useGamePhase
from "../composables/game/useGamePhase"

import useGameActions
from "../composables/game/useGameActions"

const {

  currentLobby,
  currentPlayer,

  gamePhase,

  round,
  maxRounds,

  blackCard,
  handCards,

  submissions,

  sortedPlayers,

  readyCount,
  totalPlayers,

  isHost,
  isReady

} = useGameState()

const {

  selectedCards,
  selectedVoteId,

  canReady,

  toggleCard,
  selectVote

} = useGameSelections({

  gamePhase,
  blackCard
})

const {
  currentPhase
} = useGamePhase(
  gamePhase
)

const {

  toggleReady,

  submitVote,

  nextRound,
  backToLobby,

  leaveGame

} = useGameActions({

  currentLobby,

  gamePhase,

  isReady,

  selectedCards,
  handCards,

  selectedVoteId
})

function handleSelectVote(id) {

  if (isReady.value) {
    return
  }

  selectVote(id)

  submitVote(id)
}
</script>

<template>
  <div class="game-container">

    <TopBar
      :phase="gamePhase"

      :can-ready="canReady"

      :is-host="isHost"

      :is-ready="isReady"

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

      @next-round="
        nextRound
      "

      @back-to-lobby="
        backToLobby
      "

      @leave="
        leaveGame
      "
    />

    <div class="game-layout">

      <!-- SIDEBAR -->

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

      <!-- PHASE -->

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

              :current-player-id="
                currentPlayer?.id
              "

              :is-ready="
                isReady
              "

              @toggle-card="
                toggleCard
              "

              @select-vote="
                handleSelectVote
              "
            />

          </div>

        </transition>

      </div>

    </div>

  </div>
</template>

<style scoped>
.game-container {
  width: 100vw;
  height: 100vh;

  padding: 22px;

  display: flex;
  flex-direction: column;

  overflow: hidden;

  background:
    radial-gradient(
      ellipse at center,
      rgba(47,230,107,0.08),
      transparent 48%
    );
}

.game-layout {
  flex: 1;

  display: flex;

  align-items: flex-start;

  min-height: 0;
}

.sidebar-slot {
  width: 264px;

  flex-shrink: 0;

  display: flex;

  padding-top: 18px;
  padding-right: 18px;
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
</style>
