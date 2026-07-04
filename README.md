# Research Laboratory Management System

Application web développée dans le cadre du module **Administration Oracle & Bases de Données NoSQL (Master M2I)**.

Le projet permet de gérer un laboratoire de recherche en utilisant :

* **Oracle 11g** pour les données relationnelles.
* **MongoDB** pour les rapports d'expériences.

---

# Objectifs

Le système permet de gérer :

* Les chercheurs
* Les projets de recherche
* Les équipements
* Les rapports d'expériences
* Les affectations des chercheurs aux projets
* Les affectations des équipements aux projets

Le système distingue deux profils :

* **Directeur de laboratoire**
* **Chercheur**

---

# Fonctionnalités

## Directeur de laboratoire

* Gestion des chercheurs
* Gestion des projets
* Gestion des équipements
* Affectation des chercheurs aux projets
* Affectation des équipements aux projets
* Consultation de tous les rapports
* Validation des rapports
* Tableau de bord

## Chercheur

* Authentification
* Consultation des projets qui lui sont affectés
* Création d'un rapport
* Modification d'un rapport
* Soumission d'un rapport
* Consultation de ses propres rapports

---

# Architecture

```text
                    React Frontend
                           │
                           │ REST API
                           ▼
                Node.js + Express Backend
                   │                 │
                   │                 │
                   ▼                 ▼
            Oracle Database      MongoDB
            (Oracle 11g)        (Rapports)
```

---

# Technologies utilisées

## Frontend

* React
* Bootstrap
* React Router

## Backend

* Node.js
* Express.js
* Mongoose
* OracleDB Driver

## Base de données

### Oracle 11g

Gestion de :

* Chercheurs
* Projets
* Équipements
* Affectations
* Triggers
* Procédures stockées

### MongoDB

Collection :

* Rapports d'expériences

---

# Structure du projet

```text
project/

│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── middleware/
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── services/
│
└── README.md
```

---

# Installation

## 1. Cloner le projet

```bash
git clone <repository-url>

cd project
```

---

## 2. Installer les dépendances Backend

```bash
cd backend

npm install
```

---

## 3. Installer les dépendances Frontend

```bash
cd ../frontend

npm install
```

---

# Configuration

Créer un fichier :

```text
backend/.env
```

Exemple :

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

ORACLE_USER=lab_user
ORACLE_PASSWORD=your_password
ORACLE_CONNECT_STRING=localhost:1521/oradb
```

---

# Oracle 11g

Créer la base Oracle en exécutant le script SQL fourni.

Les principales tables sont :

* CHERCHEUR
* PROJET_RECHERCHE
* EQUIPEMENT
* CHERCHEUR_PROJET
* PROJET_EQUIPEMENT

Le projet utilise également :

* des séquences Oracle ;
* un trigger pour la gestion des équipements ;
* une procédure stockée pour les statistiques des projets.

---

# MongoDB

Créer une base MongoDB.

Collection principale :

```text
rapports
```

Chaque rapport contient notamment :

```text
titre
objectif
protocole
resultats
observations
conclusion
dateExperience
chercheurId
projetId
statut
```

---

# Lancement du projet

## Backend

```bash
cd C:\Users\hp\Projet-Oracle\backend

npm run dev
```

---

## Frontend

```bash
cd C:\Users\hp\Projet-Oracle-> 

npm install
npm start
```

---

# Authentification

Le système propose deux rôles :

## Directeur de laboratoire

Accès :

* Gestion complète
* Validation des rapports
* Tableau de bord

## Chercheur

Accès :

* Consultation de ses projets
* Gestion de ses rapports

---

# Fonctionnalités Oracle

* CRUD des chercheurs
* CRUD des projets
* CRUD des équipements
* Affectation chercheur → projet
* Affectation équipement → projet
* Trigger Oracle
* Procédure stockée

---

# Fonctionnalités MongoDB

* Création d'un rapport
* Modification
* Soumission
* Validation
* Statistiques
* Agrégations

---

# Tableau de bord

Le tableau de bord permet d'afficher notamment :

* Nombre de projets actifs
* Nombre de rapports
* Nombre de rapports validés
* Chercheurs les plus productifs
* Statistiques générales

---

# Auteurs

* **Aymane Bensaadoun**
* **Amine Genin**

Master M2I

Université Mohammed Premier – Oujda

---

# Licence

Projet académique réalisé dans le cadre du Master M2I.

Utilisation à des fins pédagogiques uniquement.
