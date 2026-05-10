<script setup>
import {
  ref,
  computed
} from "vue"

import useGameStore
from "./stores/gameStore"

import useUiStore
from "./stores/uiStore"

import {
  SCREENS
}
from "./constants/screens"

import MainScreen
from "./views/MainScreen.vue"

import LobbyScreen
from "./views/LobbyScreen.vue"

import GameScreen
from "./views/GameScreen.vue"

import AdminScreen
from "./views/AdminScreen.vue"

import AppToast
from "./components/ui/AppToast.vue"

import {
  playSound
}
from "./composables/useGameAudio"

const {
  currentLobby
} = useGameStore()

const {
  toast
} = useUiStore()

const adminOpen =
  ref(false)

const currentScreen =
  computed(() => {

    if (!currentLobby.value) {
      return SCREENS.MENU
    }

    if (
      currentLobby.value.game
    ) {

      return SCREENS.GAME
    }

    return SCREENS.LOBBY
  })

function openAdmin() {

  playSound("adminOpen")

  adminOpen.value = true
}

function closeAdmin() {

  adminOpen.value = false
}
</script>

<template>

  <!-- GLOBAL TOAST -->

  <AppToast
    :visible="
      toast.visible
    "

    :message="
      toast.message
    "

    :type="
      toast.type
    "
  />

  <!-- ADMIN -->

  <AdminScreen
    v-if="adminOpen"

    @leave="closeAdmin"
  />

  <!-- NORMAL APP -->

  <template v-else>

    <MainScreen
      v-if="
        currentScreen ===
        SCREENS.MENU
      "

      @open-admin="openAdmin"
    />

    <LobbyScreen
      v-else-if="
        currentScreen ===
        SCREENS.LOBBY
      "
    />

    <GameScreen
      v-else-if="
        currentScreen ===
        SCREENS.GAME
      "
    />

  </template>

</template>
