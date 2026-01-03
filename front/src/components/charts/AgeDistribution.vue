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

const alzheimerTypes = ['Non Demented', 'Very Mild Demented', 'Mild Demented', 'Moderate Demented']

const colors = {
  'Non Demented': { bg: 'rgba(34, 197, 94, 0.8)', border: 'rgb(34, 197, 94)' },
  'Very Mild Demented': { bg: 'rgba(234, 179, 8, 0.8)', border: 'rgb(234, 179, 8)' },
  'Mild Demented': { bg: 'rgba(249, 115, 22, 0.8)', border: 'rgb(249, 115, 22)' },
  'Moderate Demented': { bg: 'rgba(239, 68, 68, 0.8)', border: 'rgb(239, 68, 68)' }
}

// Calculate age ranges using Sturges' formula
const calculateInterval = (ages) => {
  if (ages.length === 0) return 10
  const min = Math.min(...ages)
  const max = Math.max(...ages)
  const range = max - min
  let k = Math.log2(ages.length) + 1
  const integerPart = Math.floor(k)
  k = integerPart % 2 === 0 ? Math.ceil(k) : integerPart
  return Math.ceil(range / k) || 10
}

const assignRanges = (ages, interval) => {
  if (ages.length === 0) return []
  const ranges = []
  let minAge = Math.min(...ages)
  let maxAge = minAge + interval

  while (minAge <= Math.max(...ages)) {
    ranges.push({ min: minAge, max: maxAge })
    minAge = maxAge + 1
    maxAge = minAge + interval
  }

  return ranges
}

const chartData = computed(() => {
  if (props.data.length === 0) {
    return { labels: [], datasets: [] }
  }

  const ages = props.data.map(item => item.age)
  const interval = calculateInterval(ages)
  const ageRanges = assignRanges(ages, interval)

  const labels = ageRanges.map(r => `${r.min}-${r.max}`)

  const datasets = alzheimerTypes.map(type => {
    const data = ageRanges.map(range => {
      return props.data
        .filter(item => item.age >= range.min && item.age <= range.max && item.alzheimerType === type)
        .reduce((sum, item) => sum + item.realCount, 0)
    })

    return {
      label: type,
      data,
      backgroundColor: colors[type].bg,
      borderColor: colors[type].border,
      borderWidth: 1
    }
  })

  return { labels, datasets }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Age Distribution by Classification',
      font: {
        size: 16,
        weight: 'bold'
      }
    }
  },
  scales: {
    x: {
      stacked: true,
      title: {
        display: true,
        text: 'Age Range'
      }
    },
    y: {
      stacked: true,
      beginAtZero: true,
      title: {
        display: true,
        text: 'Number of Patients'
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

    <div v-else class="h-64">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
