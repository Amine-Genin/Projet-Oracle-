import { Router, Request, Response, NextFunction } from 'express'
import oracledb from 'oracledb'
import { executeQuery, withOracleConnection } from '../config/oracle'
import {
  mapAffectation,
  mapChercheur,
  mapEquipement,
  mapProjet,
  mapReservation,
  prepareAffectationInsert,
  prepareChercheurInsert,
  prepareChercheurUpdate,
  prepareEquipementInsert,
  prepareEquipementUpdate,
  prepareProjetInsert,
  prepareProjetUpdate,
  prepareReservationInsert
} from '../utils/oracleMappers'

const router = Router()

const handleOracleError = (error: unknown, res: Response) => {
  const err = error as { message?: string; errorNum?: number; code?: string }
  console.error('Oracle error:', err)

  if (err.code === 'NJS-040') {
    return res.status(503).json({
      message: 'Oracle est surchargé ou indisponible. Réessayez dans quelques secondes.'
    })
  }
  if (err.errorNum === 1) {
    return res.status(409).json({ message: 'Enregistrement en doublon (contrainte unique violée).' })
  }
  if (err.errorNum === 2292) {
    return res.status(409).json({ message: 'Suppression impossible : des enregistrements liés existent encore.' })
  }
  if (err.errorNum === 2290 || err.errorNum === 2291) {
    return res.status(400).json({ message: err.message || 'Contrainte Oracle violée.' })
  }

  return res.status(500).json({ message: err.message || 'Erreur Oracle' })
}

const asyncHandler = (handler: (req: Request, res: Response) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    handler(req, res).catch((error) => {
      if (res.headersSent) return next(error)
      handleOracleError(error, res)
    })
  }

const asRows = (rows: unknown) => (rows || []) as Record<string, unknown>[]

router.get('/dashboard', asyncHandler(async (_req, res) => {
  const payload = await withOracleConnection(async (connection) => {
    const options = { outFormat: oracledb.OUT_FORMAT_OBJECT }

    const countsResult = await connection.execute(
      `SELECT
        (SELECT COUNT(*) FROM chercheur) AS nb_chercheurs,
        (SELECT COUNT(*) FROM projet_recherche) AS nb_projets,
        (SELECT COUNT(*) FROM equipement) AS nb_equipements
       FROM DUAL`,
      {},
      options
    )
    const countsRow = countsResult.rows?.[0] as Record<string, unknown> | undefined

    const statsActifsResult = await connection.execute(
      `SELECT specialite,
              COUNT(*) AS nombre_projets_actifs,
              SUM(budget) AS budget_total_engage
       FROM projet_recherche
       WHERE statut = 'en cours'
       GROUP BY specialite
       ORDER BY specialite`,
      {},
      options
    )

    const statsProjetsChercheursResult = await connection.execute(
      `SELECT p.intitule AS projet,
              p.budget,
              COUNT(cp.id_chercheur) AS nombre_chercheurs_affectes
       FROM projet_recherche p
       LEFT JOIN chercheur_projet cp ON cp.id_projet = p.id_projet
       GROUP BY p.id_projet, p.intitule, p.budget
       ORDER BY p.intitule`,
      {},
      options
    )

    return {
      counts: {
        chercheurs: Number(countsRow?.NB_CHERCHEURS ?? 0),
        projets: Number(countsRow?.NB_PROJETS ?? 0),
        equipements: Number(countsRow?.NB_EQUIPEMENTS ?? 0)
      },
      statsActifs: asRows(statsActifsResult.rows).map((row) => ({
        specialite: row.SPECIALITE,
        nombreProjetsActifs: Number(row.NOMBRE_PROJETS_ACTIFS ?? 0),
        budgetTotalEngage: Number(row.BUDGET_TOTAL_ENGAGE ?? 0)
      })),
      statsProjetsChercheurs: asRows(statsProjetsChercheursResult.rows).map((row) => ({
        projet: row.PROJET,
        budget: Number(row.BUDGET ?? 0),
        nombreChercheursAffectes: Number(row.NOMBRE_CHERCHEURS_AFFECTES ?? 0)
      }))
    }
  })

  res.json(payload)
}))

router.get('/chercheurs', asyncHandler(async (_req, res) => {
  const result = await executeQuery(
    `SELECT id_chercheur, nom, prenom, email, grade, specialite
     FROM chercheur
     ORDER BY id_chercheur`
  )
  res.json(asRows(result.rows).map(mapChercheur))
}))

