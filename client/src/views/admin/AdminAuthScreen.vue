<script setup>
import { ref } from "vue"

const props = defineProps({
  error: String
})

const emit = defineEmits([
  "authenticate"
])

const password = ref("")
</script>

<template>
  <div class="auth-container">

    <div class="auth-box">

      <div class="auth-kicker">
        Restricted Deck Console
      </div>

      <h1>
        Admin Panel
      </h1>

      <input
        v-model="password"

        type="password"
        placeholder="Password"

        class="form-control"

        @keydown.enter="
          emit('authenticate', password)
        "
      >

      <div
        v-if="props.error"
        class="error-text"
      >
        {{ props.error }}
      </div>

      <button
        class="btn btn-primary auth-button"

        @click="
          emit('authenticate', password)
        "
      >
        Authenticate
      </button>

    </div>

  </div>
</template>

<style scoped>
.auth-container {
  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 24px;
}

.auth-box {
  width: 420px;

  background:
    linear-gradient(
      180deg,
      var(--game-panel-strong),
      rgba(7,9,8,0.98)
    );

  border:
    1px solid var(--game-line);

  border-radius: 14px;

  padding: 40px;

  display: flex;
  flex-direction: column;
  gap: 20px;

  box-shadow:
    var(--game-shadow),
    inset 0 1px 0 rgba(255,255,255,0.08),
    0 0 0 4px rgba(0,0,0,0.22);
}

.auth-kicker {
  color:
    var(--game-green);

  font-size: 13px;
  font-weight: 900;
  letter-spacing: 1.4px;
  text-transform: uppercase;
}

.auth-box h1 {
  margin: 0;

  font-size: 38px;
  font-weight: 900;
  text-transform: uppercase;

  text-shadow:
    0 3px 0 rgba(0,0,0,0.55),
    0 0 28px rgba(47,230,107,0.18);
}

.auth-button {
  height: 52px;

  font-size: 18px;
}

.error-text {
  padding: 10px 12px;

  border:
    1px solid rgba(255,77,97,0.28);

  border-radius: 10px;

  background:
    rgba(255,77,97,0.09);

  color:
    #ff9aa6;

  font-size: 14px;
  font-weight: 800;
}
</style>
