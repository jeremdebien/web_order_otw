import { useCartStore } from '@/stores/cart';
import { useDeviceId } from '@/composables/useDeviceId';

export function useSubmitOrder() {
  const cartStore = useCartStore();
  const { deviceId } = useDeviceId(); // ✅ get it from composable

  async function submitOrder(customerName: string) {
    if (cartStore.items.length === 0) return;

    const branchId = Number(import.meta.env.VITE_BRANCH_ID);

    const payload = {
      order_type_id: 1,
      order_status: 0,
      branch_id: branchId,
      customer_name: customerName,
      // payment_type: paymentType,
      items: cartStore.items.map((item) => ({
        item_barcode: item.barcode,
        quantity: item.quantity,
        item_price: item.price,
        ...(item.note?.trim() && { item_modifiers: item.note.trim() }),
      })),
    };

    console.log('Submitting order with payload:', payload);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-self-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-device-id': deviceId.value || '', // ✅ attach from composable
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Order submission failed:', errorData);
        throw new Error(errorData.message || 'Failed to submit order');
      }

      const result = await response.json();
      console.log('Order submitted successfully:', result);

      cartStore.clearCart();

      return {
        orderKey: result?.order?.order_key,
      };
    } catch (err) {
      console.error('Submit order error:', err);
      throw err;
    }
  }

  return { submitOrder };
}
