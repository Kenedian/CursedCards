<script setup>
import {
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted
} from "vue"

import socket
from "../socket"

import {
  SOCKET_EVENTS
}
from "../../../shared/constants/socketEvents"

import useGameStore
from "../stores/gameStore"

import useToast
from "../composables/useToast"

import AudioSettingsModal
from "../components/modals/AudioSettingsModal.vue"

const {
  currentLobby,
  currentPlayer,
  currentPlayerId
} = useGameStore()

const {
  toastError
} = useToast()

const copied =
  ref(false)

const settingsOpen =
  ref(false)

const roundAmount =
  ref(10)

const maxPlayers = 8

const players = computed(() => {

  return (
    currentLobby.value?.players || []
  )
})

const lobbyCode = computed(() => {

  return (
    currentLobby.value?.code || "----"
  )
})

const isHost = computed(() => {

  return (
    currentPlayer.value?.isHost
  )
})

const playerCount = computed(() => {

  return players.value.length
})

const maxRounds = computed(() => {

  return (
    currentLobby.value?.maxRounds ?? 10
  )
})

const roundAmountLabel = computed(() => {

  return maxRounds.value === 0
    ? "Infinite"
    : maxRounds.value
})

function updateRoundAmount() {
  if (!isHost.value) {
    return
  }

  setRoundAmount(
    roundAmount.value
  )
}

function setRoundAmount(nextValue) {
  if (!isHost.value) {
    return
  }

  const value =
    Math.max(
      0,
      Math.floor(
        Number(nextValue) || 0
      )
    )

  roundAmount.value =
    value

  socket.emit(
    SOCKET_EVENTS.UPDATE_LOBBY_SETTINGS,

    {
      code:
        lobbyCode.value,

      maxRounds:
        value
    }
  )
}

function changeRoundAmount(delta) {
  setRoundAmount(
    Number(roundAmount.value || 0) + delta
  )
}

async function copyCode() {

  await navigator.clipboard
    .writeText(
      lobbyCode.value
    )

  copied.value = true

  setTimeout(() => {

    copied.value = false

  }, 1000)
}

function startGame() {

  socket.emit(
    SOCKET_EVENTS.START_GAME,

    lobbyCode.value
  )
}

function leaveLobby() {

  socket.emit(
    SOCKET_EVENTS.LEAVE_LOBBY,

    lobbyCode.value
  )

  currentLobby.value = null
}

function kickPlayer(playerId) {

  socket.emit(
    SOCKET_EVENTS.KICK_PLAYER,

    {
      code:
        lobbyCode.value,

      playerId
    }
  )
}

function handleLobbyError(message) {

  toastError(message)
}

onMounted(() => {

  socket.on(
    SOCKET_EVENTS.LOBBY_ERROR,
    handleLobbyError
  )
})

onUnmounted(() => {

  socket.off(
    SOCKET_EVENTS.LOBBY_ERROR,
    handleLobbyError
  )
})

watch(
  maxRounds,
  value => {
    roundAmount.value =
      value
  },
  {
    immediate: true
  }
)
</script>

