import json

from game.models import Game, Player, ShipPlacement, Ship, Move


def placement(game_name, player_id):
    '''
    :param game_name:
    :param player_uuid:
    :param ships_placement_json:
    :return:
    '''

    myjson = json.dumps({'ships': [{'ship_name': 'ship',
                                    'ship_size': 1,
                                    'ship_placement': [{'x': 1, 'y': 1},
                                                       {'x': 1, 'y': 2}]
                                    }]})
    game = Game.objects.get(name=game_name)
    player = Player.objects.get(pk=player_id)

    ships_placement_data = json.loads(myjson)
    ships_data = ships_placement_data.get('ships')

    for _ship in ships_data:
        ship = Ship.objects.create(name=_ship.get('ship_name'),
                                   size=_ship.get('ship_size'),
                                   game=game,
                                   player=player)
        ship_placement = _ship.get('ship_placement')
        for place in ship_placement:
            ShipPlacement.objects.create(ship=ship,
                                         x=place.get('x'),
                                         y=place.get('y'))

    # TODO
    game.status = 2
    game.save()


def move(game_name, player_id):
    myjson = json.dumps({'x': 1, 'y': 1})

    game = Game.objects.get(name=game_name)
    player = Player.objects.get(pk=player_id)

    move_data = json.loads(myjson)

    ship_x = move_data.get('x')
    ship_y = move_data.get('y')

    move = Move.objects.create(game=game, player=player, x=ship_x, y=ship_y)
    hit = ShipPlacement.objects.filter(game=game, x=ship_x, y=ship_y).exists()

    return hit
