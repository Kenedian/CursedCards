<script setup>
import {
  ref,
  onMounted,
  onUnmounted
} from "vue"

import socket
from "../socket"

import {
  SOCKET_EVENTS
}
from "../../../shared/constants/socketEvents"

import AdminAuthScreen
from "./admin/AdminAuthScreen.vue"

import AdminPanelScreen
from "./admin/AdminPanelScreen.vue"

const emit = defineEmits([
  "leave"
])

const authenticated =
  ref(false)

const error =
  ref("")

function authenticate(password) {

  socket.emit(
    SOCKET_EVENTS.ADMIN_LOGIN,
    password
  )
}

function handleLoginSuccess() {

  authenticated.value =
    true

  error.value = ""

  socket.emit(
    SOCKET_EVENTS.ADMIN_GET_CARDS
  )
}

function handleLoginFailed() {

  error.value =
    "Wrong password"
}

onMounted(() => {

  socket.on(
    SOCKET_EVENTS.ADMIN_LOGIN_SUCCESS,

    handleLoginSuccess
  )

  socket.on(
    SOCKET_EVENTS.ADMIN_LOGIN_FAILED,

    handleLoginFailed
  )
})

onUnmounted(() => {

  socket.off(
    SOCKET_EVENTS.ADMIN_LOGIN_SUCCESS,

    handleLoginSuccess
  )

  socket.off(
    SOCKET_EVENTS.ADMIN_LOGIN_FAILED,

    handleLoginFailed
  )
})
</script>

<template>
  <AdminAuthScreen
    v-if="!authenticated"

    :error="error"

    @authenticate="authenticate"

    @leave="
      emit('leave')
    "
  />

  <AdminPanelScreen
    v-else

    @leave="
      emit('leave')
    "
  />
</template>
