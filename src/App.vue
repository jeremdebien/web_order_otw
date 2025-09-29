<template>
  <!-- Sticky Search Bar (appears on scroll, only on ordering page) -->
  <!-- <div 
    v-if="isOrderingPage && shouldShowStickySearch"
    class="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-lg shadow-md border-b border-gray-200 transition-transform duration-300"

  >
    <div class="px-4 py-3">
      <div class="relative max-w-md mx-auto">
        <input
          ref="stickySearchRef"
          type="text"
          v-model="orderingUi.searchTerm"
          placeholder="Search your favorite drinks."
          class="w-full pl-2 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none font-semibold placeholder:text-gray-400"
          :style="{
            color: theme.colors.primary          }"
          @focus="lastFocusedInput = 'sticky'"
        />

        <button
          v-if="orderingUi.searchTerm"
          @click="orderingUi.setSearchTerm('')"
          class="absolute inset-y-0 right-0 px-1 flex items-center hover:bg-gray-100 rounded transition-colors"
          aria-label="Clear search"
        >
          <svg class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </div> -->

  <header 
  v-if="!isTrackingPage"
   :class="{ '-translate-y-full': isHeaderHidden, 'transition-transform duration-300': true }">
    <div id="navbar" class="grid grid-cols-3 items-start w-full px-4 py-3 pb-0  top-0">

      <div id="navlinks" class="flex items-center gap-3 justify-start text-xl" :style="{ color: theme.colors.primary }">
        <button
          class="sm:hidden flex items-center justify-center w-10 h-10 rounded-md"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          aria-label="Toggle menu"
        >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>

        </button>

        <div class="hidden sm:flex items-center gap-6 font-bold">
          <router-link to="/" :class="{ 'font-bold text-white p-2 rounded-md': isActivePath('/') }"
          :style="isActivePath('/') ? { backgroundColor: theme.colors.primary, color: theme.colors.text } : { color: theme.colors.accent }">
            Home</router-link>
          <router-link
            to="/ordering"
            :class="{ 'font-bold  p-2 rounded-md' 
            :isActivePath('/ordering') }"
            :style="isActivePath('/ordering') ? { backgroundColor: theme.colors.primary, color: theme.colors.text } : { color: theme.colors.accent }"
          >Menu</router-link>
        </div>
      </div>
      <div id="logo" class="justify-self-center">
        <img
          class="h-20"
          :src=logoUrl
          alt="Home"
        />
      </div>

      <div id="cart" class="flex items-center gap-3 justify-end text-xl" :style="{ color: theme.colors.primary }">
        <template v-if="isOrderingPage">
  <div class="flex items-center gap-2">
    <!-- Search Toggle / Input -->
    <div class="relative flex items-center flex-1">
      <div
        v-if="!orderingUi.showSearchInput"
        @click="onToggleSearch"
        class="flex cursor-pointer items-center justify-center w-10 h-10 rounded-full transition-colors"
        :style="{ backgroundColor: theme.colors.primary }"
      >
        <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      <div
        v-else
        class="flex items-center w-full sm:w-64 md:w-80"
      >
        <div class="relative w-full">
          <input
            ref="searchInputRef"
            v-model="orderingUi.searchTerm"
            placeholder="Search products..."
            class="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none text-sm placeholder:text-gray-400"
            @focus="lastFocusedInput = 'header'"
            @blur="onSearchBlur"
            @keyup.esc="closeSearch"
          />
          <button
            v-if="orderingUi.searchTerm"
            @click="orderingUi.setSearchTerm('')"
            class="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded transition-colors"
            aria-label="Clear search"
          >
            <svg class="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Cart Button -->
    <button
      class="relative flex h-10 w-10 items-center hidden lg:flex justify-center rounded-full transition-colors"
      :style="{ backgroundColor: theme.colors.primary }"
      @click="orderingUi.openCart()"
      aria-label="Open cart"
    >
      <i class="pi pi-shopping-cart text-white"></i>
      <span
        v-if="cartStore.count > 0"
        class="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white"
      >
        {{ cartStore.count }}
      </span>
    </button>
  </div>
