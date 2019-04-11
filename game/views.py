import json

from django.shortcuts import render
from django.utils.safestring import mark_safe


def game(request, game_name, player):
    return render(request, 'game/game.html', {
        'game_name': mark_safe(json.dumps(game_name)),
        'player': player
    })
