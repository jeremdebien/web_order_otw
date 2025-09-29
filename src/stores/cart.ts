// stores/cart.ts
import { defineStore } from 'pinia'
import type { ProductOrder } from '@/models/ProductOrder'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as ProductOrder[],
  }),

  actions: {
    addToCart(newOrder: ProductOrder) {
      const existing = this.items.find(
        (item) =>
          item.barcode === newOrder.barcode &&
          item.note === newOrder.note &&
          JSON.stringify(item.modifier) === JSON.stringify(newOrder.modifier)
      )

      if (existing) {
        existing.quantity += newOrder.quantity
      } else {
        this.items.push({ ...newOrder })
      }
    },

    removeItem(index: number) {
      this.items.splice(index, 1)
    },

    clearCart() {
      this.items = []
    },
  },

  getters: {
    total: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    count: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),
  },
})
