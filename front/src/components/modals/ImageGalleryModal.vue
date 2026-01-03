<script setup>
import { ref, computed, watch } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseLabel from '@/components/ui/BaseLabel.vue'
import { useApi } from '@/composables/useApi'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  images: {
    type: Array,
    default: () => [],
  },
  patientName: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close', 'updated'])

const { updateImageClassification } = useApi()
const { success: showSuccess, error: showError } = useToast()

const currentIndex = ref(0)
const selectedRealValue = ref(null)
const isSaving = ref(false)

const classificationOptions = [
  { value: null, label: '-- Select classification --' },
  { value: 1, label: 'Mild Demented' },
  { value: 2, label: 'Moderate Demented' },
  { value: 3, label: 'Non Demented' },
  { value: 4, label: 'Very Mild Demented' },
]

const currentImage = computed(() => {
  return props.images[currentIndex.value] || null
})

const hasMultipleImages = computed(() => props.images.length > 1)

const imageUrl = computed(() => {
  if (!currentImage.value?.imagePath) return ''
  // Convert Windows path to URL path
  const path = currentImage.value.imagePath.replace(/\\/g, '/')
  const fileName = path.split('/').pop()
  return `http://localhost:4001/uploads/${fileName}`
})

// Sync selected value with current image
watch(currentImage, (newImage) => {
  if (newImage) {
    selectedRealValue.value = newImage.realValueId || null
  }
}, { immediate: true })

// Reset index when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    currentIndex.value = 0
  }
})

const goToPrevious = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else {
    currentIndex.value = props.images.length - 1
  }
}

const goToNext = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++
  } else {
    currentIndex.value = 0
  }
}

const handleSave = async () => {
  if (!currentImage.value || selectedRealValue.value === null) {
    showError('Please select a classification')
    return
  }

  isSaving.value = true
  const [error] = await updateImageClassification(
    currentImage.value.imagePatientId,
    selectedRealValue.value
  )
  isSaving.value = false

  if (error) {
    showError(error.message || 'Error updating classification')
    return
  }

  showSuccess('Classification updated successfully')
  emit('updated')
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/70"
          @click="handleClose"
        />

        <!-- Modal Content -->
        <div class="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b">
            <div>
              <h2 class="text-xl font-bold text-gray-900">Patient Images</h2>
              <p class="text-sm text-gray-600">{{ patientName }}</p>
            </div>
            <button
              @click="handleClose"
              class="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <XMarkIcon class="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-hidden p-4">
            <div v-if="images.length === 0" class="flex items-center justify-center h-64">
              <p class="text-gray-500">No images found for this patient</p>
            </div>

            <div v-else class="flex gap-6 h-full">
              <!-- Image Section -->
              <div class="flex-1 flex flex-col">
                <!-- Image Container with Navigation -->
                <div class="relative flex-1 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden min-h-[400px]">
                  <!-- Previous Button -->
                  <button
                    v-if="hasMultipleImages"
                    @click="goToPrevious"
                    class="absolute left-2 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow transition"
                  >
                    <ChevronLeftIcon class="w-6 h-6 text-gray-800" />
                  </button>

                  <!-- Image -->
                  <img
                    :src="imageUrl"
                    :alt="currentImage?.imageName"
                    class="max-w-full max-h-full object-contain"
                  />

                  <!-- Next Button -->
                  <button
                    v-if="hasMultipleImages"
                    @click="goToNext"
                    class="absolute right-2 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow transition"
                  >
                    <ChevronRightIcon class="w-6 h-6 text-gray-800" />
                  </button>
                </div>

                <!-- Image Counter -->
                <div class="text-center mt-3 text-sm text-gray-600">
                  {{ currentIndex + 1 }} / {{ images.length }}
                </div>
              </div>

              <!-- Info Section -->
              <div class="w-72 flex flex-col gap-4">
                <!-- Upload Date -->
                <div>
                  <BaseLabel title="Upload Date" />
                  <p class="text-gray-900 font-medium">
                    {{ new Date(currentImage?.uploadDate).toLocaleDateString() }}
                  </p>
                </div>

                <!-- Model Prediction (Read Only) -->
                <div>
                  <BaseLabel title="Model Prediction" />
                  <div class="px-4 py-2 bg-blue-50 border border-blue-200 rounded-md">
                    <p class="text-blue-900 font-semibold">
                      {{ currentImage?.predictionValueDescription || 'N/A' }}
                    </p>
                  </div>
                </div>

                <!-- Real Classification (Editable) -->
                <div>
                  <BaseLabel title="Real Classification" htmlFor="realValue" />
                  <BaseSelect
                    id="realValue"
                    v-model="selectedRealValue"
                    :options="classificationOptions"
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    Select the actual diagnosis for this image
                  </p>
                </div>

                <!-- Save Button -->
                <BaseButton
                  @click="handleSave"
                  :title="isSaving ? 'Saving...' : 'Save Changes'"
                  :disabled="isSaving || selectedRealValue === currentImage?.realValueId"
                  :className="
                    isSaving || selectedRealValue === currentImage?.realValueId
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed w-full'
                      : 'bg-blue-950 hover:bg-blue-900 text-white w-full'
                  "
                  type="button"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
