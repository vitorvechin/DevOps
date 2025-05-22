# Data Access Layer (DAL) for the application

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from pymongo import ReturnDocument
from pydantic import BaseModel
from uuid import uuid4
from typing import Optional


class ListSummary(BaseModel):
    """
    Representa um resumo de uma lista de tarefas.
    Usado para exibir informações básicas da lista.
    """

    id: str
    name: str
    item_count: int

    @staticmethod
    def from_doc(doc) -> "ListSummary":
        """Converte um documento MongoDB em um objeto ListSummary."""
        return ListSummary(
            id=str(doc["_id"]),
            name=doc["name"],
            item_count=doc["item_count"],
        )


class ToDoListItem(BaseModel):
    """
    Representa um item individual dentro de uma lista de tarefas.
    """

    id: str
    label: str
    checked: bool

    @staticmethod
    def from_doc(doc) -> "ToDoListItem":
        """Converte um subdocumento MongoDB de item em um objeto ToDoListItem."""
        return ToDoListItem(
            id=str(doc["id"]),
            label=doc["label"],
            checked=doc["checked"],
        )


class ToDoList(BaseModel):
    """
    Representa uma lista de tarefas completa, incluindo seus itens.
    """

    id: str
    name: str
    items: list[ToDoListItem]

    @staticmethod
    def from_doc(doc) -> "ToDoList":
        """Converte um documento MongoDB de lista em um objeto ToDoList."""
        return ToDoList(
            id=str(doc["_id"]),
            name=doc["name"],
            items=[ToDoListItem.from_doc(item) for item in doc["items"]],
        )


class DAL:
    """
    Camada de Acesso a Dados (DAL) para interagir com a coleção de listas de tarefas no MongoDB.
    """

    def __init__(self, todo_collection: AsyncIOMotorCollection):
        """
        Inicializa a DAL com uma coleção assíncrona do Motor MongoDB.
        Args:
            todo_collection: A coleção do Motor MongoDB para listas de tarefas.
        """
        self.todo_collection = todo_collection

    async def list_todo_lists(self, session=None):
        """
        Lista todos os resumos de listas de tarefas disponíveis.
        Retorna um gerador assíncrono de ListSummary.
        """
        async for doc in self.todo_collection.find(
            {},
            projection={
                "name": 1,
                "item_count": {"$size": "$items"},
            },
            sort={"name": 1},
            session=session,
        ):
            yield ListSummary.from_doc(doc)

    async def create_todo_list(self, name: str, session=None) -> str:
        """
        Cria uma nova lista de tarefas no banco de dados.
        Args:
            name: O nome da nova lista de tarefas.
        Returns:
            O ID da lista de tarefas recém-criada.
        """
        response = await self.todo_collection.insert_one(
            {"name": name, "items": []},
            session=session,
        )
        return str(response.inserted_id)

    async def get_todo_list(self, list_id: str | ObjectId, session=None) -> ToDoList:
        """
        Obtém uma lista de tarefas completa pelo seu ID.
        Args:
            list_id: O ID da lista de tarefas.
        Returns:
            Um objeto ToDoList.
        """
        doc = await self.todo_collection.find_one(
            {"_id": ObjectId(list_id)},
            session=session,
        )
        return ToDoList.from_doc(doc)

    async def delete_todo_list(self, list_id: str | ObjectId, session=None) -> bool:
        """
        Deleta uma lista de tarefas pelo seu ID.
        Args:
            list_id: O ID da lista de tarefas a ser deletada.
        Returns:
            True se a lista foi deletada, False caso contrário.
        """
        response = await self.todo_collection.delete_one(
            {"_id": ObjectId(list_id)},
            session=session,
        )
        return response.deleted_count == 1

    async def create_todo_list_item(
        self, list_id: str | ObjectId, label: str, session=None
    ) -> ToDoList | None:
        """
        Adiciona um novo item a uma lista de tarefas existente.
        Args:
            list_id: O ID da lista à qual o item será adicionado.
            label: O rótulo/conteúdo do novo item.
        Returns:
            A lista de tarefas atualizada com o novo item, ou None se a lista não for encontrada.
        """
        response = await self.todo_collection.find_one_and_update(
            {"_id": ObjectId(list_id)},
            {
                "$push": {
                    "items": {
                        "id": uuid4().hex,
                        "label": label,
                        "checked": False,
                    }
                }
            },
            return_document=ReturnDocument.AFTER,
            session=session,
        )
        return ToDoList.from_doc(response) if response else None

    async def set_checked(
        self,
        doc_id: str | ObjectId,
        item_id: str,
        checked_state: bool,
        session=None,
    ) -> ToDoList | None:
        """
        Define o estado 'checked' de um item específico em uma lista de tarefas.
        Args:
            doc_id: O ID da lista de tarefas.
            item_id: O ID do item a ser atualizado.
            checked_state: O novo estado (True para checado, False para não checado).
        Returns:
            A lista de tarefas atualizada, ou None se a lista/item não for encontrado.
        """
        response = await self.todo_collection.find_one_and_update(
            {
                "_id": ObjectId(doc_id),
                "items.id": item_id,
            },
            {
                "$set": {
                    "items.$.checked": checked_state,
                }
            },
            return_document=ReturnDocument.AFTER,
            session=session,
        )
        return ToDoList.from_doc(response) if response else None

    async def delete_todo_list_item(
        self,
        doc_id: str | ObjectId,
        item_id: str,
        session=None,
    ) -> ToDoList | None:
        """
        Deleta um item específico de uma lista de tarefas.
        Args:
            doc_id: O ID da lista de tarefas.
            item_id: O ID do item a ser deletado.
        Returns:
            A lista de tarefas atualizada, ou None se a lista/item não for encontrado.
        """
        response = await self.todo_collection.find_one_and_update(
            {
                "_id": ObjectId(doc_id),
            },
            {
                "$pull": {
                    "items": {"id": item_id},
                }
            },
            return_document=ReturnDocument.AFTER,
            session=session,
        )
        return ToDoList.from_doc(response) if response else None
