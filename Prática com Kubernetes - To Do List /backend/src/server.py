from contextlib import asynccontextmanager
import os
import sys

from bson import ObjectId
from fastapi import FastAPI, status
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
import uvicorn

from dal import DAL, ListSummary, ToDoList

COLLECTION_NAME = "todo_lists"
MONGODB_URI = os.environ["MONGO_URL"]
DEBUG = os.getenv("DEBUG", "false").lower() == "true"


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Função de gerenciamento do ciclo de vida da aplicação FastAPI.
    Conecta ao MongoDB na inicialização e desconecta no desligamento.
    """
    client = AsyncIOMotorClient(MONGODB_URI)
    database = client.get_database("todo") 
    
    # Garante que o banco de dados está disponível
    pong = await database.command("ping")
    if not pong.get("ok"):
        raise Exception("Database is not available")

    todo_lists_collection = database.get_collection(COLLECTION_NAME)
    app.todo_dal = DAL(todo_lists_collection)

    yield

    client.close()


app = FastAPI(lifespan=lifespan, debug=DEBUG)


class NewList(BaseModel):
    """Modelo para criar uma nova lista de tarefas."""

    name: str


class NewListResponse(BaseModel):
    """Modelo da resposta após a criação de uma nova lista."""

    id: str
    name: str


class NewItem(BaseModel):
    """Modelo para adicionar um novo item a uma lista."""

    label: str


class NewItemResponse(BaseModel):
    """Modelo da resposta após a criação de um novo item."""

    id: str
    label: str


class ToDoItemUpdate(BaseModel):
    """Modelo para atualizar o estado de um item de tarefa."""

    item_id: str
    checked_state: bool


@app.get("/api/lists", response_model=list[ListSummary])
async def get_all_lists():
    """
    Retorna um resumo de todas as listas de tarefas.
    """
    return [i async for i in app.todo_dal.list_todo_lists()]


@app.post(
    "/api/lists", status_code=status.HTTP_201_CREATED, response_model=NewListResponse
)
async def create_todo_list(new_list: NewList):
    """
    Cria uma nova lista de tarefas.
    """
    return NewListResponse(
        id=await app.todo_dal.create_todo_list(new_list.name),
        name=new_list.name,
    )


@app.get("/api/lists/{list_id}", response_model=ToDoList)
async def get_list(list_id: str):
    """
    Obtém uma lista de tarefas completa pelo seu ID.
    """
    return await app.todo_dal.get_todo_list(list_id)


@app.delete("/api/lists/{list_id}", response_model=bool)
async def delete_list(list_id: str):
    """
    Deleta uma lista de tarefas pelo seu ID.
    """
    return await app.todo_dal.delete_todo_list(list_id)


@app.post(
    "/api/lists/{list_id}/items",
    status_code=status.HTTP_201_CREATED,
    response_model=ToDoList,
)
async def create_todo_list_item(list_id: str, new_item: NewItem):
    """
    Adiciona um novo item a uma lista de tarefas específica.
    """
    return await app.todo_dal.create_todo_list_item(list_id, new_item.label)


@app.delete("/api/lists/{list_id}/items/{item_id}", response_model=ToDoList)
async def delete_todo_list_item(list_id: str, item_id: str):
    """
    Deleta um item específico de uma lista de tarefas.
    """
    return await app.todo_dal.delete_todo_list_item(list_id, item_id)


@app.patch("/api/lists/{list_id}/checked_state", response_model=ToDoList)
async def set_checked(list_id: str, item: ToDoItemUpdate):
    """
    Define o estado 'checado' de um item específico em uma lista de tarefas.
    """
    return await app.todo_dal.set_checked(list_id, item.item_id, item.checked_state)


def main(argv=sys.argv[1:]):
    """Função principal para iniciar o servidor Uvicorn."""
    try:
        uvicorn.run("server:app", host="0.0.0.0", port=3001, reload=DEBUG)
    except KeyboardInterrupt:
        print("Server stopped")


if __name__ == "__main__":
    main()
