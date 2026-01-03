<template>
  <select
    :id="id"
    :name="name"
    :value="modelValue"
    class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800 w-full"
    @change="handleChange"
  >
    <option v-for="option in options" :key="option.value ?? 'null'" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<script setup>
const props = defineProps({
  id: String,
  name: String,
  modelValue: [String, Number, null],
  options: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const handleChange = (event) => {
  const value = event.target.value
  // Handle null/empty values properly
  if (value === '' || value === 'null') {
    emit('update:modelValue', null)
  } else {
    emit('update:modelValue', Number(value))
  }
}
</script>
