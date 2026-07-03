/*
  Research Laboratory Management System
  Script 07 - Requetes de test

  Ce fichier ne cree pas d'objets metier.
  Il sert uniquement a verifier les tables, triggers et procedures.
*/

-- Afficher tous les chercheurs.
SELECT id_chercheur, nom, prenom, email, grade, specialite
FROM chercheur
ORDER BY id_chercheur;

-- Afficher tous les projets.
SELECT id_projet, intitule, budget, statut, specialite
FROM projet_recherche
ORDER BY id_projet;

-- Afficher tous les equipements.
SELECT id_equipement, designation, reference, etat
FROM equipement
ORDER BY id_equipement;

-- Afficher les affectations chercheurs / projets.
SELECT
  c.nom,
  c.prenom,
  p.intitule AS projet,
  cp.role_projet,
  cp.date_affectation
FROM chercheur_projet cp
JOIN chercheur c ON c.id_chercheur = cp.id_chercheur
JOIN projet_recherche p ON p.id_projet = cp.id_projet
ORDER BY p.intitule, c.nom;

-- Afficher les affectations projets / equipements.
SELECT
  p.intitule AS projet,
  e.designation AS equipement,
  e.reference,
  e.etat,
  pe.date_affectation,
  pe.date_retour_prevue
FROM projet_equipement pe
JOIN projet_recherche p ON p.id_projet = pe.id_projet
JOIN equipement e ON e.id_equipement = pe.id_equipement
ORDER BY p.intitule, e.designation;

-- Verifier les projets en cours avec le nombre de chercheurs.
SELECT
  p.intitule,
  p.budget,
  COUNT(cp.id_chercheur) AS nombre_chercheurs
FROM projet_recherche p
LEFT JOIN chercheur_projet cp ON cp.id_projet = p.id_projet
WHERE p.statut = 'en cours'
GROUP BY p.intitule, p.budget
ORDER BY p.intitule;

-- Test du trigger: un equipement disponible affecte a un projet en cours passe en utilisation.
SELECT id_equipement, designation, reference, etat
FROM equipement
WHERE reference = 'IMP3D-PRO-7';

UPDATE equipement
SET etat = 'disponible'
WHERE reference = 'IMP3D-PRO-7';

INSERT INTO projet_equipement (
  id_projet_equipement, id_projet, id_equipement, date_affectation, date_retour_prevue
) VALUES (
  seq_projet_equipement.NEXTVAL,
  (SELECT id_projet FROM projet_recherche WHERE intitule = 'Plateforme d analyse de donnees cliniques'),
  (SELECT id_equipement FROM equipement WHERE reference = 'IMP3D-PRO-7'),
  SYSDATE,
  SYSDATE + 30
);

SELECT id_equipement, designation, reference, etat
FROM equipement
WHERE reference = 'IMP3D-PRO-7';

ROLLBACK;

-- Test de la procedure avec SQL Developer / SQL*Plus.
VARIABLE rc REFCURSOR;
EXEC prc_projets_en_cours(:rc);
PRINT rc;
