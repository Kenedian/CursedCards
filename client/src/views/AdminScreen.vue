<script setup>
import { ref }
from "vue"

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

socket.on(
  SOCKET_EVENTS.ADMIN_LOGIN_SUCCESS,

  () => {

    authenticated.value =
      true

    error.value = ""
  }
)

socket.on(
  SOCKET_EVENTS.ADMIN_LOGIN_FAILED,

  () => {

    error.value =
      "Wrong password"
  }
)
</script>

<template>
  <AdminAuthScreen
    v-if="!authenticated"

    :error="error"

    @authenticate="authenticate"
  />

  <AdminPanelScreen
    v-else
  />
</template>