</template>

      </div>
    </div>
    <div v-if="isMobileMenuOpen" class="sm:hidden fixed inset-0 z-[60]" @click="closeMobileMenu">
      <div class="absolute inset-0 bg-black/40"></div>
      <div class="relative bg-white w-full max-h-full overflow-auto" @click.stop>
        <nav class="flex flex-col p-4 gap-2" :style="{ color: theme.colors.primary }">
          <router-link
            to="/"
            @click="closeMobileMenu"
            class="px-3 py-2 rounded-md"
            :class="{ 'font-bold text-white': isActivePath('/') }"
            :style="isActivePath('/') ? { backgroundColor: theme.colors.primary } : null"
          >Home</router-link>
          <router-link
            to="/ordering"
            @click="closeMobileMenu"
            class="px-3 py-2 rounded-md"
            :class="{ 'font-bold text-white': isActivePath('/ordering') }"
            :style="isActivePath('/ordering') ? { backgroundColor: theme.colors.primary } : null"
          >Menu</router-link>
        </nav>
      </div>
    </div>
  </header>

  <main :class="{ '': !isTrackingPage }">
    <router-view />
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useOrderingUiStore } from '@/stores/orderingUi'
import theme from '@/theme'

const logoUrl = `${theme.logo}`;
const isTrackingPage = computed(() => route.path.startsWith('/track/'))

const route = useRoute()
const isOrderingPage = computed(() => route.name === 'Ordering')
const cartStore = useCartStore()
const orderingUi = useOrderingUiStore()

// Component refs
const searchInputRef = ref<HTMLInputElement | null>(null)
const stickySearchRef = ref<HTMLInputElement | null>(null)

// UI state
const isMobileMenuOpen = ref(false)
const isHeaderHidden = ref(false)
const shouldShowStickySearch = ref(false)
const lastFocusedInput = ref<'header' | 'sticky' | null>(null)

// Scroll state
const lastScrollY = ref(0)
const SCROLL_THRESHOLD = 100
const JITTER_THRESHOLD = 4
const HEADER_HIDE_THRESHOLD = 64

function isActivePath(path: string) {
  return route.path === path
}

// Search management functions
async function onToggleSearch() {
  orderingUi.toggleSearchInput(true)
  await nextTick()
  searchInputRef.value?.focus()
}

function closeSearch() {
  orderingUi.toggleSearchInput(false)
  orderingUi.setSearchTerm('')
}

function onSearchBlur() {
  if (!orderingUi.searchTerm.trim()) {
    orderingUi.toggleSearchInput(false)
  }
}

// Consolidated focus switching function
function switchSearchFocus(targetInput: 'header' | 'sticky') {
  const targetRef = targetInput === 'header' ? searchInputRef : stickySearchRef
  
  if (targetInput === 'header') {
    orderingUi.toggleSearchInput(true)
  }
  
  nextTick(() => {
    if (targetRef.value) {
      targetRef.value.focus()
      const length = targetRef.value.value.length
      targetRef.value.setSelectionRange(length, length)
    }
  })
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function handleScroll() {
  const currentY = window.scrollY || 0
  
  // Keep header visible when mobile menu is open
  if (isMobileMenuOpen.value) {
    isHeaderHidden.value = false
    lastScrollY.value = currentY
    return
  }

  const delta = currentY - lastScrollY.value
  const hasSearchTerm = orderingUi.searchTerm.trim().length > 0

  // Handle sticky search on ordering page
  if (isOrderingPage.value) {
    const wasShowingSticky = shouldShowStickySearch.value
    const shouldShowSticky = currentY > SCROLL_THRESHOLD
    
    // Handle seamless focus switching
    if (wasShowingSticky !== shouldShowSticky && hasSearchTerm) {
      if (shouldShowSticky && lastFocusedInput.value === 'header') {
        switchSearchFocus('sticky')
      } else if (!shouldShowSticky && lastFocusedInput.value === 'sticky') {
        switchSearchFocus('header')
      }
    }
    
    shouldShowStickySearch.value = shouldShowSticky
  }

  // Header hide/show logic with jitter reduction
  if (Math.abs(delta) > JITTER_THRESHOLD) {
    isHeaderHidden.value = currentY > lastScrollY.value && currentY > HEADER_HIDE_THRESHOLD
    lastScrollY.value = currentY
  }

  // Reset state at top of page
  if (currentY <= 0) {
    isHeaderHidden.value = false
    shouldShowStickySearch.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  lastScrollY.value = window.scrollY || 0
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Watchers
watch(() => route.path, () => isMobileMenuOpen.value = false)

watch(isMobileMenuOpen, (isOpen) => {
  if (isOpen) isHeaderHidden.value = false
})

watch(() => orderingUi.searchTerm, (newTerm) => {
  // Auto-expand header search when there's a search term but input is collapsed
  if (isOrderingPage.value && newTerm.trim() && !orderingUi.showSearchInput) {
    orderingUi.toggleSearchInput(true)
  }
})

</script>
