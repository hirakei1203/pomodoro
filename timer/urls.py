from django.urls import path

from . import views

urlpatterns = [
    # path('', views.index, name='index'),
    path('', views.TimerListView)
    path('signup/', views.signup, name='signup'),
]