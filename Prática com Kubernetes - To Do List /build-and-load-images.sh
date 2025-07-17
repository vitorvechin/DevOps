#!/bin/bash

echo "SCRIPT DE BUILD E DEPLOYMENT INICIADO!"

# --- Configurações ---
# Nome da sua aplicação Helm (será o nome da release quando instalar)
APP_NAME="todo-app"
# Nome do diretório do Helm Chart
HELM_CHART_DIR="helm-chart/todo"

# Nomes das imagens e tags
BACKEND_IMAGE_NAME="todo-backend"
FRONTEND_IMAGE_NAME="todo-frontend"
IMAGE_TAG="latest" # Pode ser parametrizado para usar uma versão específica

# --- Funções Auxiliares ---

# Função para verificar o status do Minikube
check_minikube_status() {
    echo "Verificando status do Minikube..."
    if ! minikube status &> /dev/null; then
        echo "Minikube não está rodando. Iniciando Minikube..."
        minikube start || { echo "Falha ao iniciar Minikube. Verifique sua instalação."; exit 1; }
    else
        echo "Minikube está rodando."
    fi
}

# Função para carregar imagem no Minikube
load_image_to_minikube() {
    local image_name="$1"
    echo "Carregando imagem $image_name:$IMAGE_TAG para o Minikube..."
    minikube image load "$image_name:$IMAGE_TAG" || { echo "Falha ao carregar a imagem $image_name. Verifique se o Minikube está em execução e o nome da imagem."; exit 1; }
    echo "Imagem $image_name:$IMAGE_TAG carregada com sucesso no Minikube."
}

# --- Main Script ---

echo "Iniciando processo de build e carregamento de imagens para o Minikube..."

# 1. Verificar e iniciar Minikube se necessário
check_minikube_status

# 2. Configurar o ambiente Docker para o Minikube
echo "Configurando ambiente Docker para o Minikube..."
eval $(minikube docker-env) || { echo "Falha ao configurar ambiente Docker do Minikube."; exit 1; }
echo "Ambiente Docker configurado para o Minikube."

# 3. Buildar a imagem do Backend
echo "Construindo imagem do Backend: $BACKEND_IMAGE_NAME:$IMAGE_TAG"
docker build -t "$BACKEND_IMAGE_NAME:$IMAGE_TAG" ./backend || { echo "Falha ao construir a imagem do Backend."; exit 1; }
echo "Imagem do Backend construída com sucesso."

# 4. Buildar a imagem do Frontend
echo "Construindo imagem do Frontend: $FRONTEND_IMAGE_NAME:$IMAGE_TAG"
docker build -t "$FRONTEND_IMAGE_NAME:$IMAGE_TAG" ./frontend || { echo "Falha ao construir a imagem do Frontend."; exit 1; }
echo "Imagem do Frontend construída com sucesso."

# 5. Carregar as imagens para o Minikube (Alternativa ao `minikube image load` quando `eval $(minikube docker-env)` é usado)
# Quando `eval $(minikube docker-env)` é usado, as imagens já são construídas diretamente no daemon Docker do Minikube.
# Portanto, a etapa `minikube image load` é redundante e até pode falhar se a imagem já existir no Minikube.
# Descomentar as linhas abaixo SOMENTE se você *não* usar `eval $(minikube docker-env)` ou se precisar forçar o carregamento.
# load_image_to_minikube "$BACKEND_IMAGE_NAME"
# load_image_to_minikube "$FRONTEND_IMAGE_NAME"

echo "As imagens já foram construídas diretamente no ambiente Docker do Minikube devido ao 'minikube docker-env'."
echo "Processo de build e carregamento de imagens concluído!"

# 6. Opcional: Reverter para o ambiente Docker local (se desejar)
# echo "Revertendo para o ambiente Docker local..."
# eval $(minikube docker-env -u)

# --- Implementação do Helm (Opcional, pode ser em um script separado para deployment) ---

echo "Verificando se o Ingress addon do Minikube está habilitado..."
if ! minikube addons list | grep "ingress" | grep "enabled" &> /dev/null; then
    echo "Habilitando addon Ingress do Minikube..."
    minikube addons enable ingress || { echo "Falha ao habilitar addon Ingress."; exit 1; }
else
    echo "Addon Ingress do Minikube já está habilitado."
fi

echo "Verificando se a release do Helm '$APP_NAME' já existe..."
if helm status "$APP_NAME" &> /dev/null; then
    echo "Atualizando a release existente do Helm '$APP_NAME'..."
    helm upgrade "$APP_NAME" "$HELM_CHART_DIR" || { echo "Falha ao atualizar a release do Helm."; exit 1; }
else
    echo "Instalando nova release do Helm '$APP_NAME'..."
    helm install "$APP_NAME" "$HELM_CHART_DIR" || { echo "Falha ao instalar a release do Helm."; exit 1; }
fi

echo "Deployment do Helm concluído!"
echo "Para acessar a aplicação, adicione o IP do Minikube ao seu arquivo hosts para 'k8s.local'."
echo "Execute 'minikube ip' para obter o IP."
echo "Exemplo de entrada no /etc/hosts ou C:\\Windows\\System32\\drivers\\etc\\hosts:"
echo "  $(minikube ip) k8s.local"
