import { createApp }
from "vue"

import App
from "./App.vue"

import registerGameSocketListeners
from "./socket/gameSocketListeners"

import {
  initGameAudio
}
from "./composables/useGameAudio"

import "bootstrap/dist/css/bootstrap.min.css"
import "@fortawesome/fontawesome-free/css/all.min.css"

import "./style.css"

registerGameSocketListeners()

initGameAudio()

createApp(App)
  .mount("#app")
