<template>
  <div 
    class="relative group inline-flex items-start gap-1"
    @mouseenter="showPencil = true"
    @mouseleave="showPencil = false"
  >
    <span
      ref="textElement"
      :contenteditable="isEditing"
      @click="startEditing"
      @blur="finishEditing"
      @keydown="handleKeydown"
      class="outline-none"
      :class="{ 'cursor-text': isEditing }"
    >
      {{ displayText }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'

interface Props {
  modelValue: string
  placeholder?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Cliquez pour modifier...'
})

const emit = defineEmits<Emits>()

const isEditing = ref(false)
const showPencil = ref(false)
const textElement = ref<HTMLElement>()
const originalValue = ref('')
const displayText = ref(props.modelValue || props.placeholder)

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  if (!isEditing.value) {
    displayText.value = newValue || props.placeholder
  }
}, { immediate: true })

const startEditing = async () => {
  if (isEditing.value) return
  
  isEditing.value = true
  originalValue.value = props.modelValue
  displayText.value = props.modelValue || ''
  
  await nextTick()
  
  if (textElement.value) {
    textElement.value.focus()
    
    // Select all text
    const range = document.createRange()
    range.selectNodeContents(textElement.value)
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
  }
}

const finishEditing = () => {
  if (!isEditing.value) return
  
  const newValue = textElement.value?.textContent?.trim() || ''
  
  if (newValue !== originalValue.value) {
    emit('update:modelValue', newValue)
  }
  
  displayText.value = newValue || props.placeholder
  isEditing.value = false
  showPencil.value = false
}

const cancelEditing = () => {
  if (!isEditing.value) return
  
  displayText.value = originalValue.value || props.placeholder
  if (textElement.value) {
    textElement.value.textContent = originalValue.value
  }
  
  isEditing.value = false
  showPencil.value = false
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!isEditing.value) return
  
  if (event.key === 'Enter') {
    event.preventDefault()
    finishEditing()
  } else if (event.key === 'Escape') {
    event.preventDefault()
    cancelEditing()
  }
}
</script>
