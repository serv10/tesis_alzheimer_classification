import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

const apiClientJson = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function useApi() {
  // ============================================
  // PATIENTS
  // ============================================

  // POST /api/patients/examine
  const examinePatient = async (formData, onProgress) => {
    try {
      const response = await apiClient.post('/api/patients/examine', formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          if (onProgress) {
            onProgress(progress)
          }
        },
      })
      return [null, response.data]
    } catch (error) {
      return [error.response?.data || error, null]
    }
  }

  // GET /api/patients
  const getPatients = async () => {
    try {
      const response = await apiClientJson.get('/api/patients')
      return [null, response.data]
    } catch (error) {
      return [error.response?.data || error, null]
    }
  }

  // GET /api/patients/:dni
  const getPatientByDni = async (dni) => {
    try {
      const response = await apiClientJson.get(`/api/patients/${dni}`)
      return [null, response.data]
    } catch (error) {
      // 404 means patient not found - return the response data
      if (error.response?.status === 404) {
        return [null, error.response.data]
      }
      return [error.response?.data || error, null]
    }
  }

  // GET /api/patients/:dni/images
  const getPatientImages = async (dni) => {
    try {
      const response = await apiClientJson.get(`/api/patients/${dni}/images`)
      return [null, response.data]
    } catch (error) {
      return [error.response?.data || error, null]
    }
  }

  // ============================================
  // IMAGES
  // ============================================

  // PATCH /api/images/:id/classification
  const updateImageClassification = async (imageId, realValue) => {
    try {
      const response = await apiClientJson.patch(`/api/images/${imageId}/classification`, {
        realValue,
      })
      return [null, response.data]
    } catch (error) {
      return [error.response?.data || error, null]
    }
  }

  // ============================================
  // STATISTICS
  // ============================================

  // GET /api/statistics/classifications
  const getClassifications = async () => {
    try {
      const response = await apiClientJson.get('/api/statistics/classifications')
      return [null, response.data]
    } catch (error) {
      return [error.response?.data || error, null]
    }
  }

  // GET /api/statistics/age-distribution
  const getAgeDistribution = async () => {
    try {
      const response = await apiClientJson.get('/api/statistics/age-distribution')
      return [null, response.data]
    } catch (error) {
      return [error.response?.data || error, null]
    }
  }

  // GET /api/statistics/confusion-matrix
  const getConfusionMatrix = async () => {
    try {
      const response = await apiClientJson.get('/api/statistics/confusion-matrix')
      return [null, response.data]
    } catch (error) {
      return [error.response?.data || error, null]
    }
  }

  return {
    // Patients
    examinePatient,
    getPatients,
    getPatientByDni,
    getPatientImages,
    // Images
    updateImageClassification,
    // Statistics
    getClassifications,
    getAgeDistribution,
    getConfusionMatrix,
  }
}
