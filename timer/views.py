from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView
from .forms import CustomUserCreationForm
from .models import Setlist


def index(request):
    return render(request, "timer/index.html")

def signup(request):
  if request.method == 'POST':
      form = CustomUserCreationForm(request.POST)
      if form.is_valid():
          user_instance =  form.save()
          login(request, user_instance)
          return redirect('index')
  else:
      form = CustomUserCreationForm()

  context = {
    "form": form
  }
  return render(request, 'timer/signup.html', context)
      
      
# Create your views here.

class SetlistDetailView(LoginRequiredMixin, DetailView):
  model = Setlist
  template_name = "timer/user_timer.html"

def test_ajax_response(request):
  input_text = request.POST.getlist("task_min")
  print(input_text)
  hoge = input_text[0]

  return HttpResponse(hoge)