router.get('/chercheurs/:id', asyncHandler(async (req, res) => {
  const result = await executeQuery(
    `SELECT id_chercheur, nom, prenom, email, grade, specialite
     FROM chercheur
     WHERE id_chercheur = :id`,
    { id: Number(req.params.id) }
  )
  const row = result.rows?.[0] as Record<string, unknown> | undefined
  if (!row) return res.status(404).json({ message: 'Ressource introuvable' })
  res.json(mapChercheur(row))
}))

router.post('/chercheurs', asyncHandler(async (req, res) => {
  const data = prepareChercheurInsert(req.body)
  const result = await executeQuery(
    `INSERT INTO chercheur (id_chercheur, nom, prenom, email, grade, specialite)
     VALUES (seq_chercheur.NEXTVAL, :nom, :prenom, :email, :grade, :specialite)
     RETURNING id_chercheur INTO :id`,
    { ...data, id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER } },
    { autoCommit: true }
  )
  const id = (result.outBinds as { id: number[] }).id[0]
  const created = await executeQuery(
    `SELECT id_chercheur, nom, prenom, email, grade, specialite
     FROM chercheur WHERE id_chercheur = :id`,
    { id }
  )
  res.status(201).json(mapChercheur(created.rows![0] as Record<string, unknown>))
}))

router.put('/chercheurs/:id', asyncHandler(async (req, res) => {
  const data = prepareChercheurUpdate(req.body)
  const result = await executeQuery(
    `UPDATE chercheur
     SET nom = :nom, prenom = :prenom, email = :email, grade = :grade, specialite = :specialite
     WHERE id_chercheur = :id`,
    { ...data, id: Number(req.params.id) },
    { autoCommit: true }
  )
  if ((result.rowsAffected ?? 0) === 0) {
    return res.status(404).json({ message: 'Ressource introuvable' })
  }
  const updated = await executeQuery(
    `SELECT id_chercheur, nom, prenom, email, grade, specialite
     FROM chercheur WHERE id_chercheur = :id`,
    { id: Number(req.params.id) }
  )
  res.json(mapChercheur(updated.rows![0] as Record<string, unknown>))
}))

router.delete('/chercheurs/:id', asyncHandler(async (req, res) => {
  const result = await executeQuery(
    `DELETE FROM chercheur WHERE id_chercheur = :id`,
    { id: Number(req.params.id) },
    { autoCommit: true }
  )
  if ((result.rowsAffected ?? 0) === 0) {
    return res.status(404).json({ message: 'Ressource introuvable' })
  }
  res.status(204).send()
}))

router.get('/projets', asyncHandler(async (_req, res) => {
  const result = await executeQuery(
    `SELECT id_projet, intitule, date_debut, date_fin, budget, statut, specialite
     FROM projet_recherche
     ORDER BY id_projet`
  )
  res.json(asRows(result.rows).map(mapProjet))
}))

router.get('/projets/:id', asyncHandler(async (req, res) => {
  const result = await executeQuery(
    `SELECT id_projet, intitule, date_debut, date_fin, budget, statut, specialite
     FROM projet_recherche
     WHERE id_projet = :id`,
    { id: Number(req.params.id) }
  )
  const row = result.rows?.[0] as Record<string, unknown> | undefined
  if (!row) return res.status(404).json({ message: 'Ressource introuvable' })
  res.json(mapProjet(row))
}))

router.post('/projets', asyncHandler(async (req, res) => {
  const data = prepareProjetInsert(req.body)
  const result = await executeQuery(
    `INSERT INTO projet_recherche (id_projet, intitule, date_debut, date_fin, budget, statut, specialite)
     VALUES (seq_projet.NEXTVAL, :intitule, :dateDebut, :dateFin, :budget, :statut, :specialite)
     RETURNING id_projet INTO :id`,
    { ...data, id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER } },
    { autoCommit: true }
  )
  const id = (result.outBinds as { id: number[] }).id[0]
  const created = await executeQuery(
    `SELECT id_projet, intitule, date_debut, date_fin, budget, statut, specialite
     FROM projet_recherche WHERE id_projet = :id`,
    { id }
  )
  res.status(201).json(mapProjet(created.rows![0] as Record<string, unknown>))
}))

