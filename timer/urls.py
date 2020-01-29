from django.urls import path

from . import views

app_name = "timer"

urlpatterns = [
    path('', views.index, name='index'),
    path('setlist/<int:pk>/', views.SetlistDetailView.as_view(), name="user_timer_page"),
    path('signup/', views.signup, name='signup'),
    path('ajax/', views.test_ajax_response),
    ]