<template>
  <div class="lobby-container">
    <button
      class="btn settings-button"
      type="button"
      aria-label="Open audio settings"
      title="Settings"
      @click="settingsOpen = true"
    >
      <i class="fa-solid fa-gear"></i>
    </button>

    <div class="lobby-wrapper">

      <h1 class="lobby-title">
        Cursed Cards
      </h1>

      <div class="lobby-box">

        <!-- LEFT -->

        <div class="left-side">

          <h1>
            Lobby
          </h1>

          <div class="code-box">

            <div class="lobby-code">
              {{ lobbyCode }}
            </div>

            <button
              class="btn copy-button"

              :class="{
                copied
              }"

              @click="copyCode"
            >

              <i
                v-if="!copied"
                class="fa-solid fa-copy"
              ></i>

              <i
                v-else
                class="fa-solid fa-check"
              ></i>

            </button>

          </div>

          <div class="round-setting">
            <label for="round-count">
              Rounds
            </label>

            <div
              v-if="isHost"
              class="round-stepper"
            >
              <button
                class="round-step-button"
                type="button"
                aria-label="Decrease rounds"
                @click="changeRoundAmount(-1)"
              >
                <i class="fa-solid fa-minus"></i>
              </button>

              <input
                id="round-count"
                v-model.number="roundAmount"
                class="round-input"
                type="number"
                min="0"
                step="1"
                inputmode="numeric"
                @change="updateRoundAmount"
                @blur="updateRoundAmount"
              >

              <button
                class="round-step-button"
                type="button"
                aria-label="Increase rounds"
                @click="changeRoundAmount(1)"
              >
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>

            <div
              v-else
              class="round-readonly"
            >
              {{ roundAmountLabel }}
            </div>

            <span v-if="isHost">
              0 = infinite
            </span>
          </div>

          <button
            v-if="isHost"

            class="btn btn-success lobby-button"

            :disabled="
              playerCount < 3
            "

            @click="startGame"
          >
            Start Game
          </button>

          <div
            v-if="
              isHost &&
              playerCount < 3
            "

            class="minimum-text"
          >
            Minimum 3 players required
          </div>

          <button
            class="btn btn-danger lobby-button"

            @click="leaveLobby"
          >
            Leave Lobby
          </button>

        </div>

        <!-- DIVIDER -->

        <div class="divider"></div>

        <!-- RIGHT -->

        <div class="right-side">

          <div class="players-header">

            <h2>
              Players
            </h2>

            <div class="capsule">
              {{ playerCount }} / {{ maxPlayers }}
            </div>

          </div>

          <transition-group
            name="player-list"
            tag="div"

            class="players-list"
          >

            <div
              v-for="player in players"
              :key="player.id"

              class="player-row"
            >

              <div class="player-left">

                <i
                  v-if="player.isHost"
                  class="fa-solid fa-crown host-icon"
                ></i>

              <span
                :class="{
                    'host-name': player.isHost,
                    'own-player-name':
                      player.id === currentPlayerId
                  }"
                >
                  {{ player.username }}
                </span>

              </div>

              <button
                v-if="
                  isHost &&
                  !player.isHost
                "

                class="btn btn-danger kick-button"

                @click="
                  kickPlayer(player.id)
                "
              >
                <i class="fa-solid fa-user-minus"></i>
              </button>

              <div
                v-else
                class="host-placeholder"
              ></div>

            </div>

          </transition-group>

        </div>

      </div>

    </div>

  </div>

  <AudioSettingsModal
    v-if="settingsOpen"
    @close="settingsOpen = false"
  />
</template>

<style scoped>
.lobby-container {
  width: 100vw;
  min-height: 100vh;
  min-height: 100dvh;

  display: flex;
  justify-content: center;
  align-items: center;

  padding:
    clamp(18px, 1.6vw, 34px);
  padding-bottom:
    calc(clamp(18px, 1.6vw, 34px) + 40px + env(safe-area-inset-bottom));
  box-sizing: border-box;

  overflow-y: auto;
  overflow-x: hidden;
}

.settings-button {
  position: absolute;

  top: clamp(14px, 1.2vw, 28px);
  right: clamp(14px, 1.2vw, 28px);

  width: clamp(42px, 2.4vw, 54px);
  height: clamp(42px, 2.4vw, 54px);

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;

  background:
    linear-gradient(
      180deg,
      #777f78,
      #515a53 58%,
      #323833
    );
}

.settings-button i {
  font-size: clamp(18px, 1vw, 22px);
}

.lobby-wrapper {
  width: 100%;
  max-width: min(94vw, 3200px);

  height: min(91vh, 1600px);

  display: flex;
  flex-direction: column;
}

.lobby-title {
  text-align: center;

  font-size: clamp(48px, 4.2vw, 78px);
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;

  margin-bottom: clamp(10px, 0.9vw, 44px);

  flex-shrink: 0;

  text-shadow:
    0 4px 0 rgba(0,0,0,0.55),
    0 0 34px rgba(47,230,107,0.2);
}

.lobby-box {
  flex: 1;
  min-height: 0;

  display: flex;
  gap: clamp(24px, 2.2vw, 44px);

  padding:
    clamp(26px, 2.2vw, 44px);

  border-radius: 14px;

  background:
    linear-gradient(
      180deg,
      var(--game-panel-strong),
      rgba(8,10,9,0.96)
    );

  border:
    1px solid var(--game-line);

  backdrop-filter:
    blur(12px);

  box-shadow:
    var(--game-shadow),
    inset 0 1px 0 rgba(255,255,255,0.08),
    0 0 0 4px rgba(0,0,0,0.22);
}

