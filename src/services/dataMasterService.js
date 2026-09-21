import api from './api'

const getData = async (path, params = {}) => {
  const response = await api.get(path, { params: { per_page: 100, ...params } })
  return Array.isArray(response.data?.data) ? response.data.data : []
}

export const getDataMaster = async (params = {}) => {
  const [provisioning, regulating, supporting, cultural] = await Promise.all([
    getData('/provisioning-services', params),
    getData('/regulating-services', params),
    getData('/supporting-services', params),
    getData('/cultural-services', params),
  ])

  return { provisioning, regulating, supporting, cultural }
}

