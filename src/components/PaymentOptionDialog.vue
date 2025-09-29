<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2"
    @click="$emit('close')"
  >
    <div class="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl" @click.stop>
      <h2 class="mb-4 text-center text-lg font-semibold">Select Payment Option</h2>
      <div class="mb-4 flex gap-2">
        <!-- Pay at Counter -->
        <div
          class="flex w-1/2 cursor-pointer flex-col items-center justify-center rounded-lg border border-gray-300 p-2 hover:bg-gray-100"
          @click="handleSubmit"
        >
          <div class="p-4">
            <img src="/images/money.png" alt="Pay at counter" class="h-full w-full" />
          </div>
          <span class="w-full rounded py-2 text-center text-white" :style="{ backgroundColor: theme.colors.primary }">
            Pay at the counter
          </span>
        </div>

        <!-- Cashless Payment -->
        <div
          class="flex w-1/2 flex-col items-center justify-center overflow-hidden rounded-lg border border-gray-300 bg-black/30 p-2"
          :class="[isGcashEnabled ? 'opacity-100' : 'pointer-events-none cursor-not-allowed opacity-80']"
        >
          <div class="p-4">
            <img src="/images/cashless-payment.png" alt="Pay at counter" class="h-full w-full" />
          </div>
          <button
            @click="handleSubmit"
            :disabled="!isGcashEnabled"
            :class="[
              'w-full rounded py-2 text-base text-white',
              isGcashEnabled ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400',
            ]"
          >
            Cashless Payment
          </button>
        </div>
      </div>

      <!-- Name Input -->
      <div class="mt-4">
        <p class="mb-2 text-center text-sm font-bold text-gray-500">
          May I have your name for the order, please?
        </p>
        <input
          id="customerName"
          type="text"
          class="w-full rounded-md border border-gray-300 p-2"
          placeholder="Your nickname"
          v-model="customerName"
        />
      </div>
    </div>
  </div>

  <!-- Loading Dialog -->
  <div
    v-if="isLoading"
    class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60"
  >
    <div class="rounded-xl bg-white px-6 py-4 text-center shadow-xl">
      <div
        class="mx-auto mb-2 h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
      ></div>
      <p class="text-sm text-gray-600">Submitting your order...</p>
    </div>
  </div>

  <!-- Confirmation Modal -->
  <div
    v-if="showConfirm"
    class="fixed inset-0 z-[200] flex items-center justify-center bg-black/50"
  >
    <div class="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
      <h3 class="mb-4 text-center text-lg font-semibold">No name entered</h3>
      <p class="mb-6 text-center text-sm text-gray-600">
        You didn’t provide a name for the order. Do you want to continue anyway?
      </p>
      <div class="flex justify-center gap-4">
        <button
          class="rounded bg-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-400"
          @click="showConfirm = false"
        >
          Cancel
        </button>
        <button
          class="rounded px-4 py-2 text-sm font-medium text-white"
          :style="{ backgroundColor: theme.colors.primary }"
          @click="confirmSubmit"
        >
          Continue
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSubmitOrder } from '@/composables/useSubmitOrder';
import theme from '@/theme';

defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const customerName = ref('');
const { submitOrder } = useSubmitOrder();
const router = useRouter();

const isLoading = ref(false);
const isGcashEnabled = ref(false);

// State for confirmation modal
const showConfirm = ref(false);

function handleSubmit() {
  if (!customerName.value.trim()) {
    // Show confirmation modal if no name
    showConfirm.value = true;
  } else {
    submit();
  }
}

async function confirmSubmit() {
  showConfirm.value = false;
  await submit();
}

async function submit() {
  try {
    isLoading.value = true;

    const result = await submitOrder(customerName.value);
    if (!result?.orderKey) throw new Error('Missing order key');

    emit('close');
    router.push(`/track/${result.orderKey}`);
  } catch (error) {
    console.error('Order submission failed:', error);
  } finally {
    isLoading.value = false;
  }
}
</script>
