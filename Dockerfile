# Étape 1 : build de l'application
FROM node:20.19-alpine AS build

WORKDIR /app

# Copier uniquement les fichiers nécessaires pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code source
COPY . .

# Construire l’application pour la production
RUN npm run build

# Étape 2 : servir les fichiers statiques via Nginx
FROM nginx:alpine

# Supprimer la config par défaut
RUN rm -rf /usr/share/nginx/html/*

# Copier le build de Vite vers le dossier de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copier une configuration nginx custom si nécessaire
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]