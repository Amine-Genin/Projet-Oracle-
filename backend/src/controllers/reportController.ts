import { Request, Response } from 'express'
import Report from '../models/report'
import { Types } from 'mongoose'

const statusMap: Record<string, string> = {
  draft: 'brouillon',
  submitted: 'soumis',
  validated: 'validé'
}

export const listReports = async (req: Request, res: Response) => {
  const { status, q } = req.query as any
  const filter: any = {}
  if (status) {
    filter.statut = statusMap[status] || status
  }
  if (q) filter.$or = [ { titre: new RegExp(q, 'i') }, { objectif: new RegExp(q, 'i') } ]
  const reports = await Report.find(filter).sort({ createdAt: -1 }).lean()
  res.json(reports)
}

export const getReport = async (req: Request, res: Response) => {
  const { id } = req.params
  if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' })
  const r = await Report.findById(id).lean()
  if (!r) return res.status(404).json({ message: 'Not found' })
  res.json(r)
}

export const createReport = async (req: Request, res: Response) => {
  const payload = req.body
  const sanitizedPayload = {
    ...payload,
    titre: payload.titre || payload.title,
    objectif: payload.objectif || payload.objective,
    protocole: payload.protocole || payload.protocol,
    resultats: payload.resultats || payload.results,
    projetId: payload.projetId || payload.projectId,
    chercheurId: payload.chercheurId || payload.researcherId,
    statut: payload.statut || payload.status || 'brouillon'
  }
  try {
    const r = await Report.create(sanitizedPayload)
    res.status(201).json(r)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const updateReport = async (req: Request, res: Response) => {
  const { id } = req.params
  if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' })
  const payload = req.body
  const sanitizedPayload = {
    ...payload,
    titre: payload.titre || payload.title,
    objectif: payload.objectif || payload.objective,
    protocole: payload.protocole || payload.protocol,
    resultats: payload.resultats || payload.results,
    projetId: payload.projetId || payload.projectId,
    chercheurId: payload.chercheurId || payload.researcherId,
    statut: payload.statut || payload.status
  }
  try {
    const r = await Report.findByIdAndUpdate(id, sanitizedPayload, { new: true })
    if (!r) return res.status(404).json({ message: 'Not found' })
    res.json(r)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const deleteReport = async (req: Request, res: Response) => {
  const { id } = req.params
  if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' })
  await Report.findByIdAndDelete(id)
  res.status(204).send()
}

export const submitReport = async (req: Request, res: Response) => {
  const { id } = req.params
  if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' })
  const r = await Report.findByIdAndUpdate(id, { statut: 'soumis' }, { new: true })
  if (!r) return res.status(404).json({ message: 'Not found' })
  res.json(r)
}

export const validateReport = async (req: Request, res: Response) => {
  const { id } = req.params
  if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' })
  const r = await Report.findByIdAndUpdate(id, { statut: 'validé' }, { new: true })
  if (!r) return res.status(404).json({ message: 'Not found' })
  res.json(r)
}

export const statsByStatus = async (_req: Request, res: Response) => {
  const data = await Report.aggregate([
    { $group: { _id: '$statut', count: { $sum: 1 } } }
  ])
  res.json(data)
}

export const productiveResearchers = async (_req: Request, res: Response) => {
  const data = await Report.aggregate([
    { $match: { statut: 'validé' } },
    { $group: { _id: '$chercheurId', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ])
  res.json(data)
}
