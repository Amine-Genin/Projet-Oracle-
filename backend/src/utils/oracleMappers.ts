const formatDate = (value: unknown) => {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(String(value))
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toISOString().slice(0, 10)
}

const toId = (value: unknown) => String(value ?? '')

const fromDbStatut = (statut: string) => {
  if (statut === 'cloture') return 'clôturé'
  if (statut === 'planifie') return 'planifié'
  if (statut === 'suspendu') return 'suspendu'
  return statut
}

export const toDbStatut = (statut: string) => {
  const normalized = statut.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  if (normalized === 'cloture') return 'cloture'
  if (normalized === 'prevu' || normalized === 'planifie') return 'planifie'
  if (normalized === 'suspendu') return 'suspendu'
  return statut
}

const normalizeGrade = (grade: string) => {
  const normalized = grade.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (normalized.toLowerCase() === 'maitre de conferences') return 'Maitre de conferences'
  return grade
}

const normalizeRole = (role: string) => {
  const normalized = role.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (normalized.toLowerCase() === 'chercheur associe') return 'Chercheur associe'
  return role
}

export const mapChercheur = (row: Record<string, unknown>) => ({
  id: toId(row.ID_CHERCHEUR),
  nom: String(row.NOM ?? ''),
  prenom: String(row.PRENOM ?? ''),
  email: String(row.EMAIL ?? ''),
  grade: String(row.GRADE ?? ''),
  specialite: String(row.SPECIALITE ?? '')
})

export const mapProjet = (row: Record<string, unknown>) => ({
  id: toId(row.ID_PROJET),
  intitule: String(row.INTITULE ?? ''),
  dateDebut: formatDate(row.DATE_DEBUT),
  dateFin: formatDate(row.DATE_FIN),
  budget: Number(row.BUDGET ?? 0),
  statut: fromDbStatut(String(row.STATUT ?? '')),
  specialite: String(row.SPECIALITE ?? '')
})

export const mapEquipement = (row: Record<string, unknown>) => ({
  id: toId(row.ID_EQUIPEMENT),
  designation: String(row.DESIGNATION ?? ''),
  reference: String(row.REFERENCE ?? ''),
  etat: String(row.ETAT ?? '')
})

export const mapAffectation = (row: Record<string, unknown>) => ({
  id: toId(row.ID_CHERCHEUR_PROJET),
  chercheurId: toId(row.ID_CHERCHEUR),
  projetId: toId(row.ID_PROJET),
  dateAffectation: formatDate(row.DATE_AFFECTATION),
  roleProjet: String(row.ROLE_PROJET ?? '')
})

export const mapReservation = (row: Record<string, unknown>) => ({
  id: toId(row.ID_PROJET_EQUIPEMENT),
  equipementId: toId(row.ID_EQUIPEMENT),
  projetId: toId(row.ID_PROJET),
  dateReservation: formatDate(row.DATE_AFFECTATION),
  dateRetourPrevue: formatDate(row.DATE_RETOUR_PREVUE),
  statutReservation: 'confirmée'
})

export const prepareChercheurInsert = (body: Record<string, unknown>) => ({
  nom: String(body.nom ?? ''),
  prenom: String(body.prenom ?? ''),
  email: String(body.email ?? ''),
  grade: normalizeGrade(String(body.grade ?? '')),
  specialite: String(body.specialite ?? '')
})

export const prepareChercheurUpdate = prepareChercheurInsert

export const prepareProjetInsert = (body: Record<string, unknown>) => ({
  intitule: String(body.intitule ?? ''),
  dateDebut: body.dateDebut ? new Date(String(body.dateDebut)) : new Date(),
  dateFin: body.dateFin ? new Date(String(body.dateFin)) : null,
  budget: Number(body.budget ?? 0),
  statut: toDbStatut(String(body.statut ?? 'planifie')),
  specialite: String(body.specialite ?? '')
})

export const prepareProjetUpdate = prepareProjetInsert

export const prepareEquipementInsert = (body: Record<string, unknown>) => ({
  designation: String(body.designation ?? ''),
  reference: String(body.reference ?? ''),
  etat: String(body.etat ?? 'disponible')
})

export const prepareEquipementUpdate = prepareEquipementInsert

export const prepareAffectationInsert = (body: Record<string, unknown>) => ({
  chercheurId: Number(body.chercheurId),
  projetId: Number(body.projetId),
  dateAffectation: body.dateAffectation ? new Date(String(body.dateAffectation)) : new Date(),
  roleProjet: normalizeRole(String(body.roleProjet ?? 'Chercheur associe'))
})

export const prepareReservationInsert = (body: Record<string, unknown>) => ({
  equipementId: Number(body.equipementId),
  projetId: Number(body.projetId),
  dateAffectation: body.dateReservation ? new Date(String(body.dateReservation)) : new Date(),
  dateRetourPrevue: body.dateRetourPrevue ? new Date(String(body.dateRetourPrevue)) : null
})