router.put('/projets/:id', asyncHandler(async (req, res) => {
  const data = prepareProjetUpdate(req.body)
  const result = await executeQuery(
    `UPDATE projet_recherche
     SET intitule = :intitule, date_debut = :dateDebut, date_fin = :dateFin,
         budget = :budget, statut = :statut, specialite = :specialite
     WHERE id_projet = :id`,
    { ...data, id: Number(req.params.id) },
    { autoCommit: true }
  )
  if ((result.rowsAffected ?? 0) === 0) {
    return res.status(404).json({ message: 'Ressource introuvable' })
  }
  const updated = await executeQuery(
    `SELECT id_projet, intitule, date_debut, date_fin, budget, statut, specialite
     FROM projet_recherche WHERE id_projet = :id`,
    { id: Number(req.params.id) }
  )
  res.json(mapProjet(updated.rows![0] as Record<string, unknown>))
}))

router.delete('/projets/:id', asyncHandler(async (req, res) => {
  const result = await executeQuery(
    `DELETE FROM projet_recherche WHERE id_projet = :id`,
    { id: Number(req.params.id) },
    { autoCommit: true }
  )
  if ((result.rowsAffected ?? 0) === 0) {
    return res.status(404).json({ message: 'Ressource introuvable' })
  }
  res.status(204).send()
}))

router.get('/equipements', asyncHandler(async (_req, res) => {
  const result = await executeQuery(
    `SELECT id_equipement, designation, reference, etat
     FROM equipement
     ORDER BY id_equipement`
  )
  res.json(asRows(result.rows).map(mapEquipement))
}))

router.get('/equipements/:id', asyncHandler(async (req, res) => {
  const result = await executeQuery(
    `SELECT id_equipement, designation, reference, etat
     FROM equipement
     WHERE id_equipement = :id`,
    { id: Number(req.params.id) }
  )
  const row = result.rows?.[0] as Record<string, unknown> | undefined
  if (!row) return res.status(404).json({ message: 'Ressource introuvable' })
  res.json(mapEquipement(row))
}))

router.post('/equipements', asyncHandler(async (req, res) => {
  const data = prepareEquipementInsert(req.body)
  const result = await executeQuery(
    `INSERT INTO equipement (id_equipement, designation, reference, etat)
     VALUES (seq_equipement.NEXTVAL, :designation, :reference, :etat)
     RETURNING id_equipement INTO :id`,
    { ...data, id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER } },
    { autoCommit: true }
  )
  const id = (result.outBinds as { id: number[] }).id[0]
  const created = await executeQuery(
    `SELECT id_equipement, designation, reference, etat
     FROM equipement WHERE id_equipement = :id`,
    { id }
  )
  res.status(201).json(mapEquipement(created.rows![0] as Record<string, unknown>))
}))

router.put('/equipements/:id', asyncHandler(async (req, res) => {
  const data = prepareEquipementUpdate(req.body)
  const result = await executeQuery(
    `UPDATE equipement
     SET designation = :designation, reference = :reference, etat = :etat
     WHERE id_equipement = :id`,
    { ...data, id: Number(req.params.id) },
    { autoCommit: true }
  )
  if ((result.rowsAffected ?? 0) === 0) {
    return res.status(404).json({ message: 'Ressource introuvable' })
  }
  const updated = await executeQuery(
    `SELECT id_equipement, designation, reference, etat
     FROM equipement WHERE id_equipement = :id`,
    { id: Number(req.params.id) }
  )
  res.json(mapEquipement(updated.rows![0] as Record<string, unknown>))
}))

router.delete('/equipements/:id', asyncHandler(async (req, res) => {
  const result = await executeQuery(
    `DELETE FROM equipement WHERE id_equipement = :id`,
    { id: Number(req.params.id) },
    { autoCommit: true }
  )
  if ((result.rowsAffected ?? 0) === 0) {
    return res.status(404).json({ message: 'Ressource introuvable' })
  }
  res.status(204).send()
}))

router.get('/affectations', asyncHandler(async (_req, res) => {
  const result = await executeQuery(
    `SELECT id_chercheur_projet, id_chercheur, id_projet, date_affectation, role_projet
     FROM chercheur_projet
     ORDER BY id_chercheur_projet`
  )
  res.json(asRows(result.rows).map(mapAffectation))
}))

