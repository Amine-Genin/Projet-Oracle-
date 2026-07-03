-- ==========================================================
-- SEQUENCES ORACLE 11g
-- Génération automatique des identifiants (ID)
-- Utilisées avec NEXTVAL lors des insertions.
-- ==========================================================

-- Séquence pour les chercheurs
CREATE SEQUENCE seq_chercheur
  START WITH 1      -- Premier ID
  INCREMENT BY 1    -- Incrément de 1
  NOCACHE           -- Pas de mise en cache
  NOCYCLE;          -- Ne recommence pas à 1

-- Séquence pour les projets
CREATE SEQUENCE seq_projet
  START WITH 1
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;

-- Séquence pour les équipements
CREATE SEQUENCE seq_equipement
  START WITH 1
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;

-- Séquence pour la table chercheur_projet (si un ID est utilisé)
CREATE SEQUENCE seq_chercheur_projet
  START WITH 1
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;

-- Séquence pour la table projet_equipement (si un ID est utilisé)
CREATE SEQUENCE seq_projet_equipement
  START WITH 1
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;