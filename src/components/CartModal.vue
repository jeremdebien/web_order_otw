<template>
  <Teleport to="body">
    <Transition name="fade" appear>
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
        role="dialog"
        aria-modal="true"
        @click.self="emit('close')"
      >
        <div class="relative max-h-[90vh] w-[90%] max-w-md overflow-y-auto rounded-lg bg-white shadow-xl">
          <!-- Close Button -->
          <div class="absolute top-2 right-2">
            <Button icon="pi pi-times" text rounded severity="secondary" @click="emit('close')" />
          </div>

          <!-- Header -->
          <div class="px-6 pt-5 pb-3">
            <h2 class="text-xl font-semibold">Your Cart</h2>
          </div>
          <div class="border-t border-gray-200" />

          <!-- Items -->
          <div class="max-h-[55vh] overflow-y-auto px-6 py-4">
            <div v-if="cartItems.length === 0" class="flex h-full items-center justify-center text-sm text-gray-500">
              Your cart is empty.
            </div>

            <div v-else>
              <template v-for="(item, index) in cartItems" :key="index">
                <ProductTile :product="item" @remove="() => cartStore.removeItem(index)" />
                <div v-if="index < cartItems.length - 1" class="my-3 border-t border-gray-200" />
              </template>
            </div>
          </div>

          <div class="border-t border-gray-200" />

          <!-- Summary & Actions -->
          <div class="px-6 pt-4 pb-6">
            <div class="space-y-1 text-sm font-medium">
              <div class="flex justify-between">
                <span>Items:</span>
                <span>{{ cartStore.count }}</span>
              </div>
              <div class="flex justify-between">
                <span>Total:</span>
                <span>₱{{ cartStore.total.toFixed(2) }}</span>
              </div>
            </div>
            <button
              class="mt-3 w-full rounded px-4 py-2 text-lg font-semibold text-white transition disabled:bg-gray-400"
              :style="{ backgroundColor: theme.colors.primary }"
              :disabled="cartStore.count === 0"
              @click="openPaymentDialog"
            >
              Submit Order
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Payment Option Dialog -->
  <PaymentOptionDialog :visible="showDialog" @close="showDialog = false" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import ProductTile from '@/components/ProductTile.vue'
import PaymentOptionDialog from '@/components/PaymentOptionDialog.vue'
import theme from '@/theme'

defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const cartStore = useCartStore()
const cartItems = computed(() => cartStore.items)
const showDialog = ref(false)

function openPaymentDialog() {
  if (cartStore.count === 0) return
  showDialog.value = true
  emit('close')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>