router.post('/affectations', asyncHandler(async (req, res) => {
  const data = prepareAffectationInsert(req.body)
  const result = await executeQuery(
    `INSERT INTO chercheur_projet (id_chercheur_projet, id_chercheur, id_projet, date_affectation, role_projet)
     VALUES (seq_chercheur_projet.NEXTVAL, :chercheurId, :projetId, :dateAffectation, :roleProjet)
     RETURNING id_chercheur_projet INTO :id`,
    { ...data, id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER } },
    { autoCommit: true }
  )
  const id = (result.outBinds as { id: number[] }).id[0]
  const created = await executeQuery(
    `SELECT id_chercheur_projet, id_chercheur, id_projet, date_affectation, role_projet
     FROM chercheur_projet WHERE id_chercheur_projet = :id`,
    { id }
  )
  res.status(201).json(mapAffectation(created.rows![0] as Record<string, unknown>))
}))

router.delete('/affectations/:id', asyncHandler(async (req, res) => {
  const result = await executeQuery(
    `DELETE FROM chercheur_projet WHERE id_chercheur_projet = :id`,
    { id: Number(req.params.id) },
    { autoCommit: true }
  )
  if ((result.rowsAffected ?? 0) === 0) {
    return res.status(404).json({ message: 'Ressource introuvable' })
  }
  res.status(204).send()
}))

router.get('/reservations', asyncHandler(async (_req, res) => {
  const result = await executeQuery(
    `SELECT id_projet_equipement, id_equipement, id_projet, date_affectation, date_retour_prevue
     FROM projet_equipement
     ORDER BY id_projet_equipement`
  )
  res.json(asRows(result.rows).map(mapReservation))
}))

router.post('/reservations', asyncHandler(async (req, res) => {
  const data = prepareReservationInsert(req.body)
  const result = await executeQuery(
    `INSERT INTO projet_equipement (id_projet_equipement, id_projet, id_equipement, date_affectation, date_retour_prevue)
     VALUES (seq_projet_equipement.NEXTVAL, :projetId, :equipementId, :dateAffectation, :dateRetourPrevue)
     RETURNING id_projet_equipement INTO :id`,
    { ...data, id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER } },
    { autoCommit: true }
  )
  const id = (result.outBinds as { id: number[] }).id[0]
  const created = await executeQuery(
    `SELECT id_projet_equipement, id_equipement, id_projet, date_affectation, date_retour_prevue
     FROM projet_equipement WHERE id_projet_equipement = :id`,
    { id }
  )
  res.status(201).json(mapReservation(created.rows![0] as Record<string, unknown>))
}))

router.delete('/reservations/:id', asyncHandler(async (req, res) => {
  const result = await executeQuery(
    `DELETE FROM projet_equipement WHERE id_projet_equipement = :id`,
    { id: Number(req.params.id) },
    { autoCommit: true }
  )
  if ((result.rowsAffected ?? 0) === 0) {
    return res.status(404).json({ message: 'Ressource introuvable' })
  }
  res.status(204).send()
}))

router.get('/stats/projets-actifs', asyncHandler(async (_req, res) => {
  const result = await executeQuery(
    `SELECT specialite,
            COUNT(*) AS nombre_projets_actifs,
            SUM(budget) AS budget_total_engage
     FROM projet_recherche
     WHERE statut = 'en cours'
     GROUP BY specialite
     ORDER BY specialite`
  )
  res.json(asRows(result.rows).map((row) => ({
    specialite: row.SPECIALITE,
    nombreProjetsActifs: Number(row.NOMBRE_PROJETS_ACTIFS ?? 0),
    budgetTotalEngage: Number(row.BUDGET_TOTAL_ENGAGE ?? 0)
  })))
}))

router.get('/stats/projets-chercheurs', asyncHandler(async (_req, res) => {
  const result = await executeQuery(
    `SELECT p.intitule AS projet,
            p.budget,
            COUNT(cp.id_chercheur) AS nombre_chercheurs_affectes
     FROM projet_recherche p
     LEFT JOIN chercheur_projet cp ON cp.id_projet = p.id_projet
     GROUP BY p.id_projet, p.intitule, p.budget
     ORDER BY p.intitule`
  )
  res.json(asRows(result.rows).map((row) => ({
    projet: row.PROJET,
    budget: Number(row.BUDGET ?? 0),
    nombreChercheursAffectes: Number(row.NOMBRE_CHERCHEURS_AFFECTES ?? 0)
  })))
}))

export default router