/* LEFT */

.left-side {
  width: clamp(340px, 25vw, 480px);

  display: flex;
  flex-direction: column;

  gap: clamp(18px, 1.25vw, 52px);
}

.left-side h1 {
  margin: 0;

  font-size: clamp(38px, 2.6vw, 54px);
  font-weight: 900;
  text-transform: uppercase;
}

/* DIVIDER */

.divider {
  width: 1px;

  background:
    linear-gradient(
      transparent,
      rgba(255,255,255,0.08),
      transparent
    );

  opacity: 0.7;
}

/* RIGHT */

.right-side {
  flex: 1;
  min-height: 0;

  display: flex;
  flex-direction: column;
}

/* LOBBY CODE */

.code-box {
  display: flex;
  align-items: center;

  gap: clamp(12px, 0.8vw, 34px);
}

.lobby-code {
  flex: 1;

  height: clamp(82px, 5.7vw, 112px);

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 12px;

  background:
    linear-gradient(
      180deg,
      #080b09,
      #030403
    );

  border:
    1px solid var(--game-line-strong);

  font-size: clamp(42px, 3.2vw, 64px);
  font-weight: bold;

  letter-spacing: clamp(7px, 0.45vw, 22px);

  box-shadow:
    inset 0 0 30px rgba(0,0,0,0.45),
    0 0 24px rgba(0,0,0,0.35),
    0 0 24px rgba(47,230,107,0.08);

  text-shadow:
    0 0 14px rgba(255,255,255,0.08);
}

/* BUTTONS */

.lobby-button {
  height: clamp(52px, 3.2vw, 64px);

  border: none;
  border-radius: 10px;

  font-size: clamp(18px, 1.25vw, 24px);

  font-family: inherit;

  transition:
    transform 0.14s ease,
    opacity 0.14s ease,
    box-shadow 0.14s ease;
}

.lobby-button:hover:not(:disabled) {
  transform:
    translateY(-2px);

  box-shadow:
    0 8px 24px rgba(0,0,0,0.28);
}

.lobby-button:active:not(:disabled) {
  transform:
    translateY(0px)
    scale(0.98);
}

.lobby-button:disabled {
  opacity: 0.45;

  cursor: not-allowed;
}

.copy-button {
  width: clamp(52px, 3.2vw, 64px);
  height: clamp(52px, 3.2vw, 64px);

  border: none;
  border-radius: 10px;

  background:
    linear-gradient(
      180deg,
      #5ba7ff,
      #1f6fff 58%,
      #1649ad
    );

  color: white;

  display: flex;
  justify-content: center;
  align-items: center;

  flex-shrink: 0;

  transition:
    transform 0.14s ease,
    background 0.14s ease,
    box-shadow 0.14s ease;
}

.copy-button:hover {
  transform:
    translateY(-2px);

  box-shadow:
    0 0 24px rgba(31,111,255,0.35);
}

.copy-button.copied {
  background:
    linear-gradient(
      180deg,
      #43f27d,
      #20c96b 58%,
      #12682e
    );
}

.copy-button i {
  font-size: clamp(22px, 1.45vw, 28px);
}

.minimum-text {
  margin-top: -8px;

  text-align: center;

  opacity: 0.65;

  font-size: clamp(15px, 0.9vw, 34px);
}

/* PLAYERS */

.players-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: clamp(18px, 1.25vw, 52px);
}

.round-setting {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;

  gap: 8px 14px;

  padding: clamp(12px, 0.8vw, 28px);

  border:
    1px solid rgba(255,255,255,0.08);

  border-radius: 10px;

  background:
    rgba(255,255,255,0.035);
}

.round-setting label {
  color:
    rgba(255,255,255,0.9);

  font-size: clamp(16px, 1vw, 20px);
  font-weight: 900;
  text-transform: uppercase;
}

.round-setting span {
  grid-column: 1 / 3;

  color:
    rgba(255,255,255,0.54);

  font-size: clamp(12px, 0.75vw, 15px);
  font-weight: 800;
}

