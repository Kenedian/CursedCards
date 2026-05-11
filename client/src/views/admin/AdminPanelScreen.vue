<script setup>
import {
  ref,
  nextTick,
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

const createCardTab =
  ref(null)

const isSubmitting =
  ref(false)

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

async function focusCreateInput() {

  await nextTick()

  createCardTab.value?.focusInput()
}

function handleAddBlank() {

  addBlank()

  focusCreateInput()
}

async function handleSubmit() {

  if (isSubmitting.value) {
    return
  }

  const wasEditing =
    !!editingCard.value

  let shouldReturnToBrowse = false
  let shouldFocusInput = false

  isSubmitting.value = true

  try {

    await submitCard()

    if (
      wasEditing &&
      !editingCard.value
    ) {
      shouldReturnToBrowse = true
    }

    if (!wasEditing) {
      shouldFocusInput = true
    }
  }

  finally {

    isSubmitting.value = false
  }

  if (shouldReturnToBrowse) {

    currentTab.value =
      "browse"

    return
  }

  if (shouldFocusInput) {
    await focusCreateInput()
  }
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

        <div>

          <div class="panel-kicker">
            Deck Console
          </div>

          <h1>
            Admin Panel
          </h1>

        </div>

        <div class="deck-stats">

          <div class="stat-chip">
            White {{ whiteCards.length }}
          </div>

          <div class="stat-chip">
            Black {{ blackCards.length }}
          </div>

        </div>

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

        ref="createCardTab"

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

        :is-submitting="
          isSubmitting
        "

        @set-type="
          currentType = $event
        "

        @update-text="
          cardText = $event
        "

        @add-blank="
          handleAddBlank
        "

        @create-card="
          handleSubmit
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

  padding: 22px;

  display: flex;
  flex-direction: column;

  background:
    radial-gradient(
      ellipse at center,
      rgba(47,230,107,0.08),
      transparent 52%
    );
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 18px;

  margin-bottom: 18px;

  padding: 14px;

  border:
    1px solid rgba(47,230,107,0.18);

  border-radius: 12px;

  background:
    linear-gradient(
      180deg,
      rgba(12,16,14,0.88),
      rgba(6,8,7,0.48)
    );

  box-shadow:
    0 18px 32px rgba(0,0,0,0.22),
    inset 0 1px 0 rgba(255,255,255,0.06);
}

.top-left {
  display: flex;
  align-items: center;
  gap: 18px;
  min-width: 0;
}

.panel-kicker {
  color:
    var(--game-green);

  font-size: 12px;
  font-weight: 900;
  letter-spacing: 1.3px;
  text-transform: uppercase;
}

.top-left h1 {
  margin: 0;

  font-size: 34px;
  font-weight: 900;
  text-transform: uppercase;

  white-space: nowrap;
}

.deck-stats {
  display: flex;
  gap: 8px;
}

.stat-chip {
  height: 38px;

  padding: 0 12px;

  display: flex;
  align-items: center;

  border:
    1px solid rgba(255,255,255,0.1);

  border-radius: 10px;

  background:
    rgba(255,255,255,0.045);

  color:
    var(--game-muted);

  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
}

.tab-buttons {
  display: flex;
  gap: 10px;
}

.panel-content {
  flex: 1;
  min-height: 0;

  padding: 18px;

  border:
    1px solid var(--game-line);

  border-radius: 14px;

  background:
    linear-gradient(
      180deg,
      rgba(13,17,15,0.76),
      rgba(7,9,8,0.84)
    );

  box-shadow:
    var(--game-shadow),
    inset 0 1px 0 rgba(255,255,255,0.06);
}

@media (max-width: 1050px) {

  .top-bar,
  .top-left {
    align-items: stretch;
    flex-direction: column;
  }

  .tab-buttons {
    flex-wrap: wrap;
  }
}
</style>
