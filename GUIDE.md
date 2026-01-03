# 🚀 Smart Queue - Guide Complet

Guide complet pour démarrer et utiliser Smart Queue en mode Docker ou développement local.

---

## 📋 Deux Modes Disponibles

### 1. 🐳 Mode Docker (Recommandé)

**Tout est conteneurisé - Aucune installation locale requise**

```powershell
# Démarrer
.\start.ps1

# OU manuellement
docker-compose up --build -d

# Initialiser la base de données (première fois)
docker exec smartqueue-backend npm run seed

# Arrêter
docker-compose down
```

**Accès**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- MongoDB: localhost:27017

**Prérequis**: Docker Desktop

---

### 2. 💻 Mode Local (Développement)

**Développement rapide avec hot-reload**

```powershell
# Terminal 1: Backend
cd server
npm install
npm run seed
npm run dev

# Terminal 2: Frontend
cd client
npm install
ng serve
```

**Accès**:
- Frontend: http://localhost:4200
- Backend API: http://localhost:5000/api

**Prérequis**: MongoDB local, Node.js 20+, Angular CLI

---

## 🔧 Configuration

### Mode Docker
Les variables d'environnement sont définies dans `docker-compose.yml`:

```yaml
backend:
  environment:
    MONGODB_URI: mongodb://mongodb:27017/smartqueue
    CLIENT_URL: http://localhost:3000,http://localhost:4200
    JWT_SECRET: your_jwt_secret_change_this_in_production
```

### Mode Local
Le fichier `server/.env` est déjà configuré:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/smartqueue
JWT_SECRET=dev_secret_key_change_in_production
JWT_EXPIRES_IN=24h
CLIENT_URL=http://localhost:4200,http://localhost:3000
```

---

## 👤 Comptes par Défaut

Après `npm run seed`:

| Utilisateur | Mot de passe | Rôle | Services |
|-------------|--------------|------|----------|
| admin | admin123 | Admin | Tous |
| supervisor | supervisor123 | Superviseur | Tous |
| agent1 | agent123 | Agent | account, general |
| agent2 | agent123 | Agent | loan, consultation |
| agent3 | agent123 | Agent | registration, payment |
| agent4 | agent123 | Agent | general, consultation |

---

## 🔍 Commandes Utiles

### Docker

```bash
# Démarrer
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Voir l'état
docker ps

# Initialiser la DB
docker exec smartqueue-backend npm run seed

# Arrêter
docker-compose down

# Tout supprimer (y compris les données)
docker-compose down -v
```

### Local

```bash
# Backend
cd server
npm install
npm run seed
npm run dev

# Frontend
cd client
npm install
ng serve
```

---

## ✅ Vérification

### Docker Mode

```bash
# Tous les conteneurs doivent être "healthy"
docker ps

# Tester l'API
curl http://localhost:5000/api/health

# Ouvrir le frontend
http://localhost:3000
```

### Local Mode

```bash
# MongoDB
mongosh --eval "db.adminCommand('ping')"

# Backend
curl http://localhost:5000/api/health

# Frontend
http://localhost:4200
```

---

## 🐛 Problèmes Courants

### Port déjà utilisé (Docker)

```bash
# Arrêter les processus locaux
# Trouver le processus sur le port 5000
netstat -ano | findstr :5000

# Tuer le processus
taskkill /PID <PID> /F
```

### MongoDB non connecté (Local)

```bash
# Vérifier que MongoDB est démarré
mongosh

# Démarrer MongoDB
net start MongoDB
```

### Erreur CORS

Vérifier que `CLIENT_URL` contient l'URL du frontend:
- Docker: `http://localhost:3000`
- Local: `http://localhost:4200`

---

## 📊 Comparaison

| Aspect | Docker | Local |
|--------|--------|-------|
| **Installation** | Docker seulement | Node.js + MongoDB + Angular CLI |
| **Démarrage** | `docker-compose up -d` | 2 terminaux |
| **Frontend** | http://localhost:3000 | http://localhost:4200 |
| **Hot-reload** | ❌ Non | ✅ Oui |
| **Isolation** | ✅ Complète | ❌ Partage l'environnement |
| **Rapidité** | Moyen | Rapide |
| **Usage** | Test, démo | Développement |

---

## 🎯 Fonctionnalités Principales

### Pour les Clients
- 🎫 Prise de ticket avec sélection du service
- 📊 Visualisation en temps réel de la position
- 🔔 Notifications lors de l'appel

### Pour les Agents
- 📞 Appel du prochain ticket (filtré par services assignés)
- ✅ Gestion des tickets (en cours, terminé, annulé)
- 📊 Statistiques en temps réel
- 🔄 Mises à jour WebSocket

### Pour les Admins
- 👥 Gestion des agents et attribution des services
- 📊 Tableau de bord avec statistiques globales

### Services Disponibles
- **account** - Gestion de compte
- **loan** - Demandes de prêt
- **general** - Services généraux
- **registration** - Nouvelles inscriptions
- **consultation** - Consultations diverses
- **payment** - Paiements et transactions

---

## 🚀 Démarrage Ultra-Rapide

### Docker
```powershell
.\start.ps1
```

### Local
```powershell
# Terminal 1: cd server && npm run dev
# Terminal 2: cd client && ng serve
```

---

**Configuration simplifiée ✅ | Documentation complète ✅ | Prêt à l'emploi ✅**

