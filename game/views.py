import json

from django.shortcuts import render
from django.utils.safestring import mark_safe


def game(request, game_name, player_id):
    return render(request, 'game/base.html', {
        'room_name_json': mark_safe(json.dumps(game_name)),
        'player_id': player_id
    })
