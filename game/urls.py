from django.conf.urls import url

from game.views import user_list
from . import views

app_name = 'game'
urlpatterns = [
    url(r'^$', user_list, name='user_list'),
]

