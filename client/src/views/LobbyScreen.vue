<script setup>
import {
  ref,
  computed
} from "vue"

import socket
from "../socket"

import {
  SOCKET_EVENTS
}
from "../../../shared/constants/socketEvents"

import useGameStore
from "../stores/gameStore"

const emit = defineEmits([
  "leave",
  "start-game"
])

const {
  currentLobby,
  currentPlayer
} = useGameStore()

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

            @click="
              emit('start-game')
            "
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

            @click="
              emit('leave')
            "
          >
            {{
              isHost
                ? "Close Lobby"
                : "Leave Lobby"
            }}
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

                <span>
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
}

.lobby-wrapper {
  width: 80vw;
  height: 85vh;

  display: flex;
  flex-direction: column;
}

.lobby-title {
  text-align: center;

  font-size: 72px;

  margin-bottom: 25px;

  flex-shrink: 0;
}

.lobby-box {
  flex: 1;
  min-height: 0;

  background: #2a2a2a;

  border-radius: 30px;

  padding: 50px;

  display: flex;
  gap: 50px;

  box-shadow:
    0 0 40px rgba(0,0,0,0.6);
}

.left-side {
  width: 420px;

  display: flex;
  flex-direction: column;

  gap: 25px;
}

.right-side {
  flex: 1;
  min-height: 0;

  display: flex;
  flex-direction: column;
}

.divider {
  width: 2px;

  background:
    rgba(255,255,255,0.08);

  border-radius: 999px;
}

.code-box {
  display: flex;
  align-items: center;

  gap: 12px;
}

.lobby-code {
  flex: 1;

  height: 95px;

  background: #1a1a1a;

  border-radius: 18px;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 54px;

  letter-spacing: 8px;
}

.lobby-button {
  height: 65px;

  font-size: 24px;
}

/* PLAYERS */

.players-header {
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 25px;
}

.players-list {
  flex: 1;
  min-height: 0;

  overflow-y: auto;
  overflow-x: hidden;

  display: flex;
  flex-direction: column;

  gap: 12px;

  padding-right: 10px;

  position: relative;
}

.players-list::-webkit-scrollbar {
  width: 18px;
}

.players-list::-webkit-scrollbar-track {
  background: #1a1a1a;

  border-radius: 999px;
}

.players-list::-webkit-scrollbar-thumb {
  background: #444;

  border-radius: 999px;

  border: 3px solid #1a1a1a;
}

.player-row {
  min-height: 72px;

  flex-shrink: 0;

  background: #1a1a1a;

  border-radius: 18px;

  padding: 0 20px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  transition:
    width 0.24s ease,
    transform 0.24s ease,
    padding 0.24s ease;
}

.player-left {
  display: flex;
  align-items: center;

  gap: 12px;

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

.copy-button {
  width: 64px;
  height: 64px;

  border: none;
  border-radius: 18px;

  background:
    #1f6fff;

  color: white;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 0;

  transition:
    transform 0.14s ease,
    box-shadow 0.18s ease,
    background 0.18s ease,
    filter 0.18s ease;

  box-shadow:
    0 0 18px rgba(31,111,255,0.24);
}

.copy-button:hover {
  transform:
    translateY(-2px);

  filter:
    brightness(1.04);

  box-shadow:
    0 0 26px rgba(31,111,255,0.36);
}

.copy-button:active {
  transform:
    scale(0.94);
}

.copy-button.copied {
  background:
    #2fe66b;

  box-shadow:
    0 0 28px rgba(47,230,107,0.42);

  animation:
    copiedPulse 0.42s ease;
}

.copy-button i {
  font-size: 28px;
}

.kick-button {
  width: 52px;
  height: 52px;

  border-radius: 14px;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 0;
}

.kick-button i {
  font-size: 22px;
}

.host-placeholder {
  width: 52px;
  height: 52px;
}

.capsule {
  height: 52px;

  padding: 0 24px;

  border-radius: 999px;

  display: flex;
  justify-content: center;
  align-items: center;

  background:
    rgba(255,255,255,0.04);

  border:
    1px solid rgba(255,255,255,0.05);

  box-shadow:
    0 0 24px rgba(0,0,0,0.22);

  font-size: 20px;
}

.player-list-enter-active,
.player-list-leave-active,
.player-list-move {
  transition:
    all 0.24s ease;
}

.player-list-enter-from {
  opacity: 0;

  transform:
    translateY(12px)
    scale(0.96);
}

.player-list-leave-to {
  opacity: 0;

  transform:
    translateX(30px)
    scale(0.96);
}

.player-list-leave-active {
  position: absolute;

  width: calc(100% - 10px);
}

@keyframes copiedPulse {

  0% {
    transform: scale(1);
  }

  35% {
    transform: scale(1.12);
  }

  100% {
    transform: scale(1);
  }
}
</style>