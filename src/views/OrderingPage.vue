<template>
  <div class="flex w-full flex-col items-center justify-center ">
    <!-- <span id="PickUp" class="block text-xl font-bold sm:text-5xl">Pick Up</span>
    <p id="pickup-desc" class="text-xl font-extralight text-black text-gray-600 sm:text-2xl md:text-2xl lg:text-3xl">
      Pick up in store without waiting in line.
    </p> -->
    <!-- Categories + Products -->
  <div class="flex w-full gap-4 px-2">
    <div class="w-1/5 border-r border-gray-200 pr-2 sm:pr-4 sticky top-16" style="height: fit-content;">
      <CategoryCard :selectedCategoryId="activeCategoryId" @categorySelected="onCategoryClick" />
    </div>

    <div class="w-4/5 flex-1" :class="{ 'scrolled-down': isScrolledDown }">
      <!-- Search Results View (No Categories) -->
      <div v-if="isSearching" class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <div v-if="loading" class="col-span-full text-center text-gray-500">Loading...</div>
        <div v-else-if="filteredItems.length === 0" class="col-span-full text-center text-gray-500">
          No products found for "{{ orderingUi.searchTerm }}".
        </div>
        <div
          v-else
          v-for="(item, idx) in filteredItems"
          :key="item.id"
          class="product-card"
          :style="{ '--stagger-index': idx }"
        >
          <ProductCard
            :productItem="item"
            @select="openProductModal"
          />
        </div>
      </div>

      <!-- Category View (Default) -->
      <div v-else class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <div v-if="loading" class="col-span-full text-center text-gray-500">Loading...</div>
        <div v-else-if="filteredItems.length === 0" class="col-span-full text-center text-gray-500">
          No products found.
        </div>

        <div
          v-for="cat in categories"
          :key="cat.category_id"
          class="col-span-full "
          :id="`section-${cat.category_id}`"
          :data-category-id="cat.category_id"
        >
          <!-- Enhanced Category Header -->
          <div class="mb-0  first:">
            <div class="flex items-center gap-3">
              <h2 id="category-name" class="text-base font-thin px-4 py-2 text-black relative flex items-center gap-2 rounded-md">
                {{ cat.category_name }}
              </h2>
              <div class="flex-1 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
            </div>
            <div v-if="cat.category_desc" class="text-center text-gray-600 text-sm">
              {{ cat.category_desc }}
            </div>
          </div>

          <!-- Products for this category -->
          <div
            class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            :class="[
              animateCategoryId === cat.category_id ? 'animate-products' : '',
              animateCategoryId === cat.category_id
                ? (animateDirection === 'up' ? 'direction-up' : 'direction-down')
                : ''
            ]"
          >
            <div
            v-for="(item, idx) in getItemsByCategory(cat.category_id).slice().sort((a, b) => a.item_name.localeCompare(b.item_name))"
              :key="item.id"
              class="product-card"
              :style="{ '--stagger-index': idx }"
            >
              <ProductCard
                :productItem="item"
                @select="openProductModal"
              />
            </div>
            <div
              v-if="getItemsByCategory(cat.category_id).length === 0"
              class="col-span-full text-center py-8"
            >
              <div class="text-gray-400 text-sm">
                <svg class="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 21l-3-3 3-3"></path>
                </svg>
                <p class="italic">No products in this category</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


    <!-- Product Modal -->
    <Teleport to="body" class="overflow-hidden">
      <Transition name="fade" appear @after-leave="afterLeave">
        <div
          v-if="showModal"
          role="dialog"
          aria-modal="true"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          @click.self="closeModal"
        >
          <div class="relative max-h-[90vh] w-[95%] max-w-lg overflow-hidden rounded-xl bg-white p-6 shadow-2xl">
            <div class="absolute top-0 right-0 z-10">
              <Button icon="pi pi-times" rounded text severity="secondary" @click="closeModal" />
            </div>

            <div class="mb-4">
              <img
                class="aspect-[3/2] h-full w-full rounded-lg object-cover"
                :src="selectedProduct?.display_image ? imagePrefix + selectedProduct.display_image : fallbackImage"
                :alt="selectedProduct?.item_name"
              />
            </div>

            <div class="space-y-2 flex flex-row items-center justify-between">
              <h2 id="product-name" class="text-3xl font-light text-gray-900">{{ selectedProduct?.item_name }}</h2>
              <!-- <p class="text-gray-500">{{ selectedProduct?.item_desc }}</p> -->
              <p id="product-price" class="text-primary text-2xl font-bold">
                ₱{{ selectedProduct?.price ? selectedProduct.price.toFixed(2) : '0.00' }}
              </p>
            </div>
            <div>
              <InputNumberWithStep @update="selectedProductQuantity = $event" />
            </div>

            <div class="my-2">
              <div class="mb-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-gray-800">Note to restaurant</h3>
                  <div class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">Optional</div>
                </div>
                <Textarea
                  class="mt-2 w-full rounded-md border border-gray-300"
                  v-model="noteToRestaurant"
                  autoResize
                  rows="2"
                />
              </div>

              <div>
                <div class="flex items-center justify-between gap-2">
                  <div v-if="selectedProduct?.price != null" class="text-lg font-bold bg-blue-600 text-white rounded-lg px-4 py-2">
                    ₱{{ (selectedProduct.price * selectedProductQuantity).toFixed(2) }}

                  </div>
                  <button
                    class="w-3/4 rounded-lg bg-green-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl sm:text-lg"
                    @click="addToCart"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Mobile Cart -->
    <BottomCartDrawer />

    <!-- Cart Modal -->
    <CartModal :visible="orderingUi.showCartModal" @close="orderingUi.closeCart()" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { supabase } from '@/lib/supabase';
