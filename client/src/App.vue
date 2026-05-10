<script setup>
import {
  ref,
  watch
}
from "vue"

import socket
from "./socket"

import useGameStore
from "./stores/gameStore"

import {
  SOCKET_EVENTS
}
from "../../shared/constants/socketEvents"

import { SCREENS }
from "./constants/screens"

import MainScreen
from "./views/MainScreen.vue"

import LobbyScreen
from "./views/LobbyScreen.vue"

import GameScreen
from "./views/GameScreen.vue"

import AdminScreen
from "./views/AdminScreen.vue"

const {
  currentLobby
} = useGameStore()

const currentScreen =
  ref(SCREENS.MENU)

watch(

  currentLobby,

  lobby => {

    if (!lobby) {

      if (
        currentScreen.value ===
        SCREENS.LOBBY
      ) {

        currentScreen.value =
          SCREENS.MENU
      }
    }
  }
)

function openMenu() {

  if (currentLobby.value) {

    socket.emit(
      SOCKET_EVENTS.LEAVE_LOBBY,

      currentLobby.value.code
    )
  }

  currentScreen.value =
    SCREENS.MENU
}

function openLobby() {

  currentScreen.value =
    SCREENS.LOBBY
}

function openGame() {

  currentScreen.value =
    SCREENS.GAME
}

function openAdmin() {

  currentScreen.value =
    SCREENS.ADMIN
}
</script>

<template>

  <MainScreen
    v-if="
      currentScreen ===
      SCREENS.MENU
    "

    @open-lobby="openLobby"
    @open-admin="openAdmin"
  />

  <LobbyScreen
    v-else-if="
      currentScreen ===
      SCREENS.LOBBY
    "

    @leave="openMenu"

    @start-game="
      openGame
    "
  />

  <GameScreen
    v-else-if="
      currentScreen ===
      SCREENS.GAME
    "

    @leave="openMenu"

    @back-to-lobby="
      openLobby
    "
  />

  <AdminScreen
    v-else-if="
      currentScreen ===
      SCREENS.ADMIN
    "

    @leave="openMenu"
  />

</template>