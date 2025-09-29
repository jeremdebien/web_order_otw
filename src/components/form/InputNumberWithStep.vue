<template>
  <div
    :class="[
      'inline-flex items-center gap-2 rounded-full bg-gray-50 sm:p-1 md:p-1.5 shadow-inner border border-gray-200',
      sizeClasses.container,
    ]"
  >
    <!-- Decrease Button -->
    <button
      :class="[
        'flex items-center justify-center rounded-full bg-white text-gray-700 border border-gray-300',
        'hover:bg-gray-100 active:scale-95 transition-all duration-150',
        sizeClasses.button,
      ]"
      @click.stop.prevent="decrease"
      @touchstart.stop.prevent="decrease"
    >
      <span :class="sizeClasses.icon" :style="sizeClasses.iconStyle">−</span>
    </button>

    <!-- Native Input -->
    <input
      type="number"
      inputmode="numeric"
      pattern="[0-9]*"
      v-model.number="value"
      :min="1"
      :max="max"
      @input="onInput"
      :class="[
        'appearance-none border-0 bg-transparent text-center font-semibold text-gray-700',
        'focus:outline-none focus:ring-0 focus:border-0',
        'text-[18px]', // Prevent zoom on iOS
        sizeClasses.input,
      ]"
    />

    <!-- Increase Button -->
    <button
      :class="[
        'flex items-center justify-center rounded-full bg-white text-gray-700 border border-gray-300',
        'hover:bg-gray-100 active:scale-95 transition-all duration-150',
        sizeClasses.button,
      ]"
      @click.stop.prevent="increase"
      @touchstart.stop.prevent="increase"
    >
      <span :class="sizeClasses.icon" :style="sizeClasses.iconStyle">+</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  size?: 'sm' | 'md' | 'lg'
  modelValue?: number
  max?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'update', value: number): void
}>()

const value = ref(props.modelValue ?? 1)

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== undefined && newVal !== value.value) {
      value.value = newVal
    }
  }
)

watch(value, (newVal) => {
  emit('update:modelValue', newVal)
  emit('update', newVal)
})

function increase() {
  if (props.max === undefined || value.value < props.max) {
    value.value++
  }
}

function decrease() {
  value.value = Math.max(1, value.value - 1)
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  const newVal = parseInt(target.value)
  if (!isNaN(newVal)) value.value = newVal
}

// Responsive size classes
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        button: 'h-6 w-6 text-sm',
        input: 'h-6 w-12 text-sm',
        container: 'text-sm',
        icon: 'text-sm',
        iconStyle: 'font-size: 12px',
      }
    case 'lg':
      return {
        button: 'h-12 w-12 text-lg',
        input: 'h-12 w-20 text-lg',
        container: 'text-lg',
        icon: 'text-xl',
        iconStyle: '',
      }
    case 'md':
    default:
      return {
        button: 'h-8 w-8 text-base',
        input: 'h-10 w-16 text-base',
        container: 'text-base',
        icon: 'text-base',
        iconStyle: '',
      }
  }
})
</script>