import type { ProductItem } from '@/models/ProductItem';
import type { ProductOrder } from '@/models/ProductOrder';
import type { Category } from '@/models/Category';
import { useCartStore } from '@/stores/cart';
import { useOrderingUiStore } from '@/stores/orderingUi';

import BottomCartDrawer from '@/components/BottomCartDrawer.vue';
import ProductCard from '@/components/ProductCard.vue';
import InputNumberWithStep from '@/components/form/InputNumberWithStep.vue';
import CartModal from '@/components/CartModal.vue';
import CategoryCard from '@/components/form/CategoryCard.vue';

// Stores
const cartStore = useCartStore();
const orderingUi = useOrderingUiStore();

// Constants
const BRANCH_ID = Number(import.meta.env.VITE_BRANCH_ID);
const SCROLL_THRESHOLD = 100;
const HEADER_OFFSET = 96;
const ANIMATION_DURATION = 800;

// Data state
const categories = ref<Category[]>([]);
const items = ref<ProductItem[]>([]);
const loading = ref(true);
const categoriesLoading = ref(true);
const errorMessage = ref('');

// UI state
const showModal = ref(false);
const selectedProduct = ref<ProductItem | null>(null);
const selectedProductQuantity = ref(1);
const noteToRestaurant = ref('');

// Scroll and animation state
const activeCategoryId = ref<number | null>(null);
const animateCategoryId = ref<number | null>(null);
const animateDirection = ref<'up' | 'down'>('down');
const showStickySearch = ref(false);
const isScrolledDown = ref(false);
// Precise scroll sync state
const sectionPositions = ref<Array<{ id: number; top: number }>>([]);
const isAutoScrolling = ref(false);
let scrollCheckRaf: number | null = null;
const SCROLL_OFFSET = HEADER_OFFSET + -20;

// Image URLs
const imagePrefix = import.meta.env.VITE_SUPABASE_URL + '/storage/v1/object/public/';
const fallbackImage = 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=';


// Data fetching functions
async function fetchCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, category_name, category_id')
      .eq('branch_id', BRANCH_ID);

    if (error) throw error;
    categories.value = data as Category[];
  } catch (error) {
    console.error('Error fetching categories:', error);
    errorMessage.value = error instanceof Error ? error.message : 'Failed to fetch categories';
  } finally {
    categoriesLoading.value = false;
  }
}

