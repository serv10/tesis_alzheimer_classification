<script setup>
import { ref, computed, h } from 'vue'
import {
  useVueTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  FlexRender,
} from '@tanstack/vue-table'
import { ChevronUpIcon, ChevronDownIcon, MagnifyingGlassIcon, PhotoIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['view-images'])

const globalFilter = ref('')
const sorting = ref([])

const columns = [
  {
    accessorKey: 'dni',
    header: 'DNI',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'birthDate',
    header: 'Birth Date',
    cell: (info) => {
      const date = info.getValue()
      if (!date) return '-'
      return new Date(date).toLocaleDateString()
    },
  },
  {
    accessorKey: 'totalExaminations',
    header: 'Examinations',
    cell: (info) => info.getValue() || 0,
  },
  {
    accessorKey: 'registrationDate',
    header: 'Registration Date',
    cell: (info) => {
      const date = info.getValue()
      if (!date) return '-'
      return new Date(date).toLocaleDateString()
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: (info) => info.row.original,
  },
]

const handleViewImages = (patient) => {
  emit('view-images', patient)
}

const table = useVueTable({
  get data() {
    return props.data
  },
  columns,
  state: {
    get sorting() {
      return sorting.value
    },
    get globalFilter() {
      return globalFilter.value
    },
  },
  onSortingChange: (updaterOrValue) => {
    sorting.value = typeof updaterOrValue === 'function' ? updaterOrValue(sorting.value) : updaterOrValue
  },
  onGlobalFilterChange: (updaterOrValue) => {
    globalFilter.value = typeof updaterOrValue === 'function' ? updaterOrValue(globalFilter.value) : updaterOrValue
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
})
</script>

<template>
  <div class="w-full">
    <!-- Search -->
    <div class="mb-4">
      <div class="relative">
        <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          v-model="globalFilter"
          type="text"
          placeholder="Search patients..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto rounded-lg border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="header in table.getFlatHeaders()"
              :key="header.id"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
              @click="header.column.getToggleSortingHandler()?.($event)"
            >
              <div class="flex items-center gap-2">
                <FlexRender
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
                <span v-if="header.column.getIsSorted()">
                  <ChevronUpIcon v-if="header.column.getIsSorted() === 'asc'" class="h-4 w-4" />
                  <ChevronDownIcon v-else class="h-4 w-4" />
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <!-- Loading -->
          <tr v-if="loading">
            <td :colspan="columns.length" class="px-6 py-12 text-center text-gray-500">
              <div class="flex justify-center items-center gap-2">
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading...
              </div>
            </td>
          </tr>
          <!-- Empty -->
          <tr v-else-if="table.getRowModel().rows.length === 0">
            <td :colspan="columns.length" class="px-6 py-12 text-center text-gray-500">
              No patients found
            </td>
          </tr>
          <!-- Data -->
          <tr
            v-else
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            class="hover:bg-gray-50"
          >
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            >
              <!-- Actions column -->
              <template v-if="cell.column.id === 'actions'">
                <button
                  @click="handleViewImages(row.original)"
                  class="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition"
                  title="View Images"
                >
                  <PhotoIcon class="w-4 h-4" />
                  Images
                </button>
              </template>
              <!-- Other columns -->
              <template v-else>
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Results count -->
    <div class="mt-4 text-sm text-gray-500">
      Showing {{ table.getRowModel().rows.length }} of {{ props.data.length }} patients
    </div>
  </div>
</template>
