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

import useToast
from "../composables/useToast"

import {
  getClientSessionId,
  getReconnectInfo,
  clearReconnectInfo
}
from "../utils/reconnectSession"

const emit = defineEmits([
  "open-lobby",
  "open-admin"
])

const {
  toastError
} = useToast()

const createUsername =
  ref("")

const joinUsername =
  ref("")

const joinCode =
  ref("")

const reconnectInfo =
  ref(getReconnectInfo())

const canReconnect =
  computed(() => {
    return (
      reconnectInfo.value?.code &&
      reconnectInfo.value?.username
    )
  })

function createLobby() {

  if (
    !createUsername.value.trim()
  ) {

    toastError(
      "Enter username"
    )

    return
  }

  socket.emit(
    SOCKET_EVENTS.CREATE_LOBBY,

    {
      username:
        createUsername.value.trim(),

      sessionId:
        getClientSessionId()
    }
  )
}

function joinLobby() {

  if (
    !joinUsername.value.trim()
  ) {

    toastError(
      "Enter username"
    )

    return
  }

  if (
    !joinCode.value.trim()
  ) {

    toastError(
      "Enter lobby code"
    )

    return
  }

  socket.emit(
    SOCKET_EVENTS.JOIN_LOBBY,

    {
      username:
        joinUsername.value.trim(),

      code:
        joinCode.value
          .trim()
          .toUpperCase(),

      sessionId:
        getClientSessionId()
    }
  )
}

function reconnectLobby() {
  if (!canReconnect.value) {
    return
  }

  socket.emit(
    SOCKET_EVENTS.RECONNECT_LOBBY,

    {
      code:
        reconnectInfo.value.code,

      username:
        reconnectInfo.value.username,

      sessionId:
        getClientSessionId()
    }
  )
}

function forgetReconnect() {
  clearReconnectInfo()

  reconnectInfo.value =
    null
}

function handleLobbySuccess() {

  emit("open-lobby")
}

function handleLobbyError(
  message
) {

  toastError(message)
}

onMounted(() => {

  socket.on(
    SOCKET_EVENTS.CREATE_LOBBY_SUCCESS,
    handleLobbySuccess
  )

  socket.on(
    SOCKET_EVENTS.JOIN_LOBBY_SUCCESS,
    handleLobbySuccess
  )

  socket.on(
    SOCKET_EVENTS.RECONNECT_LOBBY_SUCCESS,
    handleLobbySuccess
  )

  socket.on(
    SOCKET_EVENTS.LOBBY_ERROR,
    handleLobbyError
  )
})

onUnmounted(() => {

  socket.off(
    SOCKET_EVENTS.CREATE_LOBBY_SUCCESS,
    handleLobbySuccess
  )

  socket.off(
    SOCKET_EVENTS.JOIN_LOBBY_SUCCESS,
    handleLobbySuccess
  )

  socket.off(
    SOCKET_EVENTS.RECONNECT_LOBBY_SUCCESS,
    handleLobbySuccess
  )

  socket.off(
    SOCKET_EVENTS.LOBBY_ERROR,
    handleLobbyError
  )
})
</script>

<template>

  <button
    class="btn btn-danger admin-button"

    @click="emit('open-admin')"
  >
    Admin
  </button>

  <div class="main-container">

    <div>

      <h1 class="title">
        Cursed Cards
      </h1>

      <div class="menu-box">

        <div
          v-if="canReconnect"
          class="reconnect-panel"
        >
          <div>
            <strong>
              {{ reconnectInfo.username }}
            </strong>

            <span>
              {{ reconnectInfo.code }}
            </span>
          </div>

          <button
            class="btn btn-warning"
            @click="reconnectLobby"
          >
            Reconnect
          </button>

          <button
            class="btn forget-button"
            @click="forgetReconnect"
          >
            Forget
          </button>
        </div>

        <!-- JOIN -->

        <div class="menu-side">

          <h2>
            Join Lobby
          </h2>

          <input
            v-model="joinUsername"

            type="text"

            placeholder="Your name"

            class="form-control"
          >

          <input
            v-model="joinCode"

            type="text"

            placeholder="Lobby code"

            class="form-control"
          >

          <button
            class="btn btn-primary w-100"

            @click="joinLobby"
          >
            Join
          </button>

        </div>

        <div class="divider"></div>

        <!-- CREATE -->

        <div class="menu-side">

          <h2>
            Create Lobby
          </h2>

          <input
            v-model="createUsername"

            type="text"

            placeholder="Your name"

            class="form-control"
          >

          <button
            class="btn btn-success w-100"

            @click="createLobby"
          >
            Create Lobby
          </button>

        </div>

      </div>

    </div>

  </div>
</template>

<style scoped>
.main-container {
  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  text-align: center;

  font-size: 74px;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;

  margin-bottom: 25px;

  color:
    #f9fff9;

  text-shadow:
    0 4px 0 rgba(0,0,0,0.55),
    0 0 34px rgba(47,230,107,0.22);
}

.menu-box {
  background:
    linear-gradient(
      180deg,
      var(--game-panel-strong),
      rgba(8,10,9,0.96)
    );

  border:
    1px solid var(--game-line);

  border-radius: 14px;

  padding: 40px;

  width: 900px;

  display: flex;
  flex-wrap: wrap;

  gap: 40px;

  box-shadow:
    var(--game-shadow),
    inset 0 1px 0 rgba(255,255,255,0.08),
    0 0 0 4px rgba(0,0,0,0.22);
}

.reconnect-panel {
  width: 100%;

  display: flex;
  align-items: center;

  gap: 14px;

  padding-bottom: 22px;

  border-bottom:
    1px solid rgba(255,255,255,0.1);
}

.reconnect-panel div {
  flex: 1;

  display: flex;
  align-items: baseline;

  gap: 12px;
}

.reconnect-panel strong {
  color: var(--game-yellow);

  font-size: 18px;
}

.reconnect-panel span {
  color: rgba(255,255,255,0.7);

  font-weight: 800;
  letter-spacing: 1px;
}

.forget-button {
  border:
    1px solid rgba(255,255,255,0.14);

  background:
    rgba(255,255,255,0.04);

  color:
    rgba(255,255,255,0.72);

  font-weight: 800;

  box-shadow: none;

  transition:
    background 0.16s ease,
    border-color 0.16s ease,
    color 0.16s ease,
    transform 0.16s ease;
}

.forget-button:hover,
.forget-button:focus {
  border-color:
    rgba(255,255,255,0.22);

  background:
    rgba(255,255,255,0.075);

  color:
    rgba(255,255,255,0.9);

  box-shadow:
    0 0 0 3px rgba(255,255,255,0.04);

  transform:
    translateY(-1px);
}

.forget-button:active {
  background:
    rgba(255,255,255,0.1);

  color:
    rgba(255,255,255,0.96);

  transform:
    translateY(0);
}

.menu-side {
  flex: 1;

  display: flex;
  flex-direction: column;

  gap: 20px;
}

.menu-side h2 {
  margin: 0;

  color:
    var(--game-yellow);

  font-size: 24px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.6px;

  text-shadow:
    0 0 16px rgba(255,216,77,0.16);
}

.divider {
  width: 2px;

  background:
    rgba(255,255,255,0.1);
}

.admin-button {
  position: absolute;

  top: 20px;
  right: 20px;
}
</style>
