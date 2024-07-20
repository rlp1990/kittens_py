from motor.motor_asyncio import AsyncIOMotorClient
from app.models import Kitten
from bson import ObjectId

class MongoDB:
    def __init__(self, uri, db_name):
        self.client = AsyncIOMotorClient(uri)
        self.db = self.client[db_name]

    async def create_kitten(self, kitten: Kitten):
        result = await self.db.kittens.insert_one(kitten.dict())
        return str(result.inserted_id)

    async def get_kitten(self, kitten_id: str):
        result = await self.db.kittens.find_one({"_id": ObjectId(kitten_id)})
        return Kitten(**result) if result else None

    async def update_kitten(self, kitten_id: str, kitten: Kitten):
        await self.db.kittens.update_one({"_id": ObjectId(kitten_id)}, {"$set": kitten.dict()})
        return await self.get_kitten(kitten_id)

    async def delete_kitten(self, kitten_id: str):
        await self.db.kittens.delete_one({"_id": ObjectId(kitten_id)})

    async def list_kittens(self):
        kittens = []
        async for kitten in self.db.kittens.find():
            kittens.append(Kitten(**kitten))
        return kittens
