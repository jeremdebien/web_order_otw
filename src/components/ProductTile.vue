<template>
  <div class="flex items-center gap-3 rounded">
    <!-- Image -->
    <img
      :src="product.display_image ? imagePrefix + product.display_image : defaultImage"
      alt="Product Image"
      class="h-24 w-24 rounded-2xl object-cover"
    />

    <!-- Details -->
    <div class="flex-1">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-md font-semibold">{{ product.item_name }}</div>
          <div class="text-md text-gray-500">Price: ₱{{ product.price.toFixed(2) }}</div>
        </div>
        <!-- Trash Icon with @click -->
        <span
          class="pi pi-trash cursor-pointer text-red-500 hover:text-red-700"
          style="font-size: 24px"
          @click="$emit('remove')"
        />
      </div>

      <div v-if="product.note" class="text-md mt-1 text-gray-400 italic">“{{ product.note }}”</div>

      <div class="flex items-center justify-between">
        <InputNumberWithStep v-model="product.quantity" @update="" size="sm" />
        <div class="text-lg font-medium text-gray-700">₱{{ (product.price * product.quantity).toFixed(2) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputNumberWithStep from '@/components/form/InputNumberWithStep.vue';
import type { ProductOrder } from '@/models/ProductOrder';
defineProps<{
  product: ProductOrder;
}>();
const imagePrefix = import.meta.env.VITE_SUPABASE_URL + '/storage/v1/object/public/';
const emit = defineEmits(['remove']);

const defaultImage =
  'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=';
</script>
