// src/composables/useDeviceId.ts
import { ref } from 'vue';

const deviceId = ref<string | null>(null);

export function useDeviceId() {
  if (!deviceId.value) {
    deviceId.value = localStorage.getItem('device_id');
    if (!deviceId.value) {
      deviceId.value = crypto.randomUUID();
      localStorage.setItem('device_id', deviceId.value);
    }
  }

  return { deviceId };
}
