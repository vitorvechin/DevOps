# Data Access Layer (DAL) for the application

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from pymongo import ReturnDocument
from pydantic import BaseModel
from uuid import uuid4
from typing import Optional


class ListSummary(BaseModel):
    id: str
    name: str
    item_count: int

    @staticmethod
    def from_doc(doc) -> "ListSummary":
        return ListSummary(
            id=str(doc["_id"]),
            name=doc["name"],
            item_count=doc["item_count"],
        )


class ToDoListItem(BaseModel):
    id: str
    label: str

    description: Optional[str] = (
        None  # Use Field(default=None) se quiser um valor padrão mais explícito
    )
    checked: bool

    @staticmethod
    def from_doc(doc) -> "ToDoListItem":
        return ToDoListItem(
            id=str(doc["id"]),
            # CORREÇÃO AQUI: Leia 'label' do documento, não 'name'
            label=doc["label"],
            # CORREÇÃO AQUI: Use .get() para campos opcionais para evitar KeyError
            description=doc.get("description"),
            checked=doc["checked"],
        )


class ToDoList(BaseModel):
    id: str
    name: str
    items: list[ToDoListItem]

    @staticmethod
    def from_doc(doc) -> "ToDoList":
        return ToDoList(
            id=str(doc["_id"]),
            name=doc["name"],
            items=[ToDoListItem.from_doc(item) for item in doc["items"]],
        )


class DAL:
    def __init__(self, todo_collection: AsyncIOMotorCollection):
        # A coleção é armazenada como um atributo da instância
        self.todo_collection = todo_collection

    # MÉTODOS DA CLASSE DAL (agora desindentados corretamente)

    async def list_todo_lists(self, session=None):
        async for (
            doc
        ) in self.todo_collection.find(  # Usando self.todo_collection consistentemente
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
        response = await self.todo_collection.insert_one(  # Usando self.todo_collection consistentemente
            {"name": name, "items": []},
            session=session,
        )
        return str(response.inserted_id)

    async def get_todo_list(self, list_id: str | ObjectId, session=None) -> ToDoList:
        doc = await self.todo_collection.find_one(  # Usando self.todo_collection consistentemente
            {"_id": ObjectId(list_id)},
            session=session,
        )
        return ToDoList.from_doc(doc)

    async def delete_todo_list(self, list_id: str | ObjectId, session=None) -> bool:
        response = await self.todo_collection.delete_one(  # Usando self.todo_collection consistentemente
            {"_id": ObjectId(list_id)},
            session=session,
        )
        return response.deleted_count == 1

    async def create_todo_list_item(
        self, list_id: str | ObjectId, label: str, session=None
    ) -> ToDoList | None:
        response = await self.todo_collection.find_one_and_update(  # Usando self.todo_collection consistentemente
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
        response = await self.todo_collection.find_one_and_update(  # Usando self.todo_collection consistentemente
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

    async def delete_item(
        self,
        doc_id: str | ObjectId,
        item_id: str,
        session=None,
    ) -> ToDoList | None:
        response = await self.todo_collection.find_one_and_update(  # Usando self.todo_collection consistentemente
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
