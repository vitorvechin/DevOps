# Estágio 1: Build da aplicação React
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./  
RUN npm install

COPY . .

RUN npm run build 

# Estágio 2: Servir a aplicação com Nginx
FROM nginx:alpine

# Copia a configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos estáticos construídos do estágio de build para o Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]