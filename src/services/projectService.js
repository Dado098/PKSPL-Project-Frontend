import api from './api'

export const getProyekList = async (params = {}) => {
  const response = await api.get('/proyek', { params })
  return response.data?.data || response.data
}

export const getProyekById = async (idProyek) => {
  const response = await api.get(`/proyek/${idProyek}`)
  return response.data?.data || response.data
}

export const createProyek = async (payload) => {
  let requestData = payload
  let headers = {}

  // If payload contains SHP File objects, send as FormData
  if (payload instanceof FormData) {
    requestData = payload
    headers = { 'Content-Type': 'multipart/form-data' }
  }

  const response = await api.post('/proyek', requestData, { headers })
  return response.data?.data || response.data
}

export const updateProyek = async (idProyek, payload) => {
  let requestData = payload
  let headers = {}

  if (payload instanceof FormData) {
    requestData = payload
    headers = { 'Content-Type': 'multipart/form-data' }
  }

  const response = await api.put(`/proyek/${idProyek}`, requestData, { headers })
  return response.data?.data || response.data
}

export const deleteProyek = async (idProyek) => {
  const response = await api.delete(`/proyek/${idProyek}`)
  return response.data
}
