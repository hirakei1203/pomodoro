from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
from django.http import HttpResponse

def index(request):
    return render(request, "timer/index.html")

def signup(request):
  if request.mtehod == 'POST':
    form = UserCreationForm(request.POST)
    if form.is_valid():
      user_instacnce =  form.save()
      login()

# Create your views here.
