from django.conf.urls import url

from game.views import game
from . import views

app_name = 'game'
urlpatterns = [
    url(r'^(?P<game_name>[^/]+)/(?P<player_id>[^/]+)/$', views.game, name='room'),
]
