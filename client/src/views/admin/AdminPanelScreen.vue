<script setup>
import {
  ref,
  onMounted,
  onUnmounted
} from "vue"

import socket
from "../../socket"

import {
  SOCKET_EVENTS
}
from "../../../../shared/constants/socketEvents"

import useToast
from "../../composables/useToast"

import useCardsAdmin
from "../../composables/admin/useCardsAdmin"

import CreateCardTab
from "../../components/admin/CreateCardTab.vue"

import BrowseCardsTab
from "../../components/admin/BrowseCardsTab.vue"

const emit = defineEmits([
  "leave"
])

const {
  toastError
} = useToast()

const currentTab =
  ref("create")

const {

  whiteCards,
  blackCards,

  currentType,
  cardText,
  editingCard,

  trimmedText,
  blackBlankCount,
  canCreate,

  addBlank,
  startEdit,
  cancelEdit,
  submitCard,
  deleteCard

} = useCardsAdmin()

function handleAdminError(
  message
) {

  console.log(
    "ADMIN ERROR:",
    message
  )

  toastError(message)
}

function handleEdit(card) {

  startEdit(card)

  currentTab.value =
    "create"
}

onMounted(() => {

  socket.on(
    SOCKET_EVENTS.ADMIN_ACTION_FAILED,

    handleAdminError
  )
})

onUnmounted(() => {

  socket.off(
    SOCKET_EVENTS.ADMIN_ACTION_FAILED,

    handleAdminError
  )
})
</script>

<template>
  <div class="panel-container">

    <div class="top-bar">

      <div class="top-left">

        <h1>
          Admin Panel
        </h1>

        <div class="tab-buttons">

          <button
            class="btn"

            :class="
              currentTab === 'create'
                ? 'btn-primary'
                : 'btn-secondary'
            "

            @click="
              currentTab = 'create'
            "
          >
            Create Card
          </button>

          <button
            class="btn"

            :class="
              currentTab === 'browse'
                ? 'btn-primary'
                : 'btn-secondary'
            "

            @click="
              currentTab = 'browse'
            "
          >
            Browse Cards
          </button>

        </div>

      </div>

      <button
        class="btn btn-danger"

        @click="
          emit('leave')
        "
      >
        Main Menu
      </button>

    </div>

    <div class="panel-content">

      <CreateCardTab
        v-if="
          currentTab === 'create'
        "

        :current-type="
          currentType
        "

        :card-text="
          cardText
        "

        :trimmed-text="
          trimmedText
        "

        :black-blank-count="
          blackBlankCount
        "

        :can-create="
          canCreate
        "

        :editing-card="
          editingCard
        "

        @set-type="
          currentType = $event
        "

        @update-text="
          cardText = $event
        "

        @add-blank="
          addBlank
        "

        @create-card="
          submitCard
        "

        @cancel-edit="
          cancelEdit
        "
      />

      <BrowseCardsTab
        v-else

        :white-cards="
          whiteCards
        "

        :black-cards="
          blackCards
        "

        @delete-card="
          deleteCard
        "

        @edit-card="
          handleEdit
        "
      />

    </div>

  </div>
</template>

<style scoped>
.panel-container {
  width: 100vw;
  height: 100vh;

  padding: 30px;

  display: flex;
  flex-direction: column;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 30px;
}

.top-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.tab-buttons {
  display: flex;
  gap: 10px;
}

.panel-content {
  flex: 1;
  min-height: 0;
}
</style>