<template>
  <label :for="htmlFor" class="block text-sm font-medium text-gray-700 mb-1">
    {{ title }}
  </label>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  htmlFor: String,
})
</script>
