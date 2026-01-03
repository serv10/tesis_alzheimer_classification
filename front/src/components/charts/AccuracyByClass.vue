<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

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

const accuracyData = computed(() => {
  const result = {}

  classes.forEach(cls => {
    result[cls] = { correct: 0, total: 0 }
  })

  props.data.forEach(item => {
    if (result[item.realType]) {
      result[item.realType].total += item.count
      if (item.realType === item.predictedType) {
        result[item.realType].correct += item.count
      }
    }
  })

  return classes.map(cls => ({
    class: cls,
    accuracy: result[cls].total > 0
      ? Math.round((result[cls].correct / result[cls].total) * 100)
      : 0,
    correct: result[cls].correct,
    total: result[cls].total
  }))
})

const overallAccuracy = computed(() => {
  const totalCorrect = accuracyData.value.reduce((sum, item) => sum + item.correct, 0)
  const totalSamples = accuracyData.value.reduce((sum, item) => sum + item.total, 0)
  return totalSamples > 0 ? Math.round((totalCorrect / totalSamples) * 100) : 0
})

const chartData = computed(() => {
  return {
    labels: accuracyData.value.map(item => item.class),
    datasets: [
      {
        label: 'Accuracy (%)',
        data: accuracyData.value.map(item => item.accuracy),
        backgroundColor: accuracyData.value.map(item => {
          if (item.accuracy >= 80) return 'rgba(34, 197, 94, 0.8)'
          if (item.accuracy >= 60) return 'rgba(234, 179, 8, 0.8)'
          if (item.accuracy >= 40) return 'rgba(249, 115, 22, 0.8)'
          return 'rgba(239, 68, 68, 0.8)'
        }),
        borderColor: accuracyData.value.map(item => {
          if (item.accuracy >= 80) return 'rgb(34, 197, 94)'
          if (item.accuracy >= 60) return 'rgb(234, 179, 8)'
          if (item.accuracy >= 40) return 'rgb(249, 115, 22)'
          return 'rgb(239, 68, 68)'
        }),
        borderWidth: 1
      }
    ]
  }
})

const chartOptions = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: true,
      text: 'Model Accuracy by Classification',
      font: {
        size: 16,
        weight: 'bold'
      }
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const item = accuracyData.value[context.dataIndex]
          return `${item.accuracy}% (${item.correct}/${item.total} correct)`
        }
      }
    }
  },
  scales: {
    x: {
      beginAtZero: true,
      max: 100,
      title: {
        display: true,
        text: 'Accuracy (%)'
      }
    }
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow p-4">
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <div v-else>
      <div class="h-56">
        <Bar :data="chartData" :options="chartOptions" />
      </div>

      <div class="mt-2 text-center">
        <span class="text-sm text-gray-600">Overall Accuracy: </span>
        <span
          class="text-lg font-bold"
          :class="{
            'text-green-600': overallAccuracy >= 80,
            'text-yellow-600': overallAccuracy >= 60 && overallAccuracy < 80,
            'text-orange-600': overallAccuracy >= 40 && overallAccuracy < 60,
            'text-red-600': overallAccuracy < 40
          }"
        >
          {{ overallAccuracy }}%
        </span>
      </div>
    </div>
  </div>
</template>
