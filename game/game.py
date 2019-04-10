import json

from django.db.models import Q

from game.models import Game, Player


def placement(game_name, player_id):
    '''
    :param game_name:
    :param player_uuid:
    :param ships_placement_json:
    :return:
    '''

    myjson = json.dumps({'player_uuid': 1,
                         'placement':
                             [{'ship_id': 1, 'x': 1, 'y': 1},
                              {'ship_id': 2, 'x': 2, 'y': 2}]
                         })

    player = Player.objects.get(pk=player_id)
    game = Game.objects.get(name=game_name)
    print(Game)

    ships_placement_data = json.loads(myjson)


def move(game_name, palyer_uuid):
    pass
