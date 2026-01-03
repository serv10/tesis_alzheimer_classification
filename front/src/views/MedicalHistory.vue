<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import { useToast } from '@/composables/useToast'
import PatientsTable from '@/components/tables/PatientsTable.vue'
import ImageGalleryModal from '@/components/modals/ImageGalleryModal.vue'
import BaseToast from '@/components/ui/BaseToast.vue'

const { getPatients, getPatientImages } = useApi()
const { error: showError } = useToast()

const patients = ref([])
const loading = ref(false)

// Gallery modal state
const isGalleryOpen = ref(false)
const selectedPatient = ref(null)
const patientImages = ref([])
const loadingImages = ref(false)

const loadPatients = async () => {
  loading.value = true
  const [error, data] = await getPatients()
  loading.value = false

  if (error) {
    showError(error.message || 'Error loading patients')
    return
  }

  patients.value = data || []
}

const handleViewImages = async (patient) => {
  selectedPatient.value = patient
  loadingImages.value = true
  isGalleryOpen.value = true

  const [error, data] = await getPatientImages(patient.dni)
  loadingImages.value = false

  if (error) {
    showError(error.message || 'Error loading patient images')
    return
  }

  patientImages.value = data || []
}

const handleGalleryClose = () => {
  isGalleryOpen.value = false
  selectedPatient.value = null
  patientImages.value = []
}

const handleImageUpdated = async () => {
  // Reload images after update
  if (selectedPatient.value) {
    const [error, data] = await getPatientImages(selectedPatient.value.dni)
    if (!error) {
      patientImages.value = data || []
    }
  }
}

onMounted(() => {
  loadPatients()
})
</script>

<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Medical History</h1>
      <p class="text-gray-600">View and search all registered patients</p>
    </div>

    <PatientsTable
      :data="patients"
      :loading="loading"
      @view-images="handleViewImages"
    />

    <ImageGalleryModal
      :isOpen="isGalleryOpen"
      :images="patientImages"
      :patientName="selectedPatient ? `${selectedPatient.name} ${selectedPatient.lastName}` : ''"
      @close="handleGalleryClose"
      @updated="handleImageUpdated"
    />

    <BaseToast />
  </div>
</template>
