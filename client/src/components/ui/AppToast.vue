<script setup>
defineProps({
  visible: Boolean,

  message: {
    type: String,
    default: ""
  },

  type: {
    type: String,
    default: "error"
  }
})
</script>

<template>
  <Transition name="toast">

    <div
      v-if="visible"

      class="toast-container"

      :class="type"
    >

      <div class="toast-icon">
        <i
          :class="
            type === 'success'
              ? 'fa-solid fa-check'
              : 'fa-solid fa-triangle-exclamation'
          "
        ></i>
      </div>

      <div class="toast-content">

      <div class="toast-title">

        {{
          type === "success"
            ? "Signal Confirmed"
            : "Action Blocked"
        }}

      </div>

      <div class="toast-message">
        {{ message }}
      </div>

      </div>

    </div>

  </Transition>
</template>

<style scoped>
.toast-container {
  position: fixed;

  top: 92px;
  right: 24px;

  min-width: 320px;
  max-width: 420px;

  color: white;

  padding:
    14px 16px;

  display: flex;
  align-items: flex-start;
  gap: 12px;

  border:
    1px solid rgba(255,255,255,0.1);

  border-left:
    4px solid var(--game-red);

  border-radius: 12px;

  background:
    linear-gradient(
      180deg,
      rgba(18,23,20,0.98),
      rgba(7,9,8,0.98)
    );

  z-index: 999999;

  backdrop-filter:
    blur(12px);

  box-shadow:
    0 18px 42px rgba(0,0,0,0.42),
    inset 0 1px 0 rgba(255,255,255,0.08);
}

.toast-container.error {
  border-left-color:
    var(--game-red);
}

.toast-container.success {
  border-left-color:
    var(--game-green);
}

.toast-icon {
  width: 34px;
  height: 34px;

  display: flex;
  justify-content: center;
  align-items: center;

  flex-shrink: 0;

  border-radius: 8px;

  background:
    rgba(255,77,97,0.14);

  color:
    #ff9aa6;

  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.08);
}

.toast-container.success
.toast-icon {
  background:
    rgba(47,230,107,0.14);

  color:
    var(--game-green);
}

.toast-content {
  min-width: 0;
}

.toast-title {
  font-size: 12px;
  font-weight: 900;

  color:
    #ff9aa6;

  margin-bottom: 4px;

  text-transform: uppercase;
  letter-spacing: 1.2px;
}

.toast-container.success
.toast-title {
  color:
    var(--game-green);
}

.toast-message {
  color:
    rgba(255,255,255,0.9);

  font-size: 16px;
  font-weight: 800;

  line-height: 1.32;
}

.toast-enter-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.toast-enter-from {
  opacity: 0;

  transform:
    translateX(22px)
    scale(0.98);
}

.toast-enter-to {
  opacity: 1;

  transform:
    translateX(0)
    scale(1);
}

.toast-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}

.toast-leave-from {
  opacity: 1;

  transform:
    translateX(0)
    scale(1);
}

.toast-leave-to {
  opacity: 0;

  transform:
    translateX(26px)
    scale(0.98);
}
</style>
