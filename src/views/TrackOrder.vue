<template>
  <div class="mx-1 flex h-screen items-center justify-center p-4">
    <div
      class="flex h-screen w-full flex-col items-center justify-center rounded-xl p-6 text-center text-white md:max-w-[600px] md:p-10
      bg-cover bg-center"
      :style="{ backgroundImage: `url(${theme.track_bg})` }"    >
    <img :src="logoTrackUrl" class="h-20 w-20" />
    <h1 class="mb-2 text-2xl font-bold md:text-xl bg-white px-4 rounded-xl" :class="{
      'text-red-600':  OrderStatusLabels[order?.order_status as OrderStatus] === OrderStatusLabels[OrderStatus.Pending]
       || OrderStatusLabels[order?.order_status as OrderStatus] === OrderStatusLabels[OrderStatus.Preparing]
       || OrderStatusLabels[order?.order_status as OrderStatus] === OrderStatusLabels[OrderStatus.Cancelled],
      'text-green-600': OrderStatusLabels[order?.order_status as OrderStatus] === OrderStatusLabels[OrderStatus.Ready],
      'text-blue-600': OrderStatusLabels[order?.order_status as OrderStatus] === OrderStatusLabels[OrderStatus.Completed]
    }">
        {{ OrderStatusLabels[order?.order_status as OrderStatus] }}
      </h1>

      <p v-if="order" class="mb-4 text-base whitespace-pre-line text-gray-200 bg-black/60 p-2 rounded-xl">
        {{ getOrderMessage(order.order_status) }}
      </p>

      <div v-if="loading" class="text-gray-300">Loading...</div>
      <div v-else-if="error" class="text-red-400">{{ error }}</div>

      <div v-else class="flex h-full flex-col space-y-2">
        <div class="rounded-3xl p-2">
          <img :src="qrCodeDataUrl" alt="QR Code" class="mx-auto w-[50vw] md:w-70 rounded-3xl p-2"
          :style="{ backgroundColor: theme.colors.tertiary }"
          />
        </div>
        <div class="p-0 font-bold" :style="{ color: theme.colors.secondaryText }">
          <p ba>{{ order?.order_key }}</p>
        </div>

        <h2 class="text-lg font-semibold" :style="{ color: theme.colors.secondaryText }">Items</h2>
        <div class="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent flex-1 overflow-y-auto pr-1">
          <ul class="grid h-40 grid-cols-1 gap-2 text-left sm:grid-cols-2">
            <li v-for="(item, idx) in items" :key="idx" class="flex h-18 w-full rounded-xl border bg-black/90 px-2">
              <div class="flex items-center space-x-4">
                <img
                  class="h-12 w-12 rounded"
                  :src="item.items?.display_image ? imagePrefix + item.items.display_image : fallbackImage"
                  :alt="item.items.item_name"
                />
                <div>
                  <div class="font-medium">{{ `${item.quantity}x ${item.items.item_name}` }}</div>
                  <div v-if="item.item_modifiers" class="text-sm text-gray-300 italic">
                    Note: {{ item.item_modifiers }}
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '@/lib/supabase';
import { OrderStatus, OrderStatusLabels, getOrderMessage } from '@/enums/OrderStatus';
import QRCode from 'qrcode';
import theme from '@/theme';

const route = useRoute();
const orderKey = route.params.orderKey as string;
const logoTrackUrl = `${theme.logo_track}`;

const imagePrefix = import.meta.env.VITE_SUPABASE_URL + '/storage/v1/object/public/';

const loading = ref(true);
const error = ref('');
const order = ref<any>(null);
const items = ref<any[]>([]);
const qrCodeDataUrl = ref('');

const fallbackImage =
  'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=';

import { useDeviceId } from '@/composables/useDeviceId'; // <-- import

const { deviceId } = useDeviceId(); // <-- use deviceId

async function fetchOrder() {
  loading.value = true;
  error.value = '';

  if (!deviceId.value) {
    error.value = 'No device ID found.';
    loading.value = false;
    return;
  }

  const { data, error: orderError } = await supabase
    .from('self_orders')
    .select('id, order_key, order_status')
    .eq('order_key', orderKey)
    .eq('device_id', deviceId.value)
    .single();

  if (orderError || !data) {
    error.value = 'Order not found or unauthorized.';
    loading.value = false;
    return;
  }

  order.value = data;

  const { data: itemList, error: itemsError } = await supabase
    .from('self_order_items')
    .select(
      `
      item_barcode,
      quantity,
      item_price,
      item_modifiers,
      items (
        item_name,
        item_desc,
        display_image
      )
    `
    )
    .eq('self_order_id', data.id);

  if (itemsError) {
    error.value = 'Failed to load order items.';
  } else {
    items.value = itemList || [];
  }

  qrCodeDataUrl.value = await QRCode.toDataURL(orderKey);

  loading.value = false;
}

let channel: any = null;
let pollingIntervalId: number | undefined;

function setupRealtime() {
  if (!order.value) return;

  channel = supabase
    .channel(`order-tracking:${orderKey}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'self_orders',
        filter: `order_key=eq.${orderKey}`,
      },
      (payload) => {
        const updated = payload.new as any;
        if (deviceId.value && updated?.device_id && updated.device_id !== deviceId.value) return;
        if (!order.value) return;
        order.value = { ...order.value, ...updated };
      }
    )
    .subscribe();
}

function setupPolling() {
  pollingIntervalId = window.setInterval(async () => {
    try {
      if (!deviceId.value) return;
      const { data } = await supabase
        .from('self_orders')
        .select('id, order_key, order_status')
        .eq('order_key', orderKey)
        .eq('device_id', deviceId.value)
        .single();

      if (data && order.value?.order_status !== data.order_status) {
        order.value = data;
      }
    } catch (e) {
      // ignore transient errors
    }
  },2000);
}

onMounted(async () => {
  await fetchOrder();
  setupRealtime();
  setupPolling();
});

onUnmounted(() => {
  if (channel) {
    supabase.removeChannel(channel);
    channel = null;
  }
  if (pollingIntervalId) {
    clearInterval(pollingIntervalId);
    pollingIntervalId = undefined;
  }
});
</script>

<style scoped>
/* Make scrollbar track transparent */
::-webkit-scrollbar-track {
  background: transparent;
}

/* Optional: customize the scrollbar itself */
::-webkit-scrollbar {
  width: 4px; /* or height for horizontal */
}

::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3); /* example thumb */
  border-radius: 4px;
}
</style>
