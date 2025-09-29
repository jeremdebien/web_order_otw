<template>
  <!-- Overlay -->
  <div v-if="isOpen" class="fixed inset-0 z-40 bg-black/40" @click.self="closeDrawer" />

  <!-- Drawer -->
  <Transition name="slide-up">
    <div
      v-if="isOpen"
      class="fixed right-0 bottom-0 left-0 z-50 flex h-[90vh] flex-col rounded-t-2xl bg-white shadow-2xl"
    >
      <!-- Drag handle -->
      <div class="mx-auto mt-2 h-1.5 w-12 rounded-full bg-gray-300"></div>

      <!-- Header -->
      <div class="flex items-center justify-between px-4 pt-2 pb-2">
        <h2 class="text-lg font-semibold">Your Items</h2>
        <Button icon="pi pi-times" text rounded severity="secondary" @click="closeDrawer" />
      </div>
      <div class="mb-3 border-t border-gray-200" />

      <!-- Scrollable Cart Items -->
      <div class="flex-1 overflow-y-auto px-4 pt-2">
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

      <!-- Summary & Submit -->
      <div class="bg-white px-4 pt-4 pb-6">
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
          class="mt-3 w-full rounded bg-blue-600 px-4 py-2 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
          :disabled="cartStore.count === 0"
          @click="openPaymentDialog"
        >
          Submit Order
        </button>
      </div>
    </div>
  </Transition>

  <!-- Payment Option Dialog -->
  <PaymentOptionDialog :visible="showDialog" @close="showDialog = false" />

  <!-- Floating Button -->
  <button
    id="view-order"
    v-if="!isOpen && cartItems.length > 0"
    class="fixed bottom-4 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 transform rounded-xl px-4 py-3 text-white text-lg shadow-xl lg:hidden"
    :style="{ backgroundColor: theme.colors.primary }"
    @click="openDrawer"
  >
    View Order - ₱{{ totalAmount.toFixed(2) }}
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCartStore } from '@/stores/cart';
import ProductTile from '@/components/ProductTile.vue';
import PaymentOptionDialog from '@/components/PaymentOptionDialog.vue';
import theme from '@/theme';

const isOpen = ref(false);
const showDialog = ref(false);
const cartStore = useCartStore();

const cartItems = computed(() => cartStore.items);
const totalAmount = computed(() => cartStore.total);

function openDrawer() {
  isOpen.value = true;
}

function closeDrawer() {
  isOpen.value = false;
}

function openPaymentDialog() {
  if (cartStore.count === 0) return;
  showDialog.value = true;
  closeDrawer();
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
