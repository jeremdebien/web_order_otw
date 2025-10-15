<template>
  <div id="body" class="flex w-full flex-col items-center justify-center overflow-hidden">
    <h1 id="welcome" class=" h1-hidden text-3xl"
    :style="{ fontFamily: theme.fonts.heading }"
    :class="{ 'fade-in': h1Visible }">Welcome to {{ brand }}</h1>
    <h2 class="h2-hidden text-center text-5xl font-bold sm:text-5xl md:text-7xl"
      :style="{ fontFamily: theme.fonts.base }"
      :class="{ 'fade-in': h2Visible }"
    >
      {{ theme.slogan }}
    </h2>
    <div id="content" class="h-[62vh] w-full px-10 pt-5" :class="contentVisible ? 'pop-in' : 'hidden-before'">
      <div class="h-[60vh] w-full bg-[#ddf1fe] p-2">
        <div
          class="flex h-full w-full items-end justify-center bg-cover bg-center pb-20"
          :style="{ backgroundImage: `url(${bgUrl})` }"
        >
          <router-link
            to="/ordering"
            id="get-you-coffee"
            class="rounded-md bg-[#ddf1fe] px-14 py-2 text-xl font-bold text-black sm:text-2xl"
            >Order Here</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { supabase } from '@/lib/supabase';
import theme from '@/theme';

const data = ref<any[]>([]);
const isMobile = computed(() => window.innerWidth <= 768);

const h1Visible = ref(false);
const h2Visible = ref(false);
const contentVisible = ref(false);
const brand = ref(theme.brand);
const bgUrl = `${theme.bg_image}`;


onMounted(() => {
  const handleResize = () => {
    if (isMobile.value !== window.innerWidth <= 768) {
      location.reload();
    }
  };
  window.addEventListener('resize', handleResize);
  // Start staged animations
  h1Visible.value = true;
  const fadeDurationMs = 800;
  setTimeout(() => {
    h2Visible.value = true;
    setTimeout(() => {
      contentVisible.value = true;
    }, fadeDurationMs + 100);
  }, fadeDurationMs + 100);
  // Clean up the event listener on unmount
  return () => {
    window.removeEventListener('resize', handleResize);
  };
});

onMounted(async () => {
  const branchId = Number(import.meta.env.VITE_BRANCH_ID);
  const { data: result, error } = await supabase.from('items').select('*').eq('branch_id', branchId);
  if (error) {
    console.error(error);
  } else {
    data.value = result || [];
  }
});
</script>

<style scoped>
.h1-hidden {
  opacity: 0;
}
.h2-hidden {
  opacity: 0;
}
.fade-in {
  animation: fadeIn 0.8s ease forwards;
}

.hidden-before {
  opacity: 0;
}
.pop-in {
  animation: popIn 0.5s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
