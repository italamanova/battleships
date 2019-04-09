from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer


class MoveConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        await self.channel_layer.group_add("chat", self.channel_name)

    async def disconnect(self):
        await self.channel_layer.group_discard("chat", self.channel_name)