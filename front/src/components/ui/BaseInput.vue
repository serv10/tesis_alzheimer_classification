<template>
  <input
    :id="id"
    :name="name"
    :type="type"
    :placeholder="placeholder"
    :value="modelValue"
    :class="[
      'px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800',
      className,
    ]"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
defineProps({
  id: String,
  name: String,
  type: {
    type: String,
    default: 'text',
  },
  placeholder: String,
  modelValue: [String, Number],
  className: String,
})

defineEmits(['update:modelValue'])
</script>
