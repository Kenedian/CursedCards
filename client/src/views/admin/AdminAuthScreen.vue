<script setup>
import { ref } from "vue"

const props = defineProps({
  error: String
})

const emit = defineEmits([
  "authenticate",
  "open-settings",
  "leave"
])

const password = ref("")
</script>

<template>
  <div class="auth-container">
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

      <button
        class="btn btn-secondary auth-button"

        @click="
          emit('leave')
        "
      >
        Main Menu
      </button>

    </div>

  </div>
</template>

<style scoped>
.auth-container {
  width: 100vw;
  min-height: 100vh;
  min-height: 100dvh;

  display: flex;
  justify-content: center;
  align-items: center;

  padding:
    clamp(24px, 2vw, 72px);

  padding-bottom:
    calc(clamp(24px, 2vw, 72px) + env(safe-area-inset-bottom));

  overflow-y: auto;
  overflow-x: hidden;
}

.settings-button {
  position: absolute;

  top: clamp(16px, 1.2vw, 36px);
  right: clamp(16px, 1.2vw, 36px);

  width: clamp(46px, 2.4vw, 92px);
  height: clamp(46px, 2.4vw, 92px);

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
  font-size: clamp(20px, 1vw, 38px);
}

.auth-box {
  width: min(82vw, 920px);

  background:
    linear-gradient(
      180deg,
      var(--game-panel-strong),
      rgba(7,9,8,0.98)
    );

  border:
    1px solid var(--game-line);

  border-radius: 14px;

  padding:
    clamp(36px, 2.6vw, 96px);

  display: flex;
  flex-direction: column;
  gap: clamp(18px, 1.25vw, 48px);

  box-shadow:
    var(--game-shadow),
    inset 0 1px 0 rgba(255,255,255,0.08),
    0 0 0 4px rgba(0,0,0,0.22);
}

.auth-kicker {
  color:
    var(--game-green);

  font-size: clamp(13px, 0.72vw, 26px);
  font-weight: 900;
  letter-spacing: 1.4px;
  text-transform: uppercase;
}

.auth-box h1 {
  margin: 0;

  font-size: clamp(38px, 2.6vw, 96px);
  font-weight: 900;
  text-transform: uppercase;

  text-shadow:
    0 3px 0 rgba(0,0,0,0.55),
    0 0 28px rgba(47,230,107,0.18);
}

.auth-button {
  height: clamp(52px, 3.2vw, 118px);

  font-size: clamp(18px, 1vw, 38px);
}

.auth-box .form-control {
  height: clamp(50px, 3vw, 110px);

  padding:
    0
    clamp(14px, 1vw, 36px);

  font-size: clamp(17px, 1vw, 36px);
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

  font-size: clamp(14px, 0.8vw, 28px);
  font-weight: 800;
}

@media (max-width: 1100px) {
  .auth-container {
    align-items: flex-start;

    padding:
      calc(70px + env(safe-area-inset-top))
      18px
      calc(24px + env(safe-area-inset-bottom));
  }

  .auth-box {
    width: min(88vw, 620px);

    padding: 34px;
  }
}

@media (max-width: 480px) {
  .settings-button {
    top: calc(10px + env(safe-area-inset-top));
    right: 10px;

    width: 38px;
    height: 38px;
  }

  .auth-box {
    width: 100%;

    padding: 24px;
  }

  .auth-box h1 {
    font-size: 30px;
  }

  .auth-button {
    height: 46px;

    font-size: 14px;
  }
}
</style>
