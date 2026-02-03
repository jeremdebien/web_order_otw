<template>
  <div v-if="groups.length > 0" class="customization-selector flex flex-col gap-6 mt-4 border-t pt-4">
    <div v-for="group in groups" :key="group.name" class="customization-group">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-semibold text-gray-800">{{ group.name }}</h3>
        <span class="text-sm text-gray-500">
          ({{ getSelectedCount(group.name) }} / {{ group.max === group.min ? group.min : `${group.min}-${group.max}` }})
        </span>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          v-for="option in group.options"
          :key="option.barcode"
          @click="toggleOption(group, option)"
          :class="[
            'flex items-center justify-between p-3 rounded-lg border transition-all duration-200 text-left',
            isSelected(group.name, option.barcode)
              ? 'border-green-500 bg-green-50 ring-1 ring-green-500'
              : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
          ]"
        >
          <div class="flex items-center gap-2">
            <div 
              class="w-5 h-5 rounded-full border flex items-center justify-center transition-colors"
              :class="isSelected(group.name, option.barcode) ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'"
            >
              <i v-if="isSelected(group.name, option.barcode)" class="pi pi-check text-[10px] text-white"></i>
            </div>
            <span class="font-medium text-gray-700">{{ option.label }}</span>
          </div>
          <span v-if="option.price > 0" class="text-sm font-semibold text-green-600">
            +₱{{ option.price.toFixed(2) }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CustomizationGroup, CustomizationOption } from '@/data/productCustomizations';

const props = defineProps<{
  groups: CustomizationGroup[];
  modelValue: Record<string, string[]>;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, string[]>): void;
  (e: 'valid', isValid: boolean): void;
}>();

const selected = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

function isSelected(groupName: string, barcode: string): boolean {
  return selected.value[groupName]?.includes(barcode) || false;
}

function getSelectedCount(groupName: string): number {
  return selected.value[groupName]?.length || 0;
}

function toggleOption(group: CustomizationGroup, option: CustomizationOption) {
  const currentSelections = [...(selected.value[group.name] || [])];
  const index = currentSelections.indexOf(option.barcode);

  if (index > -1) {
    // Remove if already selected
    currentSelections.splice(index, 1);
  } else {
    // Add if not selected and within max
    if (currentSelections.length < group.max) {
      if (group.max === 1) {
        // If max is 1, replace previous selection
        currentSelections.length = 0;
        currentSelections.push(option.barcode);
      } else {
        currentSelections.push(option.barcode);
      }
    } else if (group.max === 1) {
      // Single select toggle
      currentSelections.length = 0;
      currentSelections.push(option.barcode);
    }
  }

  const newValue = { ...selected.value, [group.name]: currentSelections };
  selected.value = newValue;
  validate(newValue);
}

function validate(selections: Record<string, string[]>) {
  const isValid = props.groups.every(group => {
    const count = selections[group.name]?.length || 0;
    return count >= group.min && count <= group.max;
  });
  emit('valid', isValid);
}

// Initial validation
validate(props.modelValue);
</script>

<style scoped>
.pi-check {
  font-family: 'primeicons' !important;
}
</style>
