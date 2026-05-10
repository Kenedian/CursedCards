import { ref }
from "vue"

const toast = ref({
  visible: false,
  message: "",
  type: "error"
})

export default function useUiStore() {

  return {
    toast
  }
}