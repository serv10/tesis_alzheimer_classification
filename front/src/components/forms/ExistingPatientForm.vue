<template>
  <form
    class="grid grid-cols-2 gap-4 items-center"
    @submit.prevent="handleSubmit"
  >
    <div class="col-span-2">
      <h2 class="text-2xl font-bold text-gray-900">Existing Patient</h2>
      <p class="text-sm text-gray-500 mt-1">Enter DNI to load patient data</p>
    </div>

    <!-- DNI Search -->
    <div class="col-span-2">
      <BaseLabel title="DNI" htmlFor="dniSearch" />
      <div class="flex gap-2">
        <BaseInput
          id="dniSearch"
          name="dniSearch"
          v-model="dniSearch"
          placeholder="12345678"
          className="flex-1"
          :disabled="isSearching || patientFound"
        />
        <BaseButton
          v-if="!patientFound"
          type="button"
          @click="searchPatient"
          :title="isSearching ? 'Searching...' : 'Search'"
          :disabled="!dniSearch.trim() || isSearching"
          :className="
            dniSearch.trim() && !isSearching
              ? 'bg-blue-950 hover:bg-blue-950/80 text-white px-6'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed px-6'
          "
        />
        <BaseButton
          v-else
          type="button"
          @click="clearPatient"
          title="Change"
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6"
        />
      </div>
    </div>

    <!-- Patient Info (shown when found) -->
    <template v-if="patientFound">
      <div>
        <BaseLabel title="Name" />
        <p class="px-4 py-2 bg-gray-100 rounded-md text-gray-900">{{ patient.name }}</p>
      </div>

      <div>
        <BaseLabel title="Last Name" />
        <p class="px-4 py-2 bg-gray-100 rounded-md text-gray-900">{{ patient.lastName }}</p>
      </div>

      <div>
        <BaseLabel title="Birth Date" />
        <p class="px-4 py-2 bg-gray-100 rounded-md text-gray-900">{{ formatDate(patient.birthDate) }}</p>
      </div>

      <div>
        <BaseLabel title="Gender" />
        <p class="px-4 py-2 bg-gray-100 rounded-md text-gray-900">{{ patient.genderDescription }}</p>
      </div>

      <!-- Submit Button -->
      <div v-if="!prediction" class="text-center col-span-2 mt-2">
        <BaseButton
          type="submit"
          :title="isSubmitting ? 'Processing...' : 'Examine'"
          :className="
            !isSubmitting
              ? 'bg-blue-950 hover:bg-blue-950/80 cursor-pointer text-white w-full'
              : 'bg-blue-950 opacity-60 text-white cursor-not-allowed w-full'
          "
          :disabled="isSubmitting"
        />
      </div>

      <template v-else>
        <BaseButton
          @click="$emit('show-results')"
          title="Show Results"
          className="bg-blue-950 hover:bg-blue-950/80 cursor-pointer text-white"
          type="button"
        />
        <BaseButton
          @click="handleClear"
          title="Clear Form"
          className="bg-zinc-50 border border-slate-900 cursor-pointer !text-slate-900 hover:bg-gray-200/50"
          type="button"
        />
      </template>
    </template>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseLabel from '@/components/ui/BaseLabel.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useApi } from '@/composables/useApi'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  prediction: {
    type: String,
    default: '',
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'show-results', 'clear-form'])

const { getPatientByDni } = useApi()
const { error: showError } = useToast()

const dniSearch = ref('')
const isSearching = ref(false)
const patientFound = ref(false)
const patient = ref(null)

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const searchPatient = async () => {
  if (!dniSearch.value.trim()) return

  isSearching.value = true
  const [err, response] = await getPatientByDni(dniSearch.value.trim())
  isSearching.value = false

  if (err) {
    showError(err.message || 'Error searching patient')
    return
  }

  if (!response.exists) {
    showError('Patient not found. Please register as a new patient.')
    return
  }

  patient.value = response.patient
  patientFound.value = true
}

const clearPatient = () => {
  patientFound.value = false
  patient.value = null
  dniSearch.value = ''
}

const handleSubmit = () => {
  if (patientFound.value && patient.value) {
    emit('submit', {
      dni: patient.value.dni,
      name: patient.value.name,
      lastName: patient.value.lastName,
      birthDate: patient.value.birthDate?.split('T')[0] || '',
      gender: patient.value.gender,
    })
  }
}

const handleClear = () => {
  clearPatient()
  emit('clear-form')
}

const resetForm = () => {
  clearPatient()
}

defineExpose({
  resetForm,
})
</script>
