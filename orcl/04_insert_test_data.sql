/*
  Research Laboratory Management System
  Script 04 - Donnees de test

  Les insertions utilisent les sequences Oracle 11g.
*/

INSERT INTO chercheur (
  id_chercheur, nom, prenom, email, grade, specialite, date_recrutement
) VALUES (
  seq_chercheur.NEXTVAL, 'Dupont', 'Alice', 'alice.dupont@laboratoire.test',
  'Professeur', 'Biotechnologie', TO_DATE('2021-09-01', 'YYYY-MM-DD')
);

INSERT INTO chercheur VALUES (
  seq_chercheur.NEXTVAL, 'Martin', 'Karim', 'karim.martin@laboratoire.test',
  'Maitre de conferences', 'Analyse de donnees', TO_DATE('2022-02-15', 'YYYY-MM-DD')
);

INSERT INTO chercheur VALUES (
  seq_chercheur.NEXTVAL, 'Bernard', 'Nadia', 'nadia.bernard@laboratoire.test',
  'Doctorant', 'Capteurs intelligents', TO_DATE('2023-10-01', 'YYYY-MM-DD')
);

INSERT INTO chercheur VALUES (
  seq_chercheur.NEXTVAL, 'El Amrani', 'Youssef', 'youssef.elamrani@laboratoire.test',
  'Ingenieur', 'Systemes embarques', TO_DATE('2020-03-20', 'YYYY-MM-DD')
);

INSERT INTO chercheur VALUES (
  seq_chercheur.NEXTVAL, 'Moreau', 'Sara', 'sara.moreau@laboratoire.test',
  'Technicien', 'Instrumentation', TO_DATE('2019-11-05', 'YYYY-MM-DD')
);

INSERT INTO projet_recherche (
  id_projet, intitule, description, date_debut, date_fin, budget, statut, specialite
) VALUES (
  seq_projet.NEXTVAL,
  'Developpement de capteurs biomedicaux',
  'Conception et validation de capteurs pour le suivi de parametres biologiques.',
  TO_DATE('2026-01-15', 'YYYY-MM-DD'),
  TO_DATE('2026-12-20', 'YYYY-MM-DD'),
  180000,
  'en cours',
  'Capteurs intelligents'
);

INSERT INTO projet_recherche VALUES (
  seq_projet.NEXTVAL,
  'Plateforme d analyse de donnees cliniques',
  'Collecte, traitement et visualisation de donnees experimentales.',
  TO_DATE('2026-02-01', 'YYYY-MM-DD'),
  TO_DATE('2027-02-01', 'YYYY-MM-DD'),
  240000,
  'en cours',
  'Analyse de donnees'
);

INSERT INTO projet_recherche VALUES (
  seq_projet.NEXTVAL,
  'Valorisation de protocoles biotechnologiques',
  'Optimisation de protocoles de culture et de conservation.',
  TO_DATE('2025-09-10', 'YYYY-MM-DD'),
  TO_DATE('2026-05-30', 'YYYY-MM-DD'),
  95000,
  'cloture',
  'Biotechnologie'
);

INSERT INTO projet_recherche VALUES (
  seq_projet.NEXTVAL,
  'Robotique de laboratoire',
  'Automatisation des manipulations repetitives en laboratoire.',
  TO_DATE('2026-04-01', 'YYYY-MM-DD'),
  TO_DATE('2027-04-01', 'YYYY-MM-DD'),
  310000,
  'planifie',
  'Systemes embarques'
);

INSERT INTO projet_recherche VALUES (
  seq_projet.NEXTVAL,
  'Maintenance intelligente des equipements',
  'Suivi des pannes et prediction des besoins de maintenance.',
  TO_DATE('2026-03-01', 'YYYY-MM-DD'),
  TO_DATE('2026-11-30', 'YYYY-MM-DD'),
  125000,
  'en cours',
  'Instrumentation'
);

INSERT INTO equipement (
  id_equipement, designation, reference, etat, date_acquisition
) VALUES (
  seq_equipement.NEXTVAL, 'Microscope electronique', 'MIC-EL-2026',
  'disponible', TO_DATE('2024-05-12', 'YYYY-MM-DD')
);

INSERT INTO equipement VALUES (
  seq_equipement.NEXTVAL, 'Station de calcul GPU', 'GPU-LAB-01',
  'disponible', TO_DATE('2023-07-18', 'YYYY-MM-DD')
);

INSERT INTO equipement VALUES (
  seq_equipement.NEXTVAL, 'Imprimante 3D de precision', 'IMP3D-PRO-7',
  'maintenance', TO_DATE('2022-12-03', 'YYYY-MM-DD')
);

