import { defineStore } from 'pinia'

export const useOrderingUiStore = defineStore('orderingUi', {
  state: () => ({
    searchTerm: '' as string,
    showSearchInput: false as boolean,
    showCartModal: false as boolean,
  }),
  actions: {
    setSearchTerm(term: string) {
      this.searchTerm = term
    },
    openCart() {
      this.showCartModal = true
    },
    closeCart() {
      this.showCartModal = false
    },
    toggleSearchInput(show?: boolean) {
      if (typeof show === 'boolean') {
        this.showSearchInput = show
      } else {
        this.showSearchInput = !this.showSearchInput
      }
    },
  },
})


