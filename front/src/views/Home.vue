<template>
  <div class="w-full max-w-7xl flex gap-8 p-6 my-auto relative">
    <!-- Processing Overlay -->
    <Transition name="fade">
      <div
        v-if="isSubmitting"
        class="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-lg"
      >
        <div class="flex flex-col items-center gap-4">
          <!-- Spinner -->
          <svg class="animate-spin h-12 w-12 text-blue-950" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
              fill="none"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p class="text-lg font-semibold text-blue-950">Processing MRI image...</p>
          <p class="text-sm text-gray-600">Using EfficientNetV2B0 model</p>
        </div>
      </div>
    </Transition>

    <!-- Patient Form Section - Fixed width -->
    <div class="w-1/2">
      <!-- Tabs -->
      <div class="flex border-b border-gray-200 mb-6">
        <button
          @click="activeTab = 'new'"
          :class="[
            'px-6 py-3 text-sm font-medium transition-colors',
            activeTab === 'new'
              ? 'text-blue-950 border-b-2 border-blue-950'
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          New Patient
        </button>
        <button
          @click="activeTab = 'existing'"
          :class="[
            'px-6 py-3 text-sm font-medium transition-colors',
            activeTab === 'existing'
              ? 'text-blue-950 border-b-2 border-blue-950'
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          Existing Patient
        </button>
      </div>

      <!-- New Patient Form -->
      <PatientForm
        v-if="activeTab === 'new'"
        ref="newPatientFormRef"
        :prediction="prediction"
        :isSubmitting="isSubmitting"
        @submit="handleNewPatientSubmit"
        @show-results="openResultModal"
        @clear-form="handleClearForm"
      />

      <!-- Existing Patient Form -->
      <ExistingPatientForm
        v-else
        ref="existingPatientFormRef"
        :prediction="prediction"
        :isSubmitting="isSubmitting"
        @submit="handleSubmit"
        @show-results="openResultModal"
        @clear-form="handleClearForm"
      />
    </div>

    <!-- Image Upload - Fixed width -->
    <div class="w-1/2 flex items-center justify-center">
      <ImageUpload
        :selectedImage="selectedImage"
        :progress="progress"
        :uploadStatus="uploadStatus"
        @update:selectedImage="selectedImage = $event"
        @clear="handleClearImage"
      />
    </div>
  </div>

  <!-- Result Modal -->
  <BaseModal :isOpen="isModalOpen" title="Prediction Results" @close="closeResultModal">
    <div class="space-y-4">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p class="text-sm text-blue-800 font-medium mb-2">Model Used</p>
        <p class="text-lg font-bold text-blue-900">EfficientNetV2B0</p>
      </div>

      <div class="bg-green-50 border border-green-200 rounded-lg p-4">
        <p class="text-sm text-green-800 font-medium mb-2">Prediction Result</p>
        <p class="text-2xl font-bold text-green-900">{{ prediction }}</p>
      </div>
    </div>

    <template #actions>
      <BaseButton
        title="Close"
        @click="closeResultModal"
        className="bg-slate-800 hover:bg-slate-700 text-white"
      />
    </template>
  </BaseModal>

  <!-- Toast Notifications -->
  <BaseToast />
</template>

<script setup>
import { ref } from 'vue'
import PatientForm from '@/components/forms/PatientForm.vue'
import ExistingPatientForm from '@/components/forms/ExistingPatientForm.vue'
import ImageUpload from '@/components/forms/ImageUpload.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseToast from '@/components/ui/BaseToast.vue'
import { useApi } from '@/composables/useApi'
import { useToast } from '@/composables/useToast'
import { useModal } from '@/composables/useModal'

const { examinePatient, getPatientByDni } = useApi()
const { error: showError, success: showSuccess } = useToast()
const { isOpen: isModalOpen, open: openResultModal, close: closeResultModal } = useModal()

const activeTab = ref('new')
const newPatientFormRef = ref(null)
const existingPatientFormRef = ref(null)
const selectedImage = ref(null)
const progress = ref(0)
const uploadStatus = ref('idle')
const prediction = ref('')
const isSubmitting = ref(false)

const imageClassification = {
  'Mild Demented': 'Mild Demented',
  'Moderate Demented': 'Moderate Demented',
  'Non Demented': 'Non Demented',
  'Very Mild Demented': 'Very Mild Demented',
}

// Valid classification keys that match backend
const validClassificationKeys = ['mild', 'moderate', 'non', 'verymild']

const getRealClassificationImage = (image) => {
  const fileName = image.name
  const nameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'))
  const classificationKey = nameWithoutExtension.split('_')[0].toLowerCase()

  // Return the key only if it's valid, otherwise return empty string
  return validClassificationKeys.includes(classificationKey) ? classificationKey : ''
}

// Handle new patient submit - check if DNI already exists
const handleNewPatientSubmit = async (formData) => {
  if (!selectedImage.value) {
    showError('Please select an image')
    return
  }

  // Check if patient already exists
  const [err, response] = await getPatientByDni(formData.dni)

  if (err) {
    showError(err.message || 'Error checking patient')
    return
  }

  if (response.exists) {
    showError('A patient with this DNI already exists. Please use the "Existing Patient" tab.')
    return
  }

  // Proceed with examination
  await handleSubmit(formData)
}

const handleSubmit = async (formData) => {
  if (!selectedImage.value) {
    showError('Please select an image')
    return
  }

  isSubmitting.value = true
  uploadStatus.value = 'uploading'

  const data = new FormData()
  data.append('image', selectedImage.value)
  data.append('dni', formData.dni)
  data.append('name', formData.name)
  data.append('lastName', formData.lastName)
  data.append('birthDate', formData.birthDate)
  data.append('gender', formData.gender.toString())
  data.append('real', getRealClassificationImage(selectedImage.value))

  const [err, response] = await examinePatient(data, (progressValue) => {
    progress.value = progressValue
  })

  isSubmitting.value = false

  if (err) {
    uploadStatus.value = 'error'
    showError(err.message || 'Error uploading image')
    progress.value = 0
    return
  }

  if (response && response.result === 1) {
    uploadStatus.value = 'ok'
    prediction.value = imageClassification[response.prediction] || response.prediction
    showSuccess('Image analyzed successfully!')
    openResultModal()
  } else {
    uploadStatus.value = 'error'
    showError(response?.message || 'Error processing image')
    progress.value = 0
  }
}

const handleClearImage = () => {
  selectedImage.value = null
  uploadStatus.value = 'idle'
  progress.value = 0
}

const handleClearForm = () => {
  if (activeTab.value === 'new' && newPatientFormRef.value) {
    newPatientFormRef.value.resetForm()
  } else if (activeTab.value === 'existing' && existingPatientFormRef.value) {
    existingPatientFormRef.value.resetForm()
  }
  handleClearImage()
  prediction.value = ''
  closeResultModal()
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
