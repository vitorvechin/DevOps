# 📝 To-Do List com FARM Stack e Docker

Projeto de uma aplicação de lista de tarefas desenvolvido como parte da disciplina de DevOps, utilizando a **FARM Stack** (FastAPI, React, MongoDB) e conteinerização com **Docker** e **Docker Compose**.

## 🚀 Funcionalidades

- Criar e gerenciar listas de tarefas
- Adicionar e remover itens
- Marcar itens como concluídos/não concluídos
- Deletar listas inteiras

## 🧰 Tecnologias

### Frontend (React + Vite + Tailwind)
- Interface moderna e responsiva
- Comunicação com o backend via Axios
- Servido em produção com **Nginx**

### Backend (FastAPI)
- API rápida com validação via Pydantic
- Conexão assíncrona com o MongoDB usando **Motor**

### Banco de Dados (MongoDB)
- Armazenamento NoSQL das listas e tarefas

### DevOps
- **Docker**: Conteinerização dos serviços
- **Docker Compose**: Orquestração do frontend, backend e banco de dados

## ⚙️ Como Executar

### Pré-requisitos
- [Docker](https://www.docker.com/get-started) e Docker Compose instalados

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu_usuario/seu_repositorio.git
   cd seu_repositorio
   ```

2. **Suba a aplicação:**
   ```bash
   docker compose up --build --no-cache
   ```

3. **Acesse no navegador:**
   ```
   http://localhost:3000
   ```

### Parar a aplicação

- Somente parar:
  ```bash
  docker compose down
  ```

- Parar e remover volumes (dados do MongoDB):
  ```bash
  docker compose down -v
  ```
