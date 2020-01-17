from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('setlist/<int:pk>/', views.SetlistDetailView.as_view(), name="user_timer_page"),
    path('signup/', views.signup, name='signup'),
]