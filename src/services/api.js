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

export const getChercheurs = () => request(async () => {
  const response = await api.get('/oracle/chercheurs')
  return Array.isArray(response.data) ? response.data : []
})

export const createChercheur = (data) => request(async () => {
  const response = await api.post('/oracle/chercheurs', data)
  return response.data
})

export const updateChercheur = (id, data) => request(async () => {
  const response = await api.put(`/oracle/chercheurs/${id}`, data)
  return response.data
})

export const deleteChercheur = (id) => request(async () => {
  const response = await api.delete(`/oracle/chercheurs/${id}`)
  return response.data
})

export const getProjets = () => request(async () => {
  const response = await api.get('/oracle/projets')
  return Array.isArray(response.data) ? response.data : []
})

export const createProjet = (data) => request(async () => {
  const response = await api.post('/oracle/projets', data)
  return response.data
})

export const updateProjet = (id, data) => request(async () => {
  const response = await api.put(`/oracle/projets/${id}`, data)
  return response.data
})

export const deleteProjet = (id) => request(async () => {
  const response = await api.delete(`/oracle/projets/${id}`)
  return response.data
})

export const getEquipements = () => request(async () => {
  const response = await api.get('/oracle/equipements')
  return Array.isArray(response.data) ? response.data : []
})

export const createEquipement = (data) => request(async () => {
  const response = await api.post('/oracle/equipements', data)
  return response.data
})

export const updateEquipement = (id, data) => request(async () => {
  const response = await api.put(`/oracle/equipements/${id}`, data)
  return response.data
})

export const deleteEquipement = (id) => request(async () => {
  const response = await api.delete(`/oracle/equipements/${id}`)
  return response.data
})

export const getAffectations = () => request(async () => {
  const response = await api.get('/oracle/affectations')
  return Array.isArray(response.data) ? response.data : []
})

export const createAffectation = (data) => request(async () => {
  const response = await api.post('/oracle/affectations', data)
  return response.data
})

export const deleteAffectation = (id) => request(async () => {
  const response = await api.delete(`/oracle/affectations/${id}`)
  return response.data
})

export const getReservations = () => request(async () => {
  const response = await api.get('/oracle/reservations')
  return Array.isArray(response.data) ? response.data : []
})

export const createReservation = (data) => request(async () => {
  const response = await api.post('/oracle/reservations', data)
  return response.data
})

export const deleteReservation = (id) => request(async () => {
  const response = await api.delete(`/oracle/reservations/${id}`)
  return response.data
})

export const getStatsProjetsActifs = () => request(async () => {
  const response = await api.get('/oracle/stats/projets-actifs')
  return Array.isArray(response.data) ? response.data : []
})

export const getStatsProjetsChercheurs = () => request(async () => {
  const response = await api.get('/oracle/stats/projets-chercheurs')
  return Array.isArray(response.data) ? response.data : []
})