.round-stepper {
  display: grid;
  grid-template-columns: clamp(34px, 2vw, 42px) clamp(58px, 3.4vw, 74px) clamp(34px, 2vw, 42px);
  align-items: stretch;

  height: clamp(40px, 2.6vw, 50px);

  border:
    1px solid var(--game-line);

  border-radius: 8px;

  background:
    rgba(0,0,0,0.28);

  overflow: hidden;

  box-shadow:
    inset 0 2px 12px rgba(0,0,0,0.38);
}

.round-step-button {
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;

  border: none;

  background:
    linear-gradient(
      180deg,
      rgba(255,255,255,0.12),
      rgba(255,255,255,0.035)
    );

  color:
    rgba(255,255,255,0.9);

  font-size: clamp(12px, 0.75vw, 15px);

  cursor: pointer;

  transition:
    background 0.16s ease,
    color 0.16s ease;
}

.round-step-button:hover,
.round-step-button:focus {
  background:
    rgba(47,230,107,0.18);

  color:
    var(--game-green);
}

.round-input,
.round-readonly {
  width: clamp(78px, 5.2vw, 100px);
  height: clamp(40px, 2.6vw, 50px);

  border:
    1px solid var(--game-line);

  border-radius: 8px;

  background:
    rgba(0,0,0,0.28);

  color:
    var(--game-yellow);

  font: inherit;
  font-size: clamp(18px, 1.1vw, 22px);
  font-weight: 900;

  text-align: center;
}

.round-stepper .round-input {
  width: 100%;
  height: 100%;

  border: none;
  border-left: 1px solid rgba(255,255,255,0.08);
  border-right: 1px solid rgba(255,255,255,0.08);

  border-radius: 0;

  background:
    rgba(0,0,0,0.24);
}

.round-input::-webkit-outer-spin-button,
.round-input::-webkit-inner-spin-button {
  margin: 0;

  appearance: none;
}

.round-input {
  appearance: textfield;
}

.round-readonly {
  display: flex;
  align-items: center;
  justify-content: center;
}

.players-header h2 {
  margin: 0;

  font-size: clamp(32px, 2.35vw, 48px);
  font-weight: 900;
  text-transform: uppercase;
}

.players-list {
  flex: 1;
  min-height: 0;

  overflow-y: auto;
  overflow-x: hidden;

  display: flex;
  flex-direction: column;

  gap: clamp(10px, 0.75vw, 34px);

  padding-right: clamp(8px, 0.55vw, 22px);
}

/* PLAYER ROW */

.player-row {
  min-height: clamp(56px, 3.5vw, 68px);

  flex-shrink: 0;

  padding:
    0
    clamp(16px, 1.1vw, 48px);

  display: flex;
  justify-content: space-between;
  align-items: center;

  border-radius: 10px;

  background:
    rgba(255,255,255,0.045);

  border:
    1px solid rgba(255,255,255,0.04);

  transition:
    transform 0.14s ease,
    background 0.14s ease,
    border-color 0.14s ease;
}

.player-row:hover {
  transform:
    translateX(4px);

  background:
    rgba(255,255,255,0.05);

  border-color:
    rgba(255,255,255,0.08);
}

.player-left {
  display: flex;
  align-items: center;

  gap: clamp(10px, 0.75vw, 34px);

  font-size: clamp(18px, 1.25vw, 24px);
}

.host-icon {
  color: gold;

  font-size: clamp(19px, 1.2vw, 24px);

  filter:
    drop-shadow(
      0 0 8px
      rgba(255,215,0,0.4)
    );
}

.host-name {
  color: #ffd84d;

  text-shadow:
    0 0 12px rgba(255,216,77,0.14);
}

/* KICK BUTTON */

.kick-button {
  width: clamp(42px, 2.6vw, 52px);
  height: clamp(42px, 2.6vw, 52px);

  border: none;
  border-radius: 16px;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 0;

  transition:
    transform 0.14s ease,
    box-shadow 0.14s ease;
}

.kick-button:hover {
  transform:
    scale(1.05);

  box-shadow:
    0 0 18px rgba(220,53,69,0.3);
}

.kick-button i {
  font-size: clamp(17px, 1.05vw, 21px);
}

.own-player-name {
  text-decoration: underline;
  text-decoration-thickness: 0.12em;
  text-underline-offset: 0.18em;
}

