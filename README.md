# 📊 Application Web Locale – Visualisation des Données & Gestion des Tâches

---

## 📌 Description du Projet

Ce projet a été réalisé dans le cadre d’un stage d’observation effectué chez **EM Energie Maroc** du **1er août 2025 au 10 septembre 2025**.

L’objectif principal était de concevoir et développer une application web locale permettant :

- 📈 La visualisation des données financières et opérationnelles
- 📊 Le suivi du chiffre d’affaires mensuel et annuel
- 🗂️ La gestion des tâches entre plusieurs utilisateurs
- 🔐 La gestion des droits d’accès (Administrateur / Utilisateur)
- 🔔 L’intégration d’un système de notifications en temps réel

---

## 🏢 Contexte

L’entreprise utilise le système ERP **SAP Business One** pour la gestion de ses processus internes (achats, ventes, projets, factures, etc.).

Ce projet vise à :

- Extraire et analyser les données depuis la base SAP HANA
- Afficher ces données sous forme de graphiques interactifs
- Ajouter une couche locale de gestion des tâches avec MongoDB

---

## 🛠️ Technologies Utilisées

### 🔹 Backend

- Node.js
- Express.js
- MongoDB (gestion des tâches et utilisateurs)
- ODBC (connexion SAP HANA)
- JWT (authentification)
- Socket.io (notifications temps réel)

### 🔹 Frontend

- React.js
- Axios
- Recharts (visualisation des graphiques)
- CSS Grid

### 🔹 Base de Données

- SAP HANA (données financières et projets)
- MongoDB (tâches et utilisateurs)

---

## 🏗️ Architecture du Projet

Le projet est divisé en deux parties principales :

---

### 1️⃣ Partie Visualisation des Données (Dashboard)

Connexion à SAP HANA via ODBC pour :

- 📊 Chiffre d’affaires annuel
- 📅 Chiffre d’affaires mensuel
- 📦 Nombre de commandes par mois
- 💰 Coûts et rentabilité par projet
- 🏢 Délai et chiffre d’affaires par fournisseur
- 🔝 Top 4 projets consommant le plus de budget

Les données sont exposées via API REST et affichées dans des graphiques React.



<img width="817" height="402" alt="Screenshot 2025-09-09 123202" src="https://github.com/user-attachments/assets/d086c0d8-9003-4443-bb6c-ae015fc55dfc" />
<img width="1616" height="401" alt="Screenshot 2025-09-09 123304" src="https://github.com/user-attachments/assets/aa3888b1-404c-4a1b-9956-f7e55aef213a" />


---

### 2️⃣ Partie Gestion des Tâches

Implémentée avec MongoDB :

#### 👤 Gestion des Utilisateurs

- Création d’utilisateur (avec image)
- Cryptage du mot de passe
- Gestion des rôles (admin / user)
- Activation / Désactivation
- Modification des informations personnelles

#### 📋 Gestion des Tâches

- Création de tâches
- Ajout de sous-tâches
- Attribution à plusieurs utilisateurs

##### États des tâches :
- Suspendue
- En cours
- Complétée

##### Statistiques :
- Tâches par état
- Tâches par importance
- Tâches par date

---

### 🔔 Notifications Temps Réel

Utilisation de Socket.io pour :

- Notifier les utilisateurs lors de la création d’une tâche
- Afficher le nombre de tâches non lues

---

## 🔐 Système d’Authentification

- Vérification email + mot de passe
- Génération d’un JWT
- Stockage du token dans le localStorage
- Middleware d’authentification
- Gestion des accès selon le rôle

---

## 🧪 Testing

- Tests des routes backend via Postman
- Vérification des requêtes HTTP (GET / POST / PATCH)
- Validation des réponses JSON
- Gestion des erreurs

---

## 🚀 Installation & Lancement

### 1️⃣ Backend

```bash
npm install
npm start

### 2️⃣ Backend

```bash
npx install
npx start

```bash
npm install
npm start
