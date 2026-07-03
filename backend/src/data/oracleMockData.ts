export type Chercheur = {
  id: string
  nom: string
  prenom: string
  email: string
  grade: string
  specialite: string
}

export type ProjetRecherche = {
  id: string
  intitule: string
  dateDebut: string
  dateFin: string
  budget: number
  statut: string
  specialite: string
}

export type Equipement = {
  id: string
  designation: string
  reference: string
  etat: string
}

export type Affectation = {
  id: string
  chercheurId: string
  projetId: string
  dateAffectation: string
  roleProjet: string
}

export type Reservation = {
  id: string
  equipementId: string
  projetId: string
  dateReservation: string
  dateRetourPrevue: string
  statutReservation: string
}

export const chercheurs: Chercheur[] = [
  {
    id: 'c1',
    nom: 'Dupont',
    prenom: 'Alice',
    email: 'alice.dupont@laboratoire.test',
    grade: 'Professeur',
    specialite: 'Biotechnologie'
  },
  {
    id: 'c2',
    nom: 'Martin',
    prenom: 'Karim',
    email: 'karim.martin@laboratoire.test',
    grade: 'Maître de conférences',
    specialite: 'Analyse de données'
  },
  {
    id: 'c3',
    nom: 'Bernard',
    prenom: 'Nadia',
    email: 'nadia.bernard@laboratoire.test',
    grade: 'Doctorante',
    specialite: 'Capteurs intelligents'
  }
]

export const projets: ProjetRecherche[] = [
  {
    id: 'p1',
    intitule: 'Développement de capteurs biomédicaux',
    dateDebut: '2026-01-15',
    dateFin: '2026-12-20',
    budget: 180000,
    statut: 'en cours',
    specialite: 'Capteurs intelligents'
  },
  {
    id: 'p2',
    intitule: 'Plateforme d analyse de données cliniques',
    dateDebut: '2026-02-01',
    dateFin: '2027-02-01',
    budget: 240000,
    statut: 'en cours',
    specialite: 'Analyse de données'
  },
  {
    id: 'p3',
    intitule: 'Valorisation de protocoles biotechnologiques',
    dateDebut: '2025-09-10',
    dateFin: '2026-05-30',
    budget: 95000,
    statut: 'clôturé',
    specialite: 'Biotechnologie'
  }
]

export const equipements: Equipement[] = [
  {
    id: 'e1',
    designation: 'Microscope électronique',
    reference: 'MIC-EL-2026',
    etat: 'disponible'
  },
  {
    id: 'e2',
    designation: 'Station de calcul',
    reference: 'GPU-LAB-01',
    etat: 'disponible'
  },
  {
    id: 'e3',
    designation: 'Imprimante 3D de précision',
    reference: 'IMP3D-PRO-7',
    etat: 'maintenance'
  }
]

export const affectations: Affectation[] = [
  {
    id: 'a1',
    chercheurId: 'c1',
    projetId: 'p3',
    dateAffectation: '2025-09-12',
    roleProjet: 'Responsable scientifique'
  },
  {
    id: 'a2',
    chercheurId: 'c2',
    projetId: 'p2',
    dateAffectation: '2026-02-05',
    roleProjet: 'Analyste principal'
  },
  {
    id: 'a3',
    chercheurId: 'c3',
    projetId: 'p1',
    dateAffectation: '2026-01-18',
    roleProjet: 'Chercheur associé'
  }
]

export const reservations: Reservation[] = [
  {
    id: 'r1',
    equipementId: 'e2',
    projetId: 'p2',
    dateReservation: '2026-03-10',
    dateRetourPrevue: '2026-03-20',
    statutReservation: 'confirmée'
  }
]
