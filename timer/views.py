from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView
from django.utils import timezone
from .forms import CustomUserCreationForm
from .models import Setlist, Record


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
  input_text = request.POST.getlist("ajax_box")
  current_user_id = request.user.id
  task_min = input_text[0]
  break_min = input_text[2]

  # Setlistモデルに対する処理
  current_setlist = Setlist.objects.get(user_id = current_user_id)
  print(current_setlist)
  current_setlist.workTime = task_min 
  current_setlist.restTime = break_min
  current_setlist.save()
  
  # Recordモデルに対する処理
  # そこにtaskminとrestminを代入する
  # saveする
  # そのsetlistuのレコードを作成する(user_idも入れる)
  # saveする
  current_setlist_id = current_setlist.id
  today = str(timezone.now())
  print(today)
  new_record = Record(setlist_id = current_setlist_id, user_id = current_user_id, date = today)
  new_record.save()
  
  return HttpResponse(current_setlist)

