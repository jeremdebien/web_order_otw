<template>
  <div
    id="product-card"
    @click="handleClick"
    class="cursor-pointer rounded-xl transition-transform flex flex-col relative"
  >
    <!-- Fixed height for image -->
    <img
      :src="productItem?.display_image ? imagePrefix + productItem.display_image : fallbackImage"
      alt="Product Image"
      class="w-full h-40 lg:h-52 object-cover object-center rounded-xl"
    />
    <div v-if="productItem.item_status === 0" class="bg-black/30 absolute top-0 right-0 w-full h-40 rounded-xl"></div>

    <div v-if="productItem.item_status === 0" class="absolute top-0 right-0 rounded-tr-xl" :style="{ backgroundColor: theme.colors.primary }">
      <span  class="text-xs font-bold text-white bg-primary px-2 py-1">Sold Out</span>
    </div>

    <!-- Flexible text content -->
    <div class="p-2 flex flex-col gap-1">
      <p
        :class="[
          'text-sm font-bold text-center break-words',
          productItem.item_status === 0 ? 'text-gray-400 line-through' : 'text-black'
        ]"
      >
        {{ productItem.item_name }}
      </p>
      <p
        :class="[
          'text-xs font-medium text-center',
          productItem.item_status === 0 ? 'text-gray-400 line-through' : 'text-black'
        ]"
      >
       Price: ₱ {{ productItem.price.toFixed(2) }}
      </p>
    </div>
  </div>
</template>


<script setup lang="ts">
import type { ProductItem } from '@/models/ProductItem';
import theme from '@/theme';
const imagePrefix = import.meta.env.VITE_SUPABASE_URL + '/storage/v1/object/public/';
const fallbackImage =
  'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=';

const props = defineProps<{
  productItem: ProductItem;
}>();

const emit = defineEmits(['select'])

const handleClick = () => {
  if (props.productItem.item_status !== 0) {
    emit('select', props.productItem)
  }
}
</script>
