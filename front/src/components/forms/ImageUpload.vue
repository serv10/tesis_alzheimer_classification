<template>
  <div class="flex flex-col gap-4 w-full max-w-xl">
    <h4 class="text-gray-900 text-xl font-bold text-center">
      {{ !selectedImage ? 'Upload Image' : 'Image Preview' }}
    </h4>

    <!-- Container with fixed size -->
    <div
      class="w-full h-[600px] border-2 border-dashed rounded-lg overflow-hidden transition-all duration-200"
      :class="[
        isDragging
          ? 'border-blue-500 bg-blue-50 scale-[1.02]'
          : 'border-slate-900/30 bg-gray-50'
      ]"
      @dragenter.prevent="handleDragEnter"
      @dragleave.prevent="handleDragLeave"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <!-- Upload Zone -->
      <div
        v-if="!selectedImage"
        class="w-full h-full transition"
        :class="isDragging ? 'bg-blue-50' : 'hover:bg-gray-100'"
      >
        <label for="dropzone-file" class="cursor-pointer w-full h-full flex items-center justify-center">
          <div class="flex flex-col items-center text-gray-500 pointer-events-none">
            <CloudArrowUpIcon
              class="w-28 h-28 mb-4 transition-all duration-200"
              :class="isDragging ? 'text-blue-500 scale-110' : 'text-gray-700'"
            />
            <p class="mb-2 text-center" :class="isDragging ? 'text-blue-600' : ''">
              <span class="font-semibold">{{ isDragging ? 'Drop your image here' : 'Click to upload' }}</span>
              <span v-if="!isDragging"> or drag and drop</span>
            </p>
            <p class="text-sm" :class="isDragging ? 'text-blue-500' : ''">
              Supported formats: JPEG, PNG, JPG
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            @change="handleImageSelect"
            class="hidden"
            accept="image/jpeg,image/png,image/jpg"
          />
        </label>
      </div>

      <!-- Image Preview with padding for delete button -->
      <div v-else class="relative w-full h-full p-3">
        <!-- Delete button space -->
        <div class="absolute top-0 right-0 left-0 h-12 bg-gradient-to-b from-black/20 to-transparent rounded-t-lg z-10"></div>

        <!-- Delete Button -->
        <button
          @click="clearImage"
          type="button"
          class="absolute top-3 right-3 bg-red-600 hover:bg-red-700 p-2.5 rounded-full shadow-lg transition-all hover:scale-110 z-20"
        >
          <TrashIcon class="w-5 h-5 text-white" />
        </button>

        <!-- Image -->
        <div class="w-full h-full flex items-center justify-center">
          <img
            class="max-w-full max-h-full min-w-[80%] rounded-lg object-contain"
            :src="imagePreview"
            alt="Uploaded MRI"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CloudArrowUpIcon, TrashIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  selectedImage: {
    type: File,
    default: null,
  },
  progress: {
    type: Number,
    default: 0,
  },
  uploadStatus: {
    type: String,
    default: 'idle', // idle, selected, uploading, ok, error
  },
})

const emit = defineEmits(['update:selectedImage', 'clear'])

const imagePreview = ref('')
const isDragging = ref(false)
let dragCounter = 0

const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg']

const isValidImageFile = (file) => {
  return file && validImageTypes.includes(file.type)
}

const processFile = (file) => {
  if (isValidImageFile(file)) {
    emit('update:selectedImage', file)
    imagePreview.value = URL.createObjectURL(file)
  }
}

const handleImageSelect = (event) => {
  const files = event.target.files
  if (files && files.length > 0) {
    processFile(files[0])
  }
}

const handleDragEnter = (event) => {
  dragCounter++
  isDragging.value = true
}

const handleDragLeave = (event) => {
  dragCounter--
  if (dragCounter === 0) {
    isDragging.value = false
  }
}

const handleDrop = (event) => {
  dragCounter = 0
  isDragging.value = false

  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    processFile(files[0])
  }
}

const clearImage = () => {
  emit('clear')
  imagePreview.value = ''
}
</script>

