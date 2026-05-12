<script setup>
import {
  ref
}
from "vue"

import {
  GAME_PHASES
}
from "../../../shared/constants/gamePhases"

import TopBar
from "../components/game/TopBar.vue"

import PlayersSideBar
from "../components/game/PlayersSideBar.vue"

import AudioSettingsModal
from "../components/modals/AudioSettingsModal.vue"

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

  leaveGame,
  kickPlayer

} = useGameActions({

  currentLobby,

  gamePhase,

  isReady,

  selectedCards,
  handCards,

  selectedVoteId
})

const settingsOpen =
  ref(false)

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

      :needs-reconnect="
        showConnectionWarning
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

      @reconnect="
        reconnectGame
      "

      @open-settings="
        settingsOpen = true
      "
    />

    <div
      class="game-layout"
      :class="{
        'game-over-layout':
          gamePhase === GAME_PHASES.GAME_OVER
      }"
    >

      <!-- SIDEBAR -->

      <div
        v-if="
          gamePhase !==
          GAME_PHASES.GAME_OVER
        "
        class="sidebar-slot"
      >

        <transition name="sidebar">

          <PlayersSideBar
            :players="
              sortedPlayers
            "

            :is-host="
              isHost
            "

            :current-player-id="
              currentPlayer?.id
            "

            @kick-player="
              kickPlayer
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

  <AudioSettingsModal
    v-if="settingsOpen"
    @close="settingsOpen = false"
  />
</template>

<style scoped>
.game-container {
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  min-height: 100vh;
  min-height: 100dvh;

  padding:
    clamp(14px, 2vh, 26px)
    clamp(14px, 1.6vw, 30px);

  padding-bottom:
    clamp(14px, 2vh, 26px);

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

  align-items: stretch;

  min-height: 0;
}

.game-layout.game-over-layout {
  align-items: stretch;
}

.sidebar-slot {
  width: clamp(232px, 14.5vw, 308px);

  flex-shrink: 0;
  align-self: flex-start;

  display: flex;

  padding-top: clamp(14px, 1.1vw, 22px);
  padding-right: clamp(14px, 1.1vw, 22px);
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
  height: 100%;

  position: relative;

  display: flex;
}

.phase-content {
  flex: 1;

  display: flex;

  min-width: 0;
  min-height: 0;
  height: 100%;
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

@media (max-width: 999px) {
  .game-container {
    padding: 10px;
  }

  .sidebar-slot {
    width: 206px;

    padding-top: 12px;
    padding-right: 10px;
  }
}

@media (max-width: 900px) {
  .sidebar-slot {
    width: 180px;
  }
}

@media (max-width: 760px) {
  .game-container {
    height: 100vh;
    height: 100dvh;

    padding:
      calc(8px + env(safe-area-inset-top))
      8px
      calc(14px + env(safe-area-inset-bottom));

    overflow-y: auto;
    overflow-x: hidden;
  }

  .game-layout {
    flex-direction: column;

    gap: 8px;

    flex: none;
    min-height: 0;
  }

  .sidebar-slot {
    width: 100%;

    padding: 0;

    flex-shrink: 0;
  }

  .phase-wrapper,
  .phase-content {
    width: 100%;

    overflow: visible;
  }
}

@media (max-width: 999px) and (max-height: 520px) and (orientation: landscape) {
  .game-container {
    height: 100dvh;

    overflow-y: auto;
  }
}
</style>
