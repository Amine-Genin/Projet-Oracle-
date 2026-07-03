import { Router, Request, Response } from 'express'
import {
  Affectation,
  Chercheur,
  Equipement,
  ProjetRecherche,
  Reservation,
  affectations,
  chercheurs,
  equipements,
  projets,
  reservations
} from '../data/oracleMockData'

const router = Router()

type Entity = { id: string }

const nextId = (prefix: string, items: Entity[]) => {
  const max = items.reduce((current, item) => {
    const value = Number(item.id.replace(prefix, ''))
    return Number.isNaN(value) ? current : Math.max(current, value)
  }, 0)

  return `${prefix}${max + 1}`
}

const getAll = <T>(items: T[]) => (_req: Request, res: Response) => {
  res.json(items)
}

const getById = <T extends Entity>(items: T[]) => (req: Request, res: Response) => {
  const item = items.find((entry) => entry.id === req.params.id)
  if (!item) return res.status(404).json({ message: 'Ressource introuvable' })
  return res.json(item)
}

const createItem = <T extends Entity>(items: T[], prefix: string) => (req: Request, res: Response) => {
  const item = {
    ...req.body,
    id: req.body.id || nextId(prefix, items)
  } as T

  items.push(item)
  return res.status(201).json(item)
}

const updateItem = <T extends Entity>(items: T[]) => (req: Request, res: Response) => {
  const index = items.findIndex((entry) => entry.id === req.params.id)
  if (index === -1) return res.status(404).json({ message: 'Ressource introuvable' })

  items[index] = {
    ...items[index],
    ...req.body,
    id: req.params.id
  }

  return res.json(items[index])
}

const deleteItem = <T extends Entity>(items: T[]) => (req: Request, res: Response) => {
  const index = items.findIndex((entry) => entry.id === req.params.id)
  if (index === -1) return res.status(404).json({ message: 'Ressource introuvable' })

  items.splice(index, 1)
  return res.status(204).send()
}

router.get('/chercheurs', getAll<Chercheur>(chercheurs))
router.get('/chercheurs/:id', getById<Chercheur>(chercheurs))
router.post('/chercheurs', createItem<Chercheur>(chercheurs, 'c'))
router.put('/chercheurs/:id', updateItem<Chercheur>(chercheurs))
router.delete('/chercheurs/:id', deleteItem<Chercheur>(chercheurs))

router.get('/projets', getAll<ProjetRecherche>(projets))
router.get('/projets/:id', getById<ProjetRecherche>(projets))
router.post('/projets', createItem<ProjetRecherche>(projets, 'p'))
router.put('/projets/:id', updateItem<ProjetRecherche>(projets))
router.delete('/projets/:id', deleteItem<ProjetRecherche>(projets))

router.get('/equipements', getAll<Equipement>(equipements))
router.get('/equipements/:id', getById<Equipement>(equipements))
router.post('/equipements', createItem<Equipement>(equipements, 'e'))
router.put('/equipements/:id', updateItem<Equipement>(equipements))
router.delete('/equipements/:id', deleteItem<Equipement>(equipements))

router.get('/affectations', getAll<Affectation>(affectations))
router.post('/affectations', createItem<Affectation>(affectations, 'a'))
router.delete('/affectations/:id', deleteItem<Affectation>(affectations))

router.get('/reservations', getAll<Reservation>(reservations))
router.post('/reservations', (req: Request, res: Response) => {
  const reservation: Reservation = {
    ...req.body,
    id: req.body.id || nextId('r', reservations)
  }

  reservations.push(reservation)

  const projet = projets.find((entry) => entry.id === reservation.projetId)
  const equipement = equipements.find((entry) => entry.id === reservation.equipementId)

  if (projet?.statut === 'en cours' && equipement) {
    equipement.etat = 'en utilisation'
  }

  return res.status(201).json(reservation)
})
router.delete('/reservations/:id', deleteItem<Reservation>(reservations))

router.get('/stats/projets-actifs', (_req: Request, res: Response) => {
  const stats = projets
    .filter((projet) => projet.statut === 'en cours')
    .reduce<Record<string, { specialite: string; nombreProjetsActifs: number; budgetTotalEngage: number }>>((acc, projet) => {
      if (!acc[projet.specialite]) {
        acc[projet.specialite] = {
          specialite: projet.specialite,
          nombreProjetsActifs: 0,
          budgetTotalEngage: 0
        }
      }

      acc[projet.specialite].nombreProjetsActifs += 1
      acc[projet.specialite].budgetTotalEngage += projet.budget
      return acc
    }, {})

  res.json(Object.values(stats))
})

router.get('/stats/projets-chercheurs', (_req: Request, res: Response) => {
  const stats = projets.map((projet) => ({
    projet: projet.intitule,
    budget: projet.budget,
    nombreChercheursAffectes: affectations.filter((affectation) => affectation.projetId === projet.id).length
  }))

  res.json(stats)
})

export default router
