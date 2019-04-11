import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

from game.game import place_ships


class GameConsumer(WebsocketConsumer):
    def connect(self):
        self.game_name = self.scope['url_route']['kwargs']['game_name']
        self.player = self.scope['url_route']['kwargs']['player']
        self.game_group_name = 'chat_%s' % self.game_name

        # Join game group
        async_to_sync(self.channel_layer.group_add)(
            self.game_group_name,
            self.channel_name
        )

        self.accept()

        myjson = json.dumps({'ships': [{'ship_name': 'ship',
                                        'ship_size': 1,
                                        'ship_placement': [{'x': 1, 'y': 1},
                                                           {'x': 1, 'y': 2}]
                                        }]})

        self.game = place_ships(self.game_name, self.player, myjson)

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.game_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        # message = text_data_json['message']

        print(self.game.status)

        async_to_sync(self.channel_layer.group_send)(
            self.game_group_name,
            {
                'type': 'move_message',
                'move': text_data_json
            }
        )

    # Receive message from game group
    def move_message(self, event):
        message = event['move']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message
        }))
