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

import AudioSettingsModal
from "../components/modals/AudioSettingsModal.vue"

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

const settingsOpen =
  ref(false)

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

  <div class="corner-actions">
    <button
      class="btn settings-button"

      aria-label="Open audio settings"
      title="Settings"

      @click="settingsOpen = true"
    >
      <i class="fa-solid fa-gear"></i>
    </button>

    <button
      class="btn btn-danger admin-button"

      @click="emit('open-admin')"
    >
      Admin
    </button>
  </div>

  <div class="main-container">

    <div class="main-wrapper">

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

  <AudioSettingsModal
    v-if="settingsOpen"
    @close="settingsOpen = false"
  />
</template>

<style scoped>
.main-container {
  width: 100vw;
  min-height: 100vh;
  min-height: 100dvh;

  display: flex;
  justify-content: center;
  align-items: center;

  padding:
    clamp(18px, 3vw, 56px);

  padding-bottom:
    calc(clamp(18px, 3vw, 56px) + env(safe-area-inset-bottom));

  overflow-y: auto;
  overflow-x: hidden;
}

.main-wrapper {
  width: min(92vw, 2600px);
}

.title {
  text-align: center;

  font-size: clamp(52px, 4.7vw, 180px);
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;

  margin-bottom: clamp(18px, 1.5vw, 62px);

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

  padding:
    clamp(26px, 2.4vw, 92px);

  width: 100%;

  display: flex;
  flex-wrap: wrap;

  gap: clamp(24px, 2.2vw, 88px);

  box-shadow:
    var(--game-shadow),
    inset 0 1px 0 rgba(255,255,255,0.08),
    0 0 0 4px rgba(0,0,0,0.22);
}

.reconnect-panel {
  width: 100%;

  display: flex;
  align-items: center;

  gap: clamp(10px, 0.9vw, 32px);

  padding-bottom: clamp(16px, 1.25vw, 48px);

  border-bottom:
    1px solid rgba(255,255,255,0.1);
}

.reconnect-panel div {
  flex: 1;

  display: flex;
  align-items: baseline;

  gap: clamp(12px, 0.9vw, 34px);
}

.reconnect-panel strong {
  color: var(--game-yellow);

  font-size: clamp(16px, 1vw, 36px);
}

.reconnect-panel span {
  color: rgba(255,255,255,0.7);

  font-weight: 800;
  letter-spacing: 1px;

  font-size: clamp(14px, 0.8vw, 28px);
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
  min-width: 0;

  display: flex;
  flex-direction: column;

  gap: clamp(16px, 1.2vw, 50px);
}

.menu-side h2 {
  margin: 0;

  color:
    var(--game-yellow);

  font-size: clamp(21px, 1.35vw, 52px);
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

.corner-actions {
  position: absolute;

  top: clamp(14px, 1.2vw, 28px);
  right: clamp(14px, 1.2vw, 28px);

  display: flex;
  align-items: center;

  gap: clamp(10px, 0.8vw, 18px);
}

.settings-button {
  width: clamp(42px, 2.4vw, 96px);
  height: clamp(42px, 2.4vw, 96px);

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
  font-size: clamp(18px, 1vw, 38px);
}

.admin-button {
  min-height: clamp(42px, 2.4vw, 96px);

  padding:
    0
    clamp(14px, 1vw, 40px);

  font-size: clamp(14px, 0.85vw, 32px);
}

.menu-box .form-control {
  height: clamp(46px, 3.1vw, 96px);

  padding:
    0
    clamp(14px, 1vw, 34px);

  font-size: clamp(16px, 1.05vw, 34px);
}

.menu-box .btn {
  min-height: clamp(46px, 3.1vw, 96px);

  font-size: clamp(15px, 0.95vw, 32px);
}

@media (max-width: 1100px) {
  .main-container {
    align-items: center;

    padding:
      calc(70px + env(safe-area-inset-top))
      18px
      calc(26px + env(safe-area-inset-bottom));
  }

  .title {
    font-size: clamp(42px, 6vw, 62px);

    margin-bottom: 16px;
  }

  .main-wrapper {
    width: min(92vw, 760px);
  }

  .menu-box {
    width: 100%;

    padding: 26px;

    gap: 24px;
  }

  .menu-side {
    gap: 16px;
  }

  .menu-box .form-control,
  .menu-box .btn {
    min-height: 46px;
    height: 46px;

    font-size: 14px;
  }

  .divider {
    display: none;
  }
}

@media (max-height: 760px) {
  .main-container {
    align-items: flex-start;
  }

  .title {
    font-size: clamp(40px, 5vw, 64px);

    margin-bottom: 12px;
  }

  .menu-box {
    padding: 24px;
  }
}

@media (max-width: 420px) {
  .corner-actions {
    top: calc(10px + env(safe-area-inset-top));
    right: 10px;

    gap: 8px;
  }

  .settings-button {
    width: 38px;
    height: 38px;
  }

  .admin-button {
    min-height: 38px;

    padding: 0 12px;

    font-size: 12px;
  }

  .main-wrapper {
    width: 100%;
  }

  .title {
    font-size: clamp(34px, 11vw, 42px);
  }

  .menu-box {
    padding: 18px;

    gap: 20px;
  }

  .menu-side h2 {
    font-size: 19px;
  }

  .menu-box .btn {
    font-size: 13px;
  }
}
</style>
