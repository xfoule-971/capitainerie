# Capitainerie

## Description du projet

Le port de plaisance de Russell souhaite se doter d’une application web pour gérer les réservations de catways.  
La capitainerie met en place une API privée et un tableau de bord minimal pour gérer les informations.  

Ce projet consiste à créer cette API avec les fonctionnalités principales suivantes.

## Technologies utilisées

- Node.js  
- Express  
- MongoDB  
- EJS  
- Bootstrap  

## Fonctionnalités principales

- Gestion des **catways** (CRUD : création, lecture, modification, suppression)  
- Gestion des **réservations** (CRUD : création, lecture, modification, suppression)  
- Gestion des **utilisateurs** (CRUD : création, lecture, modification, suppression)  
- **Authentification JWT** pour sécuriser l’accès au tableau de bord  

## Installation

1. Cloner le projet :  
git clone <URL_DU_PROJET>

2. Installer les dépendances :
npm install

3. Lancer l'application en mode développement :
npm run dev

4. Accéder à l’application : http://localhost:3000

## Accès au dashboard
Le tableau de bord est accessible uniquement après authentification.
Pour y accéder, il faut disposer d’un utilisateur dans la base MongoDB.

## Créer un utilisateur
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "motdepasse"
}

## Se connecter
Pour obtenir un token et accéder au dashboard :
POST /login
Content-Type: application/x-www-form-urlencoded

email=admin@example.com
password=motdepasse

## Accéder au dashboard
http://localhost:3000/dashboard

## Documentation API (Swagger)
La documentation complète est disponible via Swagger :
http://localhost:3000/api-docs

## Routes API
| Méthode | Route        | Description                  |
| ------- | ------------ | ---------------------------- |
| GET     | `/`          | Page d’accueil               |
| POST    | `/login`     | Authentification utilisateur |
| GET     | `/logout`    | Déconnexion                  |
| GET     | `/dashboard` | Tableau de bord (auth JWT)   |

1. Catways
| Méthode | Route               | Description                     |
| ------- | ------------------- | ------------------------------- |
| GET     | `/catways`          | Liste de tous les catways       |
| GET     | `/catways/new`      | Formulaire pour créer un catway |
| POST    | `/catways`          | Créer un catway                 |
| GET     | `/catways/:id`      | Détail d’un catway              |
| GET     | `/catways/:id/edit` | Formulaire modification catway  |
| POST    | `/catways/:id`      | Modifier un catway              |
| DELETE  | `/catways/:id`      | Supprimer un catway             |

2. Réservations
| Méthode | Route                    | Description                           |
| ------- | ------------------------ | ------------------------------------- |
| GET     | `/reservations`          | Liste de toutes les réservations      |
| GET     | `/reservations/new`      | Formulaire pour créer une réservation |
| POST    | `/reservations`          | Créer une réservation                 |
| GET     | `/reservations/:id`      | Détail d’une réservation              |
| GET     | `/reservations/:id/edit` | Formulaire modification réservation   |
| POST    | `/reservations/:id`      | Modifier une réservation              |
| DELETE  | `/reservations/:id`      | Supprimer une réservation             |

3. Utilisateurs
| Méthode | Route             | Description                          |
| ------- | ----------------- | ------------------------------------ |
| GET     | `/users`          | Liste des utilisateurs               |
| GET     | `/users/new`      | Formulaire pour créer un utilisateur |
| POST    | `/users`          | Créer un utilisateur                 |
| GET     | `/users/:id`      | Détail d’un utilisateur              |
| GET     | `/users/:id/edit` | Formulaire modification utilisateur  |
| POST    | `/users/:id`      | Modifier un utilisateur              |
| DELETE  | `/users/:id`      | Supprimer un utilisateur             |

## Auteur
Nom : Foule



