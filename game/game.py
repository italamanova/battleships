import json

from game.models import Game, ShipPlacement, Ship, Move


def place_ships(game_name, player_number, place_json):
    '''
    :param game_name:
    :param player_number:
    :return:
    '''


    game, created = Game.objects.get_or_create(name=game_name)

    ships_placement_data = json.loads(place_json)
    ships_data = ships_placement_data.get('ships')

    for _ship in ships_data:
        ship = Ship.objects.create(name=_ship.get('ship_name'),
                                   size=_ship.get('ship_size'),
                                   game=game,
                                   player=player_number)
        ship_placement = _ship.get('ship_placement')
        for place in ship_placement:
            ShipPlacement.objects.create(ship=ship,
                                         x=place.get('x'),
                                         y=place.get('y'))

    # # TODO
    # game.status = 2
    # game.save()

    return game


def move(game_name, player_number):
    myjson = json.dumps({'x': 1, 'y': 1})

    game = Game.objects.get(name=game_name)
    player_ships = Ship.objects.filter(game=game, player=player_number)

    move_data = json.loads(myjson)

    ship_x = move_data.get('x')
    ship_y = move_data.get('y')

    current_move = Move.objects.create(game=game, player=player_number, x=ship_x, y=ship_y)
    hit = False
    for ship in player_ships:
        hit = ShipPlacement.objects.filter(ship=ship, x=ship_x, y=ship_y).exists()
    current_move.hit = hit

    return hit
