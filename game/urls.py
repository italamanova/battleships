from django.conf.urls import url

from game.views import game
from . import views

app_name = 'game'
urlpatterns = [
    url(r'^(?P<game_name>[^/]+)/(?P<player>[^/]+)/$', views.game, name='game'),
    # url(r'^(?P<game_name>[^/]+)/$', views.new_game, name='new_game'),
]
