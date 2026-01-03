<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'px-6 py-2 rounded-md font-medium transition-colors duration-200',
      disabled ? 'opacity-60 cursor-not-allowed' : '',
      className,
    ]"
    @click="$emit('click', $event)"
  >
    {{ title }}
  </button>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'button',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  className: {
    type: String,
    default: '',
  },
})

defineEmits(['click'])
</script>
