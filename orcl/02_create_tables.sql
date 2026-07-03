/*
  Research Laboratory Management System
  Script 02 - Creation des tables Oracle

  Ces tables gerent la partie relationnelle du laboratoire:
  chercheurs, projets, equipements et affectations.
  Les rapports d'experiences restent geres par MongoDB.
*/

CREATE TABLE chercheur (
  id_chercheur NUMBER(10) NOT NULL,
  nom VARCHAR2(80) NOT NULL,
  prenom VARCHAR2(80) NOT NULL,
  email VARCHAR2(150) NOT NULL,
  grade VARCHAR2(60) NOT NULL,
  specialite VARCHAR2(120),
  date_recrutement DATE DEFAULT SYSDATE NOT NULL,
  CONSTRAINT pk_chercheur PRIMARY KEY (id_chercheur),
  CONSTRAINT uk_chercheur_email UNIQUE (email),
  CONSTRAINT ck_chercheur_grade CHECK (
    grade IN ('Professeur', 'Maitre de conferences', 'Doctorant', 'Ingenieur', 'Technicien')
  )
);

CREATE TABLE projet_recherche (
  id_projet NUMBER(10) NOT NULL,
  intitule VARCHAR2(200) NOT NULL,
  description VARCHAR2(1000),
  date_debut DATE NOT NULL,
  date_fin DATE,
  budget NUMBER(12,2) DEFAULT 0 NOT NULL,
  statut VARCHAR2(30) DEFAULT 'planifie' NOT NULL,
  specialite VARCHAR2(120),
  CONSTRAINT pk_projet_recherche PRIMARY KEY (id_projet),
  CONSTRAINT uk_projet_intitule UNIQUE (intitule),
  CONSTRAINT ck_projet_dates CHECK (date_fin IS NULL OR date_fin >= date_debut),
  CONSTRAINT ck_projet_budget CHECK (budget >= 0),
  CONSTRAINT ck_projet_statut CHECK (statut IN ('planifie', 'en cours', 'suspendu', 'cloture'))
);

CREATE TABLE equipement (
  id_equipement NUMBER(10) NOT NULL,
  designation VARCHAR2(150) NOT NULL,
  reference VARCHAR2(80) NOT NULL,
  etat VARCHAR2(40) DEFAULT 'disponible' NOT NULL,
  date_acquisition DATE,
  CONSTRAINT pk_equipement PRIMARY KEY (id_equipement),
  CONSTRAINT uk_equipement_reference UNIQUE (reference),
  CONSTRAINT ck_equipement_etat CHECK (etat IN ('disponible', 'en utilisation', 'maintenance', 'hors service'))
);

CREATE TABLE chercheur_projet (
  id_chercheur_projet NUMBER(10) NOT NULL,
  id_chercheur NUMBER(10) NOT NULL,
  id_projet NUMBER(10) NOT NULL,
  date_affectation DATE DEFAULT SYSDATE NOT NULL,
  role_projet VARCHAR2(80) NOT NULL,
  CONSTRAINT pk_chercheur_projet PRIMARY KEY (id_chercheur_projet),
  CONSTRAINT uk_chercheur_projet UNIQUE (id_chercheur, id_projet),
  CONSTRAINT fk_cp_chercheur FOREIGN KEY (id_chercheur)
    REFERENCES chercheur (id_chercheur),
  CONSTRAINT fk_cp_projet FOREIGN KEY (id_projet)
    REFERENCES projet_recherche (id_projet),
  CONSTRAINT ck_cp_role CHECK (
    role_projet IN ('Responsable scientifique', 'Chercheur principal', 'Chercheur associe', 'Doctorant', 'Technicien')
  )
);

CREATE TABLE projet_equipement (
  id_projet_equipement NUMBER(10) NOT NULL,
  id_projet NUMBER(10) NOT NULL,
  id_equipement NUMBER(10) NOT NULL,
  date_affectation DATE DEFAULT SYSDATE NOT NULL,
  date_retour_prevue DATE,
  CONSTRAINT pk_projet_equipement PRIMARY KEY (id_projet_equipement),
  CONSTRAINT uk_projet_equipement UNIQUE (id_projet, id_equipement),
  CONSTRAINT fk_pe_projet FOREIGN KEY (id_projet)
    REFERENCES projet_recherche (id_projet),
  CONSTRAINT fk_pe_equipement FOREIGN KEY (id_equipement)
    REFERENCES equipement (id_equipement),
  CONSTRAINT ck_pe_dates CHECK (date_retour_prevue IS NULL OR date_retour_prevue >= date_affectation)
);