.host-placeholder {
  width: clamp(42px, 2.6vw, 52px);
  height: clamp(42px, 2.6vw, 52px);
}

/* CAPSULE */

.capsule {
  background:
    linear-gradient(
      180deg,
      rgba(25,31,28,0.98),
      rgba(7,10,8,0.98)
    );

  border-radius: 10px;

  padding: 0 clamp(18px, 1.2vw, 48px);

  min-width: 90px;
  height: clamp(42px, 2.55vw, 52px);

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: clamp(16px, 1vw, 20px);
  font-weight: 900;

  border:
    1px solid var(--game-line);

  box-shadow:
    0 0 18px rgba(0,0,0,0.35),
    inset 0 1px 0 rgba(255,255,255,0.04);
}

/* PLAYER TRANSITIONS */

.player-list-enter-active,
.player-list-leave-active {
  transition:
    all 0.22s cubic-bezier(.2,.8,.2,1);
}

.player-list-enter-from {
  opacity: 0;

  transform:
    translateX(-20px)
    scale(0.96);
}

.player-list-leave-to {
  opacity: 0;

  transform:
    translateX(20px)
    scale(0.96);
}

/* RESPONSIVE */

@media (max-width: 1100px) {

  .lobby-container {
    padding:
      calc(58px + env(safe-area-inset-top))
      18px
      calc(32px + env(safe-area-inset-bottom));
  }

  .lobby-wrapper {
    max-width: 1040px;
  }

  .lobby-title {
    font-size: clamp(44px, 6vw, 64px);
  }

  .lobby-box {
    gap: 22px;
    padding: 24px;
  }

  .left-side {
    gap: 16px;
  }

  .left-side h1 {
    font-size: 36px;
  }

  .lobby-code {
    height: 84px;

    font-size: 42px;
  }

  .lobby-button,
  .copy-button {
    height: 54px;
  }

  .copy-button {
    width: 54px;
  }

  .players-header h2 {
    font-size: 32px;
  }

  .right-side {
    min-height: 0;
  }

  .players-list {
    min-height: 0;
  }

  .player-row {
    min-height: 56px;
  }

  .player-left {
    font-size: 18px;
  }

  .kick-button,
  .host-placeholder {
    width: 42px;
    height: 42px;
  }
}

@media (max-width: 760px) {
  .lobby-container {
    align-items: flex-start;

    padding:
      calc(68px + env(safe-area-inset-top))
      18px
      calc(72px + env(safe-area-inset-bottom));
  }

  .lobby-wrapper {
    height: auto;
    min-height: 0;
    max-width: 880px;
  }

  .lobby-box {
    flex-direction: column;
  }

  .divider {
    width: 100%;
    height: 1px;
  }

  .left-side {
    width: 100%;
  }

  .players-list {
    max-height: min(42dvh, 360px);
    min-height: 120px;

    padding-bottom:
      calc(72px + env(safe-area-inset-bottom));

    scroll-padding-bottom:
      calc(72px + env(safe-area-inset-bottom));
  }
}

@media (max-height: 780px) {
  .lobby-wrapper {
    height: auto;
  }

  .lobby-title {
    font-size: clamp(42px, 4vw, 68px);

    margin-bottom: 8px;
  }

  .lobby-box {
    padding: 24px;
  }

  .left-side {
    gap: 14px;
  }
}

@media (max-width: 480px) {
  .settings-button {
    top: calc(10px + env(safe-area-inset-top));
    right: 10px;

    width: 38px;
    height: 38px;
  }

  .settings-button i {
    font-size: 16px;
  }

  .lobby-title {
    font-size: clamp(34px, 11vw, 44px);
  }

  .lobby-box {
    padding: 18px;

    gap: 18px;
  }

  .left-side h1 {
    font-size: 28px;
  }

  .lobby-code {
    height: 68px;

    font-size: 34px;
    letter-spacing: 5px;
  }

  .lobby-button {
    height: 48px;

    font-size: 15px;
  }

  .copy-button {
    width: 48px;
    height: 48px;
  }

  .players-header {
    margin-bottom: 12px;
  }

  .players-header h2 {
    font-size: 26px;
  }

  .player-left {
    min-width: 0;

    font-size: 15px;
  }

  .player-left span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