async function fetchItems() {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('branch_id', BRANCH_ID)
      .order('barcode');

    if (error) throw error;
    items.value = data as ProductItem[];
  } catch (error) {
    console.error('Error fetching items:', error);
    errorMessage.value = error instanceof Error ? error.message : 'Failed to fetch products';
  } finally {
    loading.value = false;
  }
}

// Modal management functions
function openProductModal(item: ProductItem) {
  selectedProduct.value = item;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  selectedProductQuantity.value = 1;
  noteToRestaurant.value = '';
}

function afterLeave() {
  selectedProduct.value = null;
}

function addToCart() {
  if (!selectedProduct.value) return;

  const newOrder: ProductOrder = {
    barcode: selectedProduct.value.barcode,
    item_name: selectedProduct.value.item_name,
    print_desc: selectedProduct.value.print_desc,
    price: selectedProduct.value.price,
    quantity: selectedProductQuantity.value,
    modifier: [],
    assigned_printer: selectedProduct.value.assigned_printer,
    note: noteToRestaurant.value.trim(),
    is_disc_exempt: selectedProduct.value.is_disc_exempt,
    is_non_vat: selectedProduct.value.is_non_vat,
    display_image: selectedProduct.value.display_image,
  };

  cartStore.addToCart(newOrder);
  closeModal();
}

// Navigation and animation functions
function onCategoryClick(category: { id: number }) {
  const target = document.getElementById(`section-${category.id}`);
  if (!target) return;

  // Determine animation direction
  const currentIndex = categories.value.findIndex((c) => c.category_id === activeCategoryId.value);
  const nextIndex = categories.value.findIndex((c) => c.category_id === category.id);
  animateDirection.value = nextIndex < currentIndex ? 'up' : 'down';

  // Smooth scroll to target
  const rect = target.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const absoluteTop = rect.top + scrollTop;
  const targetY = Math.max(0, absoluteTop - SCROLL_OFFSET);

  // Guard programmatic scroll
  isAutoScrolling.value = true;
  window.scrollTo({ top: targetY, behavior: 'smooth' });
  // Mark active immediately for better UX
  activeCategoryId.value = category.id;
  triggerCategoryAnimation(category.id);

  // End guard when scrolling settles
  settleAfterScroll(targetY);
}

function triggerCategoryAnimation(categoryId: number) {
  animateCategoryId.value = null;
  nextTick(() => {
    animateCategoryId.value = categoryId;
    setTimeout(() => {
      if (animateCategoryId.value === categoryId) {
        animateCategoryId.value = null;
      }
    }, ANIMATION_DURATION);
  });
}


// Computed properties
const searchTerm = computed(() => orderingUi.searchTerm.toLowerCase());

const filteredItems = computed(() => {
  if (!searchTerm.value) return items.value;
  return items.value.filter((item) => 
    item.item_name.toLowerCase().includes(searchTerm.value)
  );
});

const isSearching = computed(() => orderingUi.searchTerm.trim().length > 0);

const itemsByCategory = computed(() => {
  const categoryMap = new Map<number, ProductItem[]>();
  
  items.value.forEach((item) => {
    if (!searchTerm.value || item.item_name.toLowerCase().includes(searchTerm.value)) {
      const categoryId = item.category_id;
      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, []);
      }
      categoryMap.get(categoryId)!.push(item);
    }
  });
  
  return categoryMap;
});

// Helper function for template
function getItemsByCategory(categoryId: number): ProductItem[] {
  return itemsByCategory.value.get(categoryId) || [];
}

// Scroll and position functions

function recomputeSectionPositions() {
  const sections = Array.from(document.querySelectorAll('[data-category-id]')) as HTMLElement[];
  const positions = sections
    .map((el) => {
      const idAttr = el.getAttribute('data-category-id');
      if (!idAttr) return null;
      const rect = el.getBoundingClientRect();
      const top = (window.pageYOffset || document.documentElement.scrollTop) + rect.top;
      return { id: Number(idAttr), top };
    })
    .filter((v): v is { id: number; top: number } => v !== null)
    .sort((a, b) => a.top - b.top);
  sectionPositions.value = positions;
}

