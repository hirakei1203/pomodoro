from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('', views.TimerListView.as_view(), name="user_timer_page_")
    path('signup/', views.signup, name='signup'),
]