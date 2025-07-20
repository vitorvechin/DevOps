#!/bin/bash

set -e

echo "Iniciando build e deployment..."

APP_NAME="todo-app"
HELM_CHART_DIR="helm-chart/todo"
BACKEND_IMAGE="todo-backend:latest"
FRONTEND_IMAGE="todo-frontend:latest"

# Verifica se o Minikube está rodando
if ! minikube status &> /dev/null; then
  echo "Iniciando Minikube..."
  minikube start
else
  echo "Minikube está rodando."
fi

# Usa o Docker dentro do Minikube
eval "$(minikube docker-env)"
echo "Ambiente Docker configurado para o Minikube."

# Build das imagens
echo "Buildando imagens..."
docker build -t "$BACKEND_IMAGE" ./backend
docker build -t "$FRONTEND_IMAGE" ./frontend
echo "Imagens construídas."

# Habilita o Ingress se necessário
if ! minikube addons list | grep -q 'ingress.*enabled'; then
  echo "Habilitando Ingress..."
  minikube addons enable ingress
else
  echo "Ingress já habilitado."
fi

# Instala ou atualiza o Helm chart
if helm status "$APP_NAME" &> /dev/null; then
  echo "Atualizando release Helm..."
  helm upgrade "$APP_NAME" "$HELM_CHART_DIR"
else
  echo "Instalando release Helm..."
  helm install "$APP_NAME" "$HELM_CHART_DIR"
fi

echo "Deployment concluído!"
echo "Para acessar: adicione ao /etc/hosts:"
echo "  $(minikube ip) k8s.local"
