export const projects = [
  { id: 'p1', name: 'Developpement de capteurs biomedicaux', intitule: 'Developpement de capteurs biomedicaux', researcherId: 'c3' },
  { id: 'p2', name: 'Plateforme d analyse de donnees cliniques', intitule: 'Plateforme d analyse de donnees cliniques', researcherId: 'c2' },
  { id: 'p3', name: 'Valorisation de protocoles biotechnologiques', intitule: 'Valorisation de protocoles biotechnologiques', researcherId: 'c1' }
]

export const researchers = [
  { id: 'c1', name: 'Alice Dupont', prenom: 'Alice', nom: 'Dupont', email: 'alice.dupont@laboratoire.test' },
  { id: 'c2', name: 'Karim Martin', prenom: 'Karim', nom: 'Martin', email: 'karim.martin@laboratoire.test' },
  { id: 'c3', name: 'Nadia Bernard', prenom: 'Nadia', nom: 'Bernard', email: 'nadia.bernard@laboratoire.test' }
]

export const affectations = [
  { id: 'a1', chercheurId: 'c1', projetId: 'p3' },
  { id: 'a2', chercheurId: 'c2', projetId: 'p2' },
  { id: 'a3', chercheurId: 'c3', projetId: 'p1' }
]
