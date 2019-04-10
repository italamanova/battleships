import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

from game.game import placement
from game.models import Game


class GameConsumer(WebsocketConsumer):
    def connect(self):
        self.game_name = self.scope['url_route']['kwargs']['game_name']
        self.player_id = self.scope['url_route']['kwargs']['player_id']
        self.game_group_name = 'chat_%s' % self.game_name

        placement(self.game_name, self.player_id)

        # Join game group
        async_to_sync(self.channel_layer.group_add)(
            self.game_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave game group
        async_to_sync(self.channel_layer.group_discard)(
            self.game_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to game group
        async_to_sync(self.channel_layer.group_send)(
            self.game_group_name,
            {
                'type': 'move_message',
                'move': message
            }
        )

    # Receive message from game group
    def move_message(self, event):
        message = event['move']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message
        }))
