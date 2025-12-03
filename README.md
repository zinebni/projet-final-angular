# 🎫 Smart Queue - Système de Gestion des Files d'Attente

Système complet de gestion intelligente des files d'attente pour banques, universités et agences professionnelles.

## 📋 Stack Technique

- **Frontend**: Angular 17 (Standalone Components)
- **Backend**: Node.js + Express (Architecture MVC)
- **Base de données**: MongoDB avec Mongoose
- **Temps réel**: Socket.io
- **Authentification**: JWT
- **Containerisation**: Docker + Docker Compose

## 🚀 Démarrage Rapide

### Option 1: Docker (Recommandé)

```bash
# Cloner et lancer
docker-compose up --build

# Accéder à l'application
# Frontend: http://localhost
# API: http://localhost:5000/api
```

### Option 2: Développement Local

#### Prérequis
- Node.js 18+
- MongoDB 6+ (local ou Docker)
- npm ou yarn

#### 1. Lancer MongoDB (avec Docker)
```bash
docker-compose -f docker-compose.dev.yml up -d
```

#### 2. Backend
```bash
cd server
cp .env.example .env  # Configurer les variables
npm install
npm run seed          # Créer les utilisateurs par défaut
npm run dev           # Lancer en mode développement
```

#### 3. Frontend
```bash
cd client
npm install
npm start             # http://localhost:4200
```

## 👤 Comptes par Défaut

| Rôle | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Supervisor | supervisor | supervisor123 |
| Agent 1 | agent1 | agent123 |
| Agent 2 | agent2 | agent123 |
| Agent 3 | agent3 | agent123 |

## 📡 API Endpoints

### Public
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/tickets` | Créer un ticket |
| GET | `/api/tickets` | Liste des tickets |
| GET | `/api/tickets/:id` | Détails d'un ticket |
| GET | `/api/tickets/number/:num` | Ticket par numéro |
| POST | `/api/tickets/:id/checkin` | Check-in |
| GET | `/api/stats/queue` | Statut de la file |

### Authentification
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/login` | Connexion |
| GET | `/api/auth/me` | Utilisateur courant |
| POST | `/api/auth/logout` | Déconnexion |

### Agent (Authentifié)
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/admin/next` | Appeler suivant |
| POST | `/api/admin/serve` | Commencer service |
| POST | `/api/admin/complete` | Terminer ticket |
| POST | `/api/admin/no-show` | Marquer absent |

### Admin (Admin/Supervisor)
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/stats` | Statistiques |
| GET | `/api/stats/agents` | Stats agents |
| GET | `/api/admin/agents` | Liste agents |
| POST | `/api/auth/register` | Créer agent |

## 🔌 Socket.io Events

### Client → Server
- `join:room` - Rejoindre une room
- `ticket:subscribe` - S'abonner aux updates d'un ticket
- `agent:online` - Agent connecté

### Server → Client
- `ticket:created` - Nouveau ticket
- `ticket:updated` - Ticket mis à jour
- `ticket:called` - Ticket appelé

## 📁 Structure du Projet

```
smart-queue/
├── server/                 # Backend Express
│   ├── config/            # Configuration
│   ├── controllers/       # Contrôleurs
│   ├── middleware/        # Middlewares
│   ├── models/            # Modèles Mongoose
│   ├── routes/            # Routes API
│   ├── services/          # Services (Socket.io)
│   └── scripts/           # Scripts (seed)
├── client/                # Frontend Angular
│   └── src/
│       └── app/
│           ├── guards/    # Guards de route
│           ├── interceptors/
│           ├── models/    # Interfaces TypeScript
│           ├── pages/     # Composants de page
│           └── services/  # Services Angular
├── docker-compose.yml     # Docker production
└── docker-compose.dev.yml # Docker développement
```

## 🎨 Pages de l'Application

- `/` - Page d'accueil avec file d'attente
- `/create-ticket` - Créer un nouveau ticket
- `/ticket-status` - Suivre son ticket
- `/login` - Connexion agent/admin
- `/agent` - Console agent
- `/admin` - Tableau de bord admin
- `/display` - Affichage public (écran)

## 📄 Licence

MIT

