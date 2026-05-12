<script setup>
const props = defineProps({
  visible: Boolean
})

const emit = defineEmits([
  "confirm",
  "cancel"
])
</script>

<template>
  <div
    v-if="props.visible"
    class="modal-overlay"
  >

    <div class="modal-box">

      <h2>
        Delete card?
      </h2>

      <p>
        This action cannot be undone.
      </p>

      <div class="modal-buttons">

        <button
          class="btn btn-secondary"

          @click="
            emit('cancel')
          "
        >
          Cancel
        </button>

        <button
          class="btn btn-danger"

          @click="
            emit('confirm')
          "
        >
          Delete
        </button>

      </div>

    </div>

  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;

  background:
    rgba(0,0,0,0.72);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 99999;

  backdrop-filter: blur(8px);

  padding:
    calc(18px + env(safe-area-inset-top))
    18px
    calc(18px + env(safe-area-inset-bottom));
}

.modal-box {
  width: min(420px, 100%);
  max-height: calc(100dvh - 36px - env(safe-area-inset-top) - env(safe-area-inset-bottom));

  background:
    linear-gradient(
      180deg,
      var(--game-panel-strong),
      rgba(7,9,8,0.98)
    );

  border:
    1px solid rgba(255,77,97,0.28);

  border-radius: 14px;

  padding: 32px;

  box-shadow:
    var(--game-shadow),
    0 0 44px rgba(255,77,97,0.12),
    inset 0 1px 0 rgba(255,255,255,0.08);

  display: flex;
  flex-direction: column;
  gap: 22px;

  overflow-y: auto;
}

.modal-box h2 {
  margin: 0;

  color:
    #ff9aa6;

  font-size: 30px;
  font-weight: 900;
  text-transform: uppercase;
}

.modal-box p {
  margin: 0;

  color:
    var(--game-muted);

  font-size: 16px;
  font-weight: 800;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.modal-buttons .btn {
  min-height: 42px;

  padding: 0 18px;

  font-size: 14px;
}

@media (max-width: 480px) {
  .modal-box {
    padding: 22px;

    gap: 18px;
  }

  .modal-box h2 {
    font-size: 24px;
  }

  .modal-buttons {
    gap: 8px;
  }

  .modal-buttons .btn {
    flex: 1;

    min-height: 40px;

    padding: 0 10px;

    font-size: 12px;
  }
}
</style>
