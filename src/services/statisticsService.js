import api from './api'

export const getLandingStatistics = async () => {
  const response = await api.get('/statistics')
  return response.data?.data || response.data
}
