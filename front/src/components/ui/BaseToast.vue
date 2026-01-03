<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'px-6 py-4 rounded-lg shadow-lg text-white flex items-center gap-3 min-w-[300px]',
            toast.type === 'error' ? 'bg-red-600' : 'bg-green-600',
          ]"
        >
          <XCircleIcon v-if="toast.type === 'error'" class="w-6 h-6" />
          <CheckCircleIcon v-else class="w-6 h-6" />
          <p class="flex-1">{{ toast.message }}</p>
          <button
            @click="remove(toast.id)"
            class="text-white hover:text-gray-200 transition"
          >
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { XCircleIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import { useToast } from '@/composables/useToast'

const { toasts, remove } = useToast()
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
