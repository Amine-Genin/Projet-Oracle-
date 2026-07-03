# Partie Oracle - Research Laboratory Management System

Ce dossier contient les scripts Oracle 11g de la partie relationnelle du projet **Gestion d'un Laboratoire de Recherche**.

Le frontend est développé avec **React**, le backend avec **Node.js / Express**. Oracle gère les données relationnelles du laboratoire, tandis que MongoDB gère uniquement les rapports d'expériences.

---

# Rôle d'Oracle

Oracle est utilisé pour gérer :

* les chercheurs ;
* les projets de recherche ;
* les équipements ;
* les affectations des chercheurs aux projets ;
* les affectations des équipements aux projets.

MongoDB est utilisé uniquement pour stocker les rapports d'expériences.

---

# Contenu du dossier

* **01_create_user.sql** : création de l'utilisateur Oracle et attribution des privilèges.
* **02_create_tables.sql** : création des tables, clés primaires, clés étrangères et contraintes.
* **03_create_sequences.sql** : création des séquences Oracle 11g.
* **04_insert_test_data.sql** : insertion des données de test.
* **05_create_triggers.sql** : création des triggers.
* **06_create_procedures.sql** : création des procédures stockées.
* **07_test_queries.sql** : requêtes permettant de tester la base de données.

---

# Exécution avec SQL*Plus

## 1. Ouvrir SQL*Plus

Se connecter avec un compte administrateur :

```bash
sqlplus system/votre_mot_de_passe
```

ou

```bash
sqlplus sys/votre_mot_de_passe as sysdba
```

---

## 2. Exécuter le script de création de l'utilisateur

Depuis SQL*Plus :

```sql
@01_create_user.sql
```

---

## 3. Se connecter avec l'utilisateur du projet

```bash
sqlplus lab_user/lab_password
```

ou

```bash
sqlplus lab_user/lab_password@XE
```

selon votre installation Oracle 11g.

---

## 4. Exécuter les scripts dans l'ordre

```sql
@02_create_tables.sql
```

```sql
@03_create_sequences.sql
```

```sql
@04_insert_test_data.sql
```

```sql
@05_create_triggers.sql
```

```sql
@06_create_procedures.sql
```

```sql
@07_test_queries.sql
```

---

# Vérification

Afficher les tables créées :

```sql
SELECT table_name FROM user_tables;
```

Vérifier les données :

```sql
SELECT * FROM chercheur;
```

```sql
SELECT * FROM projet_recherche;
```

```sql
SELECT * FROM equipement;
```

```sql
SELECT * FROM chercheur_projet;
```

```sql
SELECT * FROM projet_equipement;
```

---

# Test de la procédure

```sql
VARIABLE rc REFCURSOR;

EXEC prc_projets_en_cours(:rc);

PRINT rc;
```

---

# Test du trigger

1. Vérifier qu'un équipement est **disponible**.
2. Affecter cet équipement à un projet dont le statut est **en cours**.
3. Vérifier que son état devient automatiquement **en utilisation**.

---

# Connexion avec le backend Node.js

Installer le driver Oracle :

```bash
npm install oracledb
```

Configurer les variables d'environnement :

```env
ORACLE_USER=lab_user
ORACLE_PASSWORD=lab_password
ORACLE_CONNECT_STRING=localhost:1521/XE
```

Connexion dans le backend :

```javascript
const oracledb = require("oracledb");

const connection = await oracledb.getConnection({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECT_STRING
});
```

---

# Bonnes pratiques

* Toujours exécuter les scripts dans l'ordre indiqué.
* Utiliser uniquement la syntaxe Oracle 11g.
* Utiliser les séquences pour générer automatiquement les identifiants.
* Conserver MongoDB uniquement pour les rapports d'expériences.
* Versionner tous les scripts SQL dans GitHub afin de faciliter le déploiement et la maintenance du projet.
