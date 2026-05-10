<script setup>
import {
  ref,
  onMounted,
  onUnmounted
}
from "vue"

import socket
from "../socket"

import {
  SOCKET_EVENTS
}
from "../../../shared/constants/socketEvents"

import AppToast
from "../components/ui/AppToast.vue"

const emit = defineEmits([
  "open-lobby",
  "open-admin"
])

const createUsername =
  ref("")

const joinUsername =
  ref("")

const joinCode =
  ref("")

const toast =
  ref("")

let toastTimeout =
  null

function showToast(message) {

  toast.value = message

  clearTimeout(
    toastTimeout
  )

  toastTimeout =
    setTimeout(() => {

      toast.value = ""

    }, 3000)
}

function createLobby() {

  if (
    !createUsername.value.trim()
  ) {

    showToast(
      "Enter username"
    )

    return
  }

  socket.emit(
    SOCKET_EVENTS.CREATE_LOBBY,

    {
      username:
        createUsername.value.trim()
    }
  )
}

function joinLobby() {

  if (
    !joinUsername.value.trim()
  ) {

    showToast(
      "Enter username"
    )

    return
  }

  if (
    !joinCode.value.trim()
  ) {

    showToast(
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
          .toUpperCase()
    }
  )
}

function handleLobbySuccess() {

  emit("open-lobby")
}

function handleLobbyError(
  message
) {

  showToast(message)
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
    SOCKET_EVENTS.LOBBY_ERROR,
    handleLobbyError
  )
})
</script>

<template>

  <AppToast
    :visible="!!toast"

    :message="toast"
  />

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

  font-size: 64px;

  margin-bottom: 25px;
}

.menu-box {
  background: #2a2a2a;

  border-radius: 25px;

  padding: 40px;

  width: 900px;

  display: flex;

  gap: 40px;

  box-shadow:
    0 0 30px rgba(0,0,0,0.5);
}

.menu-side {
  flex: 1;

  display: flex;
  flex-direction: column;

  gap: 20px;
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