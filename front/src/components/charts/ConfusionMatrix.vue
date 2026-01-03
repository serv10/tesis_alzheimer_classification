<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const classes = ['Non Demented', 'Very Mild Demented', 'Mild Demented', 'Moderate Demented']

const matrix = computed(() => {
  const result = {}
  classes.forEach(real => {
    result[real] = {}
    classes.forEach(pred => {
      result[real][pred] = 0
    })
  })

  props.data.forEach(item => {
    if (result[item.realType] && result[item.realType][item.predictedType] !== undefined) {
      result[item.realType][item.predictedType] = item.count
    }
  })

  return result
})

const maxValue = computed(() => {
  let max = 0
  props.data.forEach(item => {
    if (item.count > max) max = item.count
  })
  return max || 1
})

const getColor = (value) => {
  const intensity = Math.round((value / maxValue.value) * 255)
  if (value === 0) return 'bg-gray-100'
  return `rgb(${255 - intensity}, ${255 - intensity * 0.3}, ${255 - intensity})`
}

const getTextColor = (value) => {
  const intensity = value / maxValue.value
  return intensity > 0.5 ? 'text-white' : 'text-gray-900'
}

const shortLabels = {
  'Non Demented': 'Non',
  'Very Mild Demented': 'VeryMild',
  'Mild Demented': 'Mild',
  'Moderate Demented': 'Moderate'
}
</script>

<template>
  <div class="bg-white rounded-lg shadow p-4">
    <h3 class="text-lg font-semibold text-gray-900 mb-4 text-center">Confusion Matrix</h3>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <div v-else class="overflow-x-auto">
      <div class="min-w-[400px]">
        <!-- Header: Predicted labels -->
        <div class="flex">
          <div class="w-20 h-8"></div>
          <div class="flex-1 text-center text-xs font-medium text-gray-600 mb-1">Predicted</div>
        </div>

        <div class="flex">
          <div class="w-20"></div>
          <div class="flex-1 grid grid-cols-4 gap-1">
            <div v-for="cls in classes" :key="'h-' + cls" class="text-center text-xs font-medium text-gray-700 py-1">
              {{ shortLabels[cls] }}
            </div>
          </div>
        </div>

        <!-- Matrix rows -->
        <div class="flex">
          <!-- Real labels (vertical) -->
          <div class="w-20 flex flex-col justify-center">
            <div class="text-xs font-medium text-gray-600 text-center mb-2 -rotate-90 origin-center whitespace-nowrap">Real</div>
          </div>

          <div class="flex-1">
            <div v-for="realClass in classes" :key="realClass" class="flex items-center mb-1">
              <div class="w-16 text-xs font-medium text-gray-700 text-right pr-2">
                {{ shortLabels[realClass] }}
              </div>
              <div class="flex-1 grid grid-cols-4 gap-1">
                <div
                  v-for="predClass in classes"
                  :key="predClass"
                  class="aspect-square flex items-center justify-center text-sm font-semibold rounded transition-all"
                  :style="{ backgroundColor: getColor(matrix[realClass][predClass]) }"
                  :class="getTextColor(matrix[realClass][predClass])"
                >
                  {{ matrix[realClass][predClass] }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div class="mt-4 flex justify-center items-center gap-2 text-xs text-gray-600">
          <span>Low</span>
          <div class="flex h-3">
            <div class="w-6 bg-gray-100"></div>
            <div class="w-6" style="background-color: rgb(191, 236, 191)"></div>
            <div class="w-6" style="background-color: rgb(127, 217, 127)"></div>
            <div class="w-6" style="background-color: rgb(63, 198, 63)"></div>
            <div class="w-6" style="background-color: rgb(0, 178, 0)"></div>
          </div>
          <span>High</span>
        </div>
      </div>
    </div>
  </div>
</template>
