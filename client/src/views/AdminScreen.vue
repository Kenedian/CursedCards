<script setup>
import { ref } from "vue"

import AdminAuthScreen
from "./admin/AdminAuthScreen.vue"

import AdminPanelScreen
from "./admin/AdminPanelScreen.vue"

const authenticated = ref(true) // TODO: change to false
const error = ref("")

function authenticate(password) {
  if (password === "fazolepokadil") {
    authenticated.value = true
    error.value = ""

    return
  }

  error.value = "Wrong password"
}
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