function updateActiveCategoryFromScroll() {
  if (sectionPositions.value.length === 0) return;
  const y = (window.scrollY || 0) + SCROLL_OFFSET + 1;
  // Find the last section whose top <= y
  let chosenId = sectionPositions.value[0].id;
  for (let i = 0; i < sectionPositions.value.length; i++) {
    if (sectionPositions.value[i].top <= y) {
      chosenId = sectionPositions.value[i].id;
    } else {
      break;
    }
  }
  if (activeCategoryId.value !== chosenId) {
    // Determine direction for animation
    const currentIndex = categories.value.findIndex((c) => c.category_id === activeCategoryId.value);
    const nextIndex = categories.value.findIndex((c) => c.category_id === chosenId);
    animateDirection.value = nextIndex < currentIndex ? 'up' : 'down';
    activeCategoryId.value = chosenId;
  }
}

function settleAfterScroll(targetY: number) {
  if (scrollCheckRaf) {
    cancelAnimationFrame(scrollCheckRaf);
    scrollCheckRaf = null;
  }
  const start = performance.now();
  const maxDurationMs = 1200;
  const tolerance = 2;
  const check = () => {
    const now = performance.now();
    const doneByTime = now - start > maxDurationMs;
    const nearTarget = Math.abs((window.scrollY || 0) - targetY) <= tolerance;
    if (nearTarget || doneByTime) {
      isAutoScrolling.value = false;
      // Ensure positions are consistent after scroll
      recomputeSectionPositions();
      updateActiveCategoryFromScroll();
      return;
    }
    scrollCheckRaf = requestAnimationFrame(check);
  };
  scrollCheckRaf = requestAnimationFrame(check);
}

function onWindowScroll() {
  if (isAutoScrolling.value || isSearching.value) {
    showStickySearch.value = window.scrollY > SCROLL_THRESHOLD;
    isScrolledDown.value = (window.scrollY || 0) > 0;
    return;
  }
  updateActiveCategoryFromScroll();
  showStickySearch.value = window.scrollY > SCROLL_THRESHOLD;
  isScrolledDown.value = (window.scrollY || 0) > 0;
}

function onWindowResize() {
  recomputeSectionPositions();
}

// Initialize data and setup
async function initializeData() {
  await Promise.all([fetchCategories(), fetchItems()]);
  await nextTick();
  recomputeSectionPositions();
  window.addEventListener('scroll', onWindowScroll, { passive: true });
  window.addEventListener('resize', onWindowResize);
  // Recompute again shortly after to account for late-loading images
  setTimeout(recomputeSectionPositions, 300);
  setTimeout(recomputeSectionPositions, 1000);
}

// Lifecycle hooks
onMounted(initializeData);

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onWindowScroll);
  window.removeEventListener('resize', onWindowResize);
});

// Watchers
watch(
  () => categories.value.length,
  async (newLength) => {
    if (newLength > 0) {
      await nextTick();
      recomputeSectionPositions();
      updateActiveCategoryFromScroll();
    }
  }
);

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

/* Slide-in animation for products when a category is selected */
.product-card {
  opacity: 1;
  transform: translateX(0);
}

.animate-products.direction-down .product-card {
  opacity: 0;
  transform: translateY(12px);
  animation: slideInDown 420ms ease-out forwards;
  animation-delay: calc(var(--stagger-index, 0) * 30ms);
}

.animate-products.direction-up .product-card {
  opacity: 0;
  transform: translateY(-12px);
  animation: slideInUp 420ms ease-out forwards;
  animation-delay: calc(var(--stagger-index, 0) * 30ms);
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Slight downward offset when the page is scrolled */
.scrolled-down {
  transform: translateY(8px);
  transition: transform 180ms ease;
}


</style>
