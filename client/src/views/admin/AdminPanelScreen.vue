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
  "open-settings",
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

      <div class="top-actions">

        <button
          class="btn settings-button"
          type="button"
          aria-label="Open audio settings"
          title="Settings"
          @click="
            emit('open-settings')
          "
        >
          <i class="fa-solid fa-gear"></i>
        </button>

        <button
          class="btn btn-danger"

          @click="
            emit('leave')
          "
        >
          Main Menu
        </button>

      </div>

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
  height: 100dvh;
  min-height: 100vh;
  min-height: 100dvh;

  padding:
    clamp(10px, 0.9vw, 22px);

  padding-bottom:
    calc(clamp(10px, 0.9vw, 22px) + env(safe-area-inset-bottom));

  display: flex;
  flex-direction: column;

  overflow-y: auto;
  overflow-x: hidden;

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

  gap: clamp(12px, 0.9vw, 30px);

  margin-bottom: clamp(8px, 0.7vw, 18px);

  padding: clamp(8px, 0.65vw, 16px);

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
  gap: clamp(12px, 0.9vw, 30px);
  min-width: 0;
}

.panel-kicker {
  color:
    var(--game-green);

  font-size: clamp(10px, 0.55vw, 13px);
  font-weight: 900;
  letter-spacing: 1.3px;
  text-transform: uppercase;
}

.top-left h1 {
  margin: 0;

  font-size: clamp(26px, 1.55vw, 36px);
  font-weight: 900;
  text-transform: uppercase;

  white-space: nowrap;
}

.deck-stats {
  display: flex;
  gap: clamp(7px, 0.45vw, 16px);
}

.stat-chip {
  height: clamp(32px, 1.8vw, 42px);

  padding: 0 clamp(10px, 0.65vw, 24px);

  display: flex;
  align-items: center;

  border:
    1px solid rgba(255,255,255,0.1);

  border-radius: 10px;

  background:
    rgba(255,255,255,0.045);

  color:
    var(--game-muted);

  font-size: clamp(11px, 0.62vw, 14px);
  font-weight: 900;
  text-transform: uppercase;
}

.tab-buttons {
  display: flex;
  gap: clamp(8px, 0.55vw, 18px);
}

.tab-buttons .btn,
.top-actions .btn {
  min-height: clamp(34px, 1.85vw, 44px);

  padding:
    0
    clamp(12px, 0.75vw, 28px);

  font-size: clamp(11px, 0.66vw, 14px);
}

.top-actions {
  display: flex;
  align-items: center;

  gap: clamp(8px, 0.55vw, 18px);

  flex-shrink: 0;
}

.settings-button {
  width: clamp(36px, 1.9vw, 44px);
  height: clamp(36px, 1.9vw, 44px);

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
  font-size: clamp(15px, 0.8vw, 18px);
}

.panel-content {
  flex: 1;
  min-height: 0;

  padding: clamp(10px, 0.8vw, 20px);

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

  .top-bar {
    align-items: flex-start;
  }

  .top-left {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .tab-buttons {
    flex-wrap: nowrap;
    width: 100%;
    max-width: 340px;
  }

  .panel-kicker {
    display: none;
  }

  .top-left h1 {
    font-size: 24px;
  }

  .stat-chip,
  .tab-buttons .btn,
  .top-actions .btn {
    min-height: 34px;
    height: 34px;

    font-size: 12px;
  }

  .settings-button {
    width: 34px;
    height: 34px;
  }
}

@media (max-width: 620px) {
  .panel-container {
    height: 100dvh;

    padding:
      calc(8px + env(safe-area-inset-top))
      8px
      calc(32px + env(safe-area-inset-bottom));
  }

  .top-bar {
    gap: 8px;

    padding: 8px;
  }

  .top-left {
    flex: 1;
    gap: 8px;
  }

  .top-left h1 {
    font-size: 20px;
  }

  .deck-stats {
    order: 3;
    width: 100%;
  }

  .stat-chip {
    flex: 1;
    justify-content: center;
  }

  .tab-buttons {
    order: 4;
    max-width: none;
  }

  .tab-buttons .btn {
    flex: 1;
    min-width: 0;

    padding: 0 8px;

    font-size: 11px;
  }

  .top-actions {
    gap: 6px;
  }

  .top-actions .btn {
    padding: 0 9px;

    font-size: 11px;
  }

  .top-actions .settings-button {
    width: 34px;

    padding: 0;
  }

  .panel-content {
    padding: 10px;

    min-height: 0;
  }
}
</style>
