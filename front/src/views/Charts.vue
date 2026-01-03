<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import { useToast } from '@/composables/useToast'
import ConfusionMatrix from '@/components/charts/ConfusionMatrix.vue'
import ClassificationComparison from '@/components/charts/ClassificationComparison.vue'
import AgeDistribution from '@/components/charts/AgeDistribution.vue'
import AccuracyByClass from '@/components/charts/AccuracyByClass.vue'

const { getConfusionMatrix, getClassifications, getAgeDistribution } = useApi()
const { showError } = useToast()

const confusionData = ref([])
const classificationData = ref([])
const ageData = ref([])
const loadingConfusion = ref(false)
const loadingClassification = ref(false)
const loadingAge = ref(false)

const loadConfusionMatrix = async () => {
  loadingConfusion.value = true
  const [error, data] = await getConfusionMatrix()
  loadingConfusion.value = false

  if (error) {
    showError(error.message || 'Error loading confusion matrix')
    return
  }

  confusionData.value = data || []
}

const loadClassificationData = async () => {
  loadingClassification.value = true
  const [error, data] = await getClassifications()
  loadingClassification.value = false

  if (error) {
    showError(error.message || 'Error loading classification data')
    return
  }

  classificationData.value = data || []
}

const loadAgeData = async () => {
  loadingAge.value = true
  const [error, data] = await getAgeDistribution()
  loadingAge.value = false

  if (error) {
    showError(error.message || 'Error loading age distribution data')
    return
  }

  ageData.value = data || []
}

onMounted(() => {
  loadConfusionMatrix()
  loadClassificationData()
  loadAgeData()
})
</script>

<template>
  <div class="p-6 w-full max-w-7xl">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Statistics & Charts</h1>
      <p class="text-gray-600">Model performance analysis and data visualization</p>
    </div>

    <!-- Bento Grid Layout -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Fila 1: Confusion Matrix + Accuracy lado a lado -->
      <div class="col-span-1">
        <ConfusionMatrix :data="confusionData" :loading="loadingConfusion" />
      </div>

      <div class="col-span-1">
        <AccuracyByClass :data="confusionData" :loading="loadingConfusion" />
      </div>

      <!-- Fila 2: Classification + Age Distribution -->
      <div class="col-span-1">
        <ClassificationComparison :data="classificationData" :loading="loadingClassification" />
      </div>

      <div class="col-span-1">
        <AgeDistribution :data="ageData" :loading="loadingAge" />
      </div>
    </div>
  </div>
</template>
