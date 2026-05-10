<script setup>
import {
  ref,
  computed,
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

const {
  currentLobby,
  currentPlayer
} = useGameStore()

const {
  toastError
} = useToast()

const copied =
  ref(false)

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
</script>

<template>
  <div class="lobby-container">

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
                    'host-name': player.isHost
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
</template>

<style scoped>
.lobby-container {
  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 30px;
  box-sizing: border-box;
}

.lobby-wrapper {
  width: 100%;
  max-width: 1500px;

  height: 90vh;

  display: flex;
  flex-direction: column;
}

.lobby-title {
  text-align: center;

  font-size: 72px;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;

  margin-bottom: 12px;

  flex-shrink: 0;

  text-shadow:
    0 4px 0 rgba(0,0,0,0.55),
    0 0 34px rgba(47,230,107,0.2);
}

.lobby-box {
  flex: 1;
  min-height: 0;

  display: flex;
  gap: 40px;

  padding: 42px;

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
  width: 430px;

  display: flex;
  flex-direction: column;

  gap: 22px;
}

.left-side h1 {
  margin: 0;

  font-size: 48px;
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

  gap: 14px;
}

.lobby-code {
  flex: 1;

  height: 110px;

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

  font-size: 58px;
  font-weight: bold;

  letter-spacing: 10px;

  box-shadow:
    inset 0 0 30px rgba(0,0,0,0.45),
    0 0 24px rgba(0,0,0,0.35),
    0 0 24px rgba(47,230,107,0.08);

  text-shadow:
    0 0 14px rgba(255,255,255,0.08);
}

/* BUTTONS */

.lobby-button {
  height: 68px;

  border: none;
  border-radius: 10px;

  font-size: 24px;

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
  width: 68px;
  height: 68px;

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
  font-size: 28px;
}

.minimum-text {
  margin-top: -8px;

  text-align: center;

  opacity: 0.65;

  font-size: 18px;
}

/* PLAYERS */

.players-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 24px;
}

.players-header h2 {
  margin: 0;

  font-size: 42px;
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

  gap: 14px;

  padding-right: 10px;
}

.players-list::-webkit-scrollbar {
  width: 18px;
}

.players-list::-webkit-scrollbar-track {
  background: #151515;

  border-radius: 999px;
}

.players-list::-webkit-scrollbar-thumb {
  background: #444;

  border-radius: 999px;

  border: 3px solid #151515;
}

/* PLAYER ROW */

.player-row {
  min-height: 74px;

  flex-shrink: 0;

  padding: 0 22px;

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

  gap: 14px;

  font-size: 24px;
}

.host-icon {
  color: gold;

  font-size: 24px;

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
  width: 54px;
  height: 54px;

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
  font-size: 22px;
}

.host-placeholder {
  width: 54px;
  height: 54px;
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

  padding: 0 24px;

  min-width: 90px;
  height: 52px;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 20px;
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
}
</style>