INSERT INTO equipement VALUES (
  seq_equipement.NEXTVAL, 'Centrifugeuse refrigerante', 'CENT-REF-11',
  'disponible', TO_DATE('2021-04-22', 'YYYY-MM-DD')
);

INSERT INTO equipement VALUES (
  seq_equipement.NEXTVAL, 'Capteur multi-parametres', 'CAP-MULTI-05',
  'disponible', TO_DATE('2025-01-10', 'YYYY-MM-DD')
);

INSERT INTO chercheur_projet VALUES (
  seq_chercheur_projet.NEXTVAL,
  (SELECT id_chercheur FROM chercheur WHERE email = 'alice.dupont@laboratoire.test'),
  (SELECT id_projet FROM projet_recherche WHERE intitule = 'Valorisation de protocoles biotechnologiques'),
  TO_DATE('2025-09-12', 'YYYY-MM-DD'),
  'Responsable scientifique'
);

INSERT INTO chercheur_projet VALUES (
  seq_chercheur_projet.NEXTVAL,
  (SELECT id_chercheur FROM chercheur WHERE email = 'karim.martin@laboratoire.test'),
  (SELECT id_projet FROM projet_recherche WHERE intitule = 'Plateforme d analyse de donnees cliniques'),
  TO_DATE('2026-02-05', 'YYYY-MM-DD'),
  'Chercheur principal'
);

INSERT INTO chercheur_projet VALUES (
  seq_chercheur_projet.NEXTVAL,
  (SELECT id_chercheur FROM chercheur WHERE email = 'nadia.bernard@laboratoire.test'),
  (SELECT id_projet FROM projet_recherche WHERE intitule = 'Developpement de capteurs biomedicaux'),
  TO_DATE('2026-01-18', 'YYYY-MM-DD'),
  'Doctorant'
);

INSERT INTO chercheur_projet VALUES (
  seq_chercheur_projet.NEXTVAL,
  (SELECT id_chercheur FROM chercheur WHERE email = 'youssef.elamrani@laboratoire.test'),
  (SELECT id_projet FROM projet_recherche WHERE intitule = 'Robotique de laboratoire'),
  TO_DATE('2026-04-05', 'YYYY-MM-DD'),
  'Chercheur associe'
);

INSERT INTO chercheur_projet VALUES (
  seq_chercheur_projet.NEXTVAL,
  (SELECT id_chercheur FROM chercheur WHERE email = 'sara.moreau@laboratoire.test'),
  (SELECT id_projet FROM projet_recherche WHERE intitule = 'Maintenance intelligente des equipements'),
  TO_DATE('2026-03-03', 'YYYY-MM-DD'),
  'Technicien'
);

INSERT INTO projet_equipement VALUES (
  seq_projet_equipement.NEXTVAL,
  (SELECT id_projet FROM projet_recherche WHERE intitule = 'Developpement de capteurs biomedicaux'),
  (SELECT id_equipement FROM equipement WHERE reference = 'CAP-MULTI-05'),
  TO_DATE('2026-01-20', 'YYYY-MM-DD'),
  TO_DATE('2026-06-30', 'YYYY-MM-DD')
);

INSERT INTO projet_equipement VALUES (
  seq_projet_equipement.NEXTVAL,
  (SELECT id_projet FROM projet_recherche WHERE intitule = 'Plateforme d analyse de donnees cliniques'),
  (SELECT id_equipement FROM equipement WHERE reference = 'GPU-LAB-01'),
  TO_DATE('2026-02-08', 'YYYY-MM-DD'),
  TO_DATE('2026-12-31', 'YYYY-MM-DD')
);

INSERT INTO projet_equipement VALUES (
  seq_projet_equipement.NEXTVAL,
  (SELECT id_projet FROM projet_recherche WHERE intitule = 'Valorisation de protocoles biotechnologiques'),
  (SELECT id_equipement FROM equipement WHERE reference = 'CENT-REF-11'),
  TO_DATE('2025-09-15', 'YYYY-MM-DD'),
  TO_DATE('2026-04-30', 'YYYY-MM-DD')
);

INSERT INTO projet_equipement VALUES (
  seq_projet_equipement.NEXTVAL,
  (SELECT id_projet FROM projet_recherche WHERE intitule = 'Maintenance intelligente des equipements'),
  (SELECT id_equipement FROM equipement WHERE reference = 'MIC-EL-2026'),
  TO_DATE('2026-03-06', 'YYYY-MM-DD'),
  TO_DATE('2026-10-15', 'YYYY-MM-DD')
);

COMMIT;
