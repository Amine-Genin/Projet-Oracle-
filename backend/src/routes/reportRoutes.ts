import { Router } from 'express'
import {
  listReports,
  getReport,
  createReport,
  updateReport,
  deleteReport,
  submitReport,
  validateReport,
  statsByStatus,
  productiveResearchers
} from '../controllers/reportController'

const router = Router()

router.get('/', listReports)
router.get('/stats/status', statsByStatus)
router.get('/stats/productive-researchers', productiveResearchers)
router.get('/:id', getReport)
router.post('/', createReport)
router.put('/:id', updateReport)
router.delete('/:id', deleteReport)
router.patch('/:id/submit', submitReport)
router.patch('/:id/validate', validateReport)

export default router
