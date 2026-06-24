import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:5000/api' })

const fromBackendReport = (report = {}) => ({
  ...report,
  titre: report.titre ?? report.title ?? '',
  objectif: report.objectif ?? report.objective ?? '',
  protocole: report.protocole ?? report.protocol ?? '',
  resultats: report.resultats ?? report.results ?? '',
  observations: report.observations ?? '',
  conclusion: report.conclusion ?? '',
  projetId: report.projetId ?? report.projectId ?? '',
  chercheurId: report.chercheurId ?? report.researcherId ?? '',
  dateExperience: report.dateExperience ?? report.experienceDate ?? '',
  statut: report.statut ?? report.status ?? 'brouillon'
})

const toBackendReport = (report = {}) => ({
  titre: report.titre,
  objectif: report.objectif,
  protocole: report.protocole,
  resultats: report.resultats,
  observations: report.observations,
  conclusion: report.conclusion,
  projetId: report.projetId,
  chercheurId: report.chercheurId,
  dateExperience: report.dateExperience,
  statut: report.statut,
  title: report.titre,
  objective: report.objectif,
  protocol: report.protocole,
  results: report.resultats,
  projectId: report.projetId,
  researcherId: report.chercheurId,
  status: report.statut
})

const normalizeStatusStat = (item = {}) => ({
  ...item,
  _id: item._id ?? item.statut ?? item.status,
  statut: item.statut ?? item._id ?? item.status,
  count: item.count ?? item.total ?? 0
})

const extractError = (error) => {
  const message = error.response?.data?.message || error.response?.data?.error || error.message
  return new Error(message || 'Erreur API inconnue')
}

const request = async (action) => {
  try {
    return await action()
  } catch (error) {
    throw extractError(error)
  }
}

export default api

export const getReports = (params) => request(async () => {
  const response = await api.get('/reports', { params })
  return Array.isArray(response.data) ? response.data.map(fromBackendReport) : []
})

export const getReport = (id) => request(async () => {
  const response = await api.get(`/reports/${id}`)
  return fromBackendReport(response.data)
})

export const createReport = (data) => request(async () => {
  const response = await api.post('/reports', toBackendReport(data))
  return fromBackendReport(response.data)
})

export const updateReport = (id, data) => request(async () => {
  const response = await api.put(`/reports/${id}`, toBackendReport(data))
  return fromBackendReport(response.data)
})

export const deleteReport = (id) => request(async () => {
  const response = await api.delete(`/reports/${id}`)
  return response.data
})

export const submitReport = (id) => request(async () => {
  const response = await api.patch(`/reports/${id}/submit`)
  return fromBackendReport(response.data)
})

export const validateReport = (id) => request(async () => {
  const response = await api.patch(`/reports/${id}/validate`)
  return fromBackendReport(response.data)
})

export const statsByStatus = () => request(async () => {
  const response = await api.get('/reports/stats/status')
  return Array.isArray(response.data) ? response.data.map(normalizeStatusStat) : []
})

export const productiveResearchers = () => request(async () => {
  const response = await api.get('/reports/stats/productive-researchers')
  return Array.isArray(response.data) ? response.data : []
})
