# Usa uma imagem base Python oficial
FROM python:3.13.3-bookworm

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o arquivo de requisitos para o contêiner
COPY requirements.txt .

# Instala as dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante do código da aplicação para o contêiner
COPY src/ .

# Expõe a porta que o FastAPI vai usar
EXPOSE 3001

# Comando para iniciar o servidor Uvicorn quando o contêiner for executado
# Aponta para o caminho do server.py dentro do contêiner
CMD ["python", "/app/server.py"]