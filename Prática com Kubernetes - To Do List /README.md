# Implantação de Aplicação To-Do List com Kubernetes e Helm (Versão Simplificada)

**Disciplina:** DevOps

**Professor(a):** Delano Medeiros Beder

**Aluno:** Vitor Rodrigues Vechin

---

## Sumário

1. Introdução
2. Visão Geral da Aplicação
    1. Componentes/Arquitetura
    2. Tecnologias Utilizadas
3. Conteinerização da Aplicação
    1. Imagens Docker
    2. Dockerfile do Backend
    3. Dockerfile do Frontend
4. Implantação no Kubernetes (Minikube)
    1. Configuração do Cluster Local
    2. Helm Chart (`helm-chart/todo/`)
    3. Artefatos Kubernetes (Templates)
        1. Deployment do Backend
        2. Serviço do Backend
        3. Deployment do MongoDB
        4. PersistentVolumeClaim (PVC) do MongoDB
        5. Serviço do MongoDB
        6. Deployment do Frontend
        7. Serviço do Frontend
        8. Ingress

5. Automação do Build e Implantação
    1. Script de Automação
6. Instruções de Uso e Acesso à Aplicação
    1. Pré-requisitos
    2. Passos para Implantação
    3. Acesso à Aplicação

---

## 1. Introdução

Este documento descreve a conteinerização e a implantação de uma aplicação de lista de tarefas (To-Do List) em um ambiente Kubernetes local, utilizando Minikube e Helm. O objetivo é demonstrar a aplicação de conceitos de DevOps para orquestração e automação, resultando em uma solução completa e funcional.

---

## 2. Visão Geral da Aplicação

A aplicação To-Do List é estruturada em três componentes distintos, cada um operando de forma independente, mas colaborando para a funcionalidade total.

### 2.1. Componentes/Arquitetura

* **Frontend:** A interface do usuário, desenvolvida em React, responsável pela interação visual com o usuário e pela comunicação com o Backend. Servido por um servidor web Nginx.
* **Backend:** A API RESTful da aplicação, implementada em Python com FastAPI, que gerencia a lógica de negócios e a comunicação com o banco de dados.
* **Banco de Dados (MongoDB):** Um banco de dados NoSQL utilizado para armazenar permanentemente as informações das tarefas.

### 2.2. Tecnologias Utilizadas

* **Conteinerização:** Docker
* **Orquestração de Contêineres:** Kubernetes (usando Minikube)
* **Empacotamento e Deployment:** Helm
* **Linguagens/Frameworks:** Python (FastAPI), JavaScript (React.js), Nginx.
* **Banco de Dados:** MongoDB
* **Automação:** Shell Script (Bash)

---

## 3. Conteinerização da Aplicação

A conteinerização empacota a aplicação e suas dependências em unidades isoladas (contêineres), garantindo consistência em diferentes ambientes.

### 3.1. Imagens Docker

Duas imagens Docker personalizadas são criadas:

* `todo-backend:latest`: Contém o ambiente Python e o código da API FastAPI.
* `todo-frontend:latest`: Contém a aplicação React compilada e um servidor Nginx.

### 3.2. Dockerfile do Backend

O Dockerfile do backend utiliza uma imagem base oficial do Python. Ele define o ambiente de trabalho dentro do contêiner, copia o arquivo de requisitos para instalar as dependências da aplicação, e então copia o código-fonte da API. A porta `3001` é exposta, e o contêiner é configurado para iniciar o servidor FastAPI Uvicorn quando executado.

### 3.3. Dockerfile do Frontend

O Dockerfile do frontend emprega um processo de construção em múltiplos estágios. O primeiro estágio usa uma imagem Node.js para instalar as dependências do React e compilar a aplicação, gerando os arquivos de produção. O segundo estágio, leve e baseado em Nginx, copia uma configuração personalizada do Nginx e os arquivos de build do estágio anterior. A porta `80` é exposta para o tráfego web.

---

## 4. Implantação no Kubernetes (Minikube)

A implantação da aplicação é gerenciada no Kubernetes através de um Helm Chart, que agrupa todos os recursos necessários.

### 4.1. Configuração do Cluster Local

O **Minikube** é empregado para criar um ambiente de cluster Kubernetes local. O addon **Ingress** é habilitado para expor os serviços da aplicação externamente, permitindo acesso via um domínio local `k8s.local`.

### 4.2. Helm Chart (`helm-chart/todo/`)

O Helm Chart atua como um pacote que define e implanta a aplicação no Kubernetes.

