from django.contrib.auth import login
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth.forms import UserCreationForm
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect, resolve_url
from django.views.generic import ListView, DetailView
from django.utils import timezone
from django.urls import reverse_lazy
from .forms import CustomUserCreationForm, LoginForm
from .models import Setlist, Record


def index(request):
    return render(request, "timer/index.html")

def signup(request):
  if request.method == 'POST':
      form = CustomUserCreationForm(request.POST)
      if form.is_valid():
          user_instance =  form.save()
          login(request, user_instance)
          pk = user_instance.id
          default_setlist = Setlist(workTime = 25, restTime = 5, cycleNumber = 4, longRestTime = 15, user_id = pk)
          default_setlist.save()
          print(pk)
          # return render(request, 'timer:user_timer_page', pk)
          success_url = reverse_lazy("timer:user_timer_page")

      else:
        print("invalid")
  else:
      form = CustomUserCreationForm()

  context = {
    "form": form
  }
  return render(request, 'timer/signup.html', context)

# Create your views here.

class LoginView(LoginView):
  """ログインページ"""
  form_class = LoginForm
  # template_name = 'timer/login.html'

  def get_success_url(self):
    print('success')
    url = self.get_redirect_url()
    # success_url = reverse_lazy('timer:user_timer_page', pk=self.request.user.pk)
    # return url or resolve_url('timer:user_timer_page', pk=self.request.user.pk)
    return 

class LogoutView(LogoutView):
    """ログアウトページ"""
    template_name = 'timer/logout.html'

class SetlistDetailView(LoginRequiredMixin, DetailView):
  model = Setlist
  template_name = "timer/user_timer.html"

def test_ajax_response(request):
  # データのセット
  input_text = request.POST.getlist("ajax_box")
  current_user_id = request.user.id
  task_min = input_text[0]
  break_min = input_text[2]
  today = str(timezone.now())

  # Setlistモデルに対する処理
  current_setlist = Setlist.objects.get(user_id = current_user_id)
  current_setlist.workTime = task_min 
  current_setlist.restTime = break_min
  current_setlist.save()
  
  # Recordモデルに対する処理
  current_setlist_id = current_setlist.id
  new_record = Record(setlist_id = current_setlist_id, user_id = current_user_id, date = today)
  new_record.save()
  
  return HttpResponse(current_setlist)


