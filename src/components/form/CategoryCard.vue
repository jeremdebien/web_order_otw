<template>
  <div class="w-full sticky top-0 z-10 py-2 pb-0">
    <!-- Sticky container -->
    <div class="">
      <div class="flex items-center justify-between"></div>

      <div class="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 border-b border-gray-200 pb-6">
        <!-- Loading -->
        <div v-if="loading" class="col-span-full text-center text-gray-500">
          Loading...
        </div>

        <!-- Error -->
        <div v-else-if="errorMessage" class="col-span-full text-center text-red-500">
          {{ errorMessage }}
        </div>

        <!-- No Data -->
        <div v-else-if="categories.length === 0" class="col-span-full text-center text-gray-500">
          No categories found.
        </div>

        <!-- Category Buttons -->
        <div
          v-for="cat in categories"
          :key="cat.category_id"
          class="col-span-full text-center"
          :id="cat.category_name"
        >
        <button
          class="text-xs sm:text-sm md:text-base lg:text-lg"
          :class="props.selectedCategoryId === cat.category_id
            ? 'w-full text-white py-2 rounded-md'
            : 'text-black font-extralight'"
          :style="props.selectedCategoryId === cat.category_id
            ? { backgroundColor: theme.colors.primary, fontFamily: theme.fonts.heading }
            : { fontFamily: theme.fonts.heading }"
          :aria-pressed="props.selectedCategoryId === cat.category_id"
          @click="$emit('categorySelected', { id: cat.category_id })"
        >
          {{ cat.category_name }}
        </button>

        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/models/Category';
import theme from '@/theme';

const categories = ref<Category[]>([]);
const loading = ref(true);
const errorMessage = ref('');

const props = withDefaults(defineProps<{ selectedCategoryId?: number | null }>(), {
  selectedCategoryId: null,
});

  onMounted(async () => {
    try {
      const branchId = Number(import.meta.env.VITE_BRANCH_ID);
      const { data, error } = await supabase
        .from('categories')
        .select('id, category_name, category_id')
        .eq('branch_id', branchId);

      if (error) {
        console.error('Supabase error:', error);
        errorMessage.value = error.message;
      } else if (data) {
        categories.value = data as Category[];
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      errorMessage.value = 'Something went wrong while fetching categories';
    } finally {
      loading.value = false;
    }
  }
);
</script>
