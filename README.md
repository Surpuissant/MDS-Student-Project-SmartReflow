# SmartReflow

SmartReflow est une application frontend construite avec **Vite** et **Node.js**.  
Elle permet de gérer et visualiser une interface moderne et performante, prête à être utilisée en développement comme en production.

---

## 🚀 Technologies utilisées

- [Node.js](https://nodejs.org/) – environnement JavaScript côté serveur
- [Vite](https://vitejs.dev/) – outil de build rapide pour applications frontend
- [NPM](https://www.npmjs.com/) – gestionnaire de dépendances
- [Nginx](https://www.nginx.com/) – serveur HTTP pour le déploiement en production (via Docker)

---

## 📦 Prérequis

Avant d’installer le projet, assurez-vous d’avoir :

- **Node.js v18+**
- **npm v9+**
- (optionnel) **Docker** et **Docker Compose** si vous voulez l’exécuter dans un conteneur

---

## ⚙️ Installation locale (développement)

1. Clonez le dépôt :

   ```bash
   git clone <url-du-repo>
   cd SmartReflow
   ```

2. Installez les dépendances :

   ```bash
   npm install
   ```

3. Lancez le serveur de développement (hot reload activé) :
   ```bash
   npm run dev
   ```
   → L’application sera disponible sur : `http://localhost:5173`

---

## 🏗️ Build pour la production

Pour générer une version optimisée :

```bash
npm run build
```

Les fichiers statiques seront placés dans le dossier `dist/`.  
Vous pouvez ensuite les servir avec **Nginx**, **Apache** ou tout autre serveur web.

---

## 🐳 Utilisation avec Docker

### 1. Construire l’image

```bash
docker build -t SmartReflow .
```

### 2. Lancer le conteneur

```bash
docker run -p 8080:80 SmartReflow
```

→ L’application sera accessible sur : `http://localhost:8080`

---

## 📂 Structure du projet

```
SmartReflow/
├── index.html              # Page principale
├── package.json            # Dépendances et scripts npm
├── vite.config.js          # Configuration Vite
├── src/                    # Code source de l’application
│   ├── assets/             # Images, styles, etc.
│   ├── components/         # Composants UI réutilisables
│   ├── App.jsx             # Entrée principale React/Vue
│   └── main.jsx            # Point d’entrée JS
└── public/                 # Fichiers statiques publics
```

---

## 📜 Scripts npm utiles

| Commande          | Description                               |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Lance l’application en mode développement |
| `npm run build`   | Génère le build de production             |
| `npm run preview` | Prévisualise le build localement          |

---

## 🔐 Variables d’environnement

Les variables sont stockées dans le fichier `.env`.  
Exemple :

```
VITE_API_URL=http://localhost:3000/api
```

Elles doivent être préfixées par **VITE\_** pour être accessibles dans le code frontend.

---

## 🚀 Déploiement

- En **Docker** : utiliser l’image générée avec le `Dockerfile` fourni.
- En **hébergement statique** : déployer le contenu du dossier `dist/` (Netlify, Vercel, GitHub Pages, etc.).
- En **Nginx** : placer le contenu de `dist/` dans `/usr/share/nginx/html/`.

---

## 🤝 Contribuer

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Poussez la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

---

## 📄 Licence

Ce projet est distribué sous licence **MIT**. Vous êtes libre de l’utiliser et de le modifier.