* **`Chart.yaml`:** Contém metadados essenciais sobre o chart, como nome da aplicação, descrição e informações de versão.
* **`values.yaml`:** Este arquivo centraliza todas as configurações personalizáveis da aplicação. Ele define nomes de imagens, tags, portas de serviço, números de réplicas, a URL de conexão com o MongoDB, e configurações específicas para o Ingress, permitindo fácil adaptação do deployment.

### 4.3. Artefatos Kubernetes (Templates)

Os arquivos na pasta `templates/` do Helm Chart são os manifestos Kubernetes que definem os componentes da aplicação no cluster.

#### 4.3.1. Deployment do Backend

Define como os pods do serviço de backend são executados, incluindo qual imagem usar, quantas réplicas manter, e como injetar a variável de ambiente `MONGO_URL` para a conexão com o MongoDB.

#### 4.3.2. Serviço do Backend

Cria um serviço de `ClusterIP` para o backend, permitindo que outros componentes dentro do cluster (como o frontend) se comuniquem com ele por um nome de DNS interno e uma porta específica.

#### 4.3.3. Deployment do MongoDB

Gerencia o pod do banco de dados MongoDB, especificando a imagem a ser utilizada e a configuração de volumes para persistência de dados.

#### 4.3.4. PersistentVolumeClaim (PVC) do MongoDB

Solicita e gerencia o armazenamento persistente para o MongoDB, garantindo que os dados do banco de dados não sejam perdidos caso o pod seja reiniciado ou movido.

#### 4.3.5. Serviço do MongoDB

Cria um serviço de `ClusterIP` para o MongoDB, tornando o banco de dados acessível para o backend por um nome de DNS interno e a porta padrão do MongoDB.

#### 4.3.6. Deployment do Frontend

Define como os pods do frontend são implantados, especificando a imagem da aplicação React/Nginx e o número de réplicas.

#### 4.3.7. Serviço do Frontend

Cria um serviço de `ClusterIP` para o frontend, permitindo que o Ingress direcione o tráfego externo para a interface do usuário da aplicação.

#### 4.3.8. Ingress

Configura as regras para expor a aplicação externamente. Ele mapeia o domínio `k8s.local` para o serviço de frontend na porta 80, atuando como um roteador de tráfego. O Nginx dentro do contêiner do frontend é responsável por rotear chamadas de API (`/api`) internamente para o serviço do backend.

---

## 5. Automação do Build e Implantação

O processo de build e implantação é totalmente automatizado através de um script Bash.

### 5.1. Script de Automação (`build-and-load-images.sh`)

Este script Bash gerencia todo o ciclo de vida da implantação. Suas funções incluem:

* Verificar o status do Minikube e iniciá-lo, se necessário.
* Configurar o ambiente Docker local para que as imagens sejam construídas diretamente dentro da VM do Minikube.
* Construir as imagens Docker do backend e do frontend.
* Verificar e habilitar o addon Ingress do Minikube.
* Utilizar o Helm para instalar a aplicação se for a primeira vez, ou atualizá-la se já existir.
* Fornecer instruções de acesso final para o usuário.

---

## 6. Instruções de Uso e Acesso à Aplicação

Para implantar e acessar a aplicação, siga os passos abaixo no seu ambiente local:

### 6.1. Pré-requisitos

* Docker Desktop (ou Docker Engine)
* Minikube
* kubectl
* Helm

### 6.2. Passos para Implantação

1. **Clonar o Repositório:** Obtenha o código do projeto a partir do GitHub.
2. **Navegar ao Diretório do Projeto:** Acesse a pasta raiz do projeto clonado no seu terminal.
3. **Tornar o Script Executável:** Garanta que o script de automação tenha permissões de execução.
4. **Executar o Script:** Inicie o processo de build e implantação executando o script. Ele cuidará de todas as etapas, desde a preparação do ambiente até o deployment do Helm Chart.

### 6.3. Acesso à Aplicação

1. **Obter o IP do Minikube:** Utilize o comando `minikube ip` para descobrir o endereço IP da sua VM Minikube.
2. **Configurar o Arquivo `hosts`:** Edite o arquivo `hosts` do seu sistema operacional (localizado em `/etc/hosts` no Linux/macOS ou `C:\Windows\Windows\System32\drivers\etc\hosts` no Windows) e adicione uma entrada que mapeie o domínio `k8s.local` para o IP do Minikube.
3. **Acessar no Navegador:** Abra seu navegador e navegue até `http://k8s.local`. Recomenda-se limpar o cache DNS do navegador ou usar uma janela anônima/privada para garantir que a nova configuração de `hosts` seja utilizada.
