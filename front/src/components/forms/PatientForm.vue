<template>
  <form
    class="grid grid-cols-2 gap-4 items-center grid-rows-5"
    @submit.prevent="handleSubmit"
  >
    <div class="col-span-2">
      <h2 class="text-2xl font-bold text-gray-900">Patient Data</h2>
    </div>

    <!-- DNI -->
    <div>
      <BaseLabel title="DNI" htmlFor="dni" />
      <BaseInput
        id="dni"
        name="dni"
        v-model="form.dni"
        placeholder="12345678"
        className="w-full"
      />
    </div>

    <!-- Name -->
    <div>
      <BaseLabel title="Name" htmlFor="name" />
      <BaseInput
        id="name"
        name="name"
        v-model="form.name"
        placeholder="John"
        className="w-full"
      />
    </div>

    <!-- Last Name -->
    <div>
      <BaseLabel title="Last Name" htmlFor="lastName" />
      <BaseInput
        id="lastName"
        name="lastName"
        v-model="form.lastName"
        placeholder="Doe"
        className="w-full"
      />
    </div>

    <!-- Gender -->
    <div>
      <BaseLabel title="Gender" htmlFor="gender" />
      <BaseSelect
        id="gender"
        name="gender"
        v-model="form.gender"
        :options="genderOptions"
      />
    </div>

    <!-- Birth Date -->
    <div>
      <BaseLabel title="Birth Date" htmlFor="birthDate" />
      <input
        id="birthDate"
        type="date"
        v-model="form.birthDate"
        :max="maxDate"
        :min="minDate"
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800"
      />
    </div>

    <!-- Buttons -->
    <div v-if="!prediction" class="text-center col-span-2">
      <BaseButton
        type="submit"
        :title="isSubmitting ? 'Processing...' : 'Examine'"
        :className="
          isFormValid && !isSubmitting
            ? 'bg-blue-950 hover:bg-blue-950/80 cursor-pointer col-span-2 text-white'
            : 'bg-blue-950 opacity-60 col-span-2 text-white cursor-not-allowed'
        "
        :disabled="!isFormValid || isSubmitting"
      />
    </div>

    <template v-else>
      <BaseButton
        @click="$emit('show-results')"
        title="Show Results"
        className="bg-blue-950 hover:bg-blue-950/80 cursor-pointer row-start-5 text-white"
        type="button"
      />
      <BaseButton
        @click="$emit('clear-form')"
        title="Clear Form"
        className="bg-zinc-50 border border-slate-900 cursor-pointer !text-slate-900 hover:bg-gray-200/50 row-start-5 col-start-2"
        type="button"
      />
    </template>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseLabel from '@/components/ui/BaseLabel.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

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

const form = ref({
  dni: '',
  name: '',
  lastName: '',
  birthDate: '',
  gender: 1,
})

const genderOptions = [
  { value: 1, label: 'Male' },
  { value: 2, label: 'Female' },
]

const today = new Date()
const maxDate = today.toISOString().split('T')[0]
const minDate = '1900-01-01'

const isFormValid = computed(() => {
  return (
    form.value.dni.trim() !== '' &&
    form.value.name.trim() !== '' &&
    form.value.lastName.trim() !== '' &&
    form.value.birthDate !== ''
  )
})

const handleSubmit = () => {
  if (isFormValid.value) {
    emit('submit', form.value)
  }
}

const resetForm = () => {
  form.value = {
    dni: '',
    name: '',
    lastName: '',
    birthDate: '',
    gender: 1,
  }
}

defineExpose({
  resetForm,
})
</script>
