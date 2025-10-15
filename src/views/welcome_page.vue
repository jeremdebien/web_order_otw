<template>
    <div id="body" class="flex flex-col items-center justify-center w-full">
    <h1 class="text-2xl m-0 p-0">Welcome to Mamonaku</h1>
    <h1 class="text-3xl font-bold m-0 p-0">{{ theme.slogan }}</h1>
    <div class="w-full h-[80vh] px-10 pt-5">
      <div class="w-full bg-[#ddf1fe] h-[70vh] p-5">
      <div class="w-full h-full bg-cover bg-center flex items-end justify-center pb-10"
      :style="{ backgroundImage: `url('https://llsxflpmyrpwcintfcfd.supabase.co/storage/v1/object/public/web-ordering/images/mamonaku_bg.jpg')` }">
      <router-link to="/ordering" class="bg-[#ddf1fe] text-black font-bold text-3xl px-14 py-2 rounded-md">Get you coffee</router-link>
    </div>
    </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import theme from '@/theme';
</script>