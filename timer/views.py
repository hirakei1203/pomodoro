from django.contrib.auth import login
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth.forms import UserCreationForm
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect, resolve_url
from django.views.generic import ListView, DetailView
from django.utils import timezone
from django.urls import reverse_lazy, reverse
from django.http import HttpResponseRedirect
from .forms import CustomUserCreationForm, LoginForm
from .models import Setlist, Record
import datetime
import matplotlib.pyplot as plt
import pytz


def index(request):
    return render(request, "timer/index.html")

def signup(request):
  if request.method == 'POST':
      form = CustomUserCreationForm(request.POST)
      if form.is_valid():
          user_instance =  form.save()
          login(request, user_instance)
          pk = user_instance.id
          default_setlist = Setlist(id = pk, workTime = 25, restTime = 5, cycleNumber = 4, longRestTime = 15, user_id = pk)
          default_setlist.save()
          print(pk)
          return redirect("timer:index")
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
  template_name = 'registration/login.html'

  def get_success_url(self):
    print('success')
    url = self.get_redirect_url()
    # return resolve_url('timer:user_timer_page', pk=self.request.user.pk)
    setlist_id = Setlist.objects.get(user_id = self.request.user.pk).id
    return reverse('timer:user_timer_page', kwargs={'pk': setlist_id})
    # url = reverse('timer:user_timer_page', kwargs={'pk': setlist_id})
    # return HttpResponseRedirect(url)

class LogoutView(LogoutView):
    """ログアウトページ"""
    template_name = 'timer/logout.html'

class SetlistDetailView(LoginRequiredMixin, DetailView):
  model = Setlist
  template_name = "timer/user_timer.html"

def calculation_daily_total_time(list):
    daily_total_time = 0
    for single_record in list:
      single_workTime = single_record.setlist.workTime
      daily_total_time += single_workTime
    return daily_total_time

def draw_graph():
    # 折れ線グラフを出力
    today = datetime.date.today()
    day1 = today - datetime.timedelta(days=6)
    day2 = today - datetime.timedelta(days=5)
    day3 = today - datetime.timedelta(days=4)
    day4 = today - datetime.timedelta(days=3)
    day5 = today - datetime.timedelta(days=2)
    day6 = today - datetime.timedelta(days=1)

    day1_data = Record.objects.filter(date__date=day1)
    day2_data = Record.objects.filter(date__date=day2)
    day3_data = Record.objects.filter(date__date=day3)
    day4_data = Record.objects.filter(date__date=day4)
    day5_data = Record.objects.filter(date__date=day5)
    day6_data = Record.objects.filter(date__date=day6)
    day7_data = Record.objects.filter(date__date=today)

    # day1_total_workTime = calculation_daily_total_time(day1_data)

    daily_total_time = []
    day = [day1, day2, day3, day4, day5, day6, today]
    daily_total_time.append(calculation_daily_total_time(day1_data))
    daily_total_time.append(calculation_daily_total_time(day2_data))
    daily_total_time.append(calculation_daily_total_time(day3_data))
    daily_total_time.append(calculation_daily_total_time(day4_data))
    daily_total_time.append(calculation_daily_total_time(day5_data))
    daily_total_time.append(calculation_daily_total_time(day6_data))
    daily_total_time.append(calculation_daily_total_time(day7_data))
    
    text_day = ','.join(list(map(str, day)))
    text_time = ','.join(list(map(str, daily_total_time)))
    yokoziku = str(text_day)
    tateziku = str(text_time)
    print(text_day)
    print(yokoziku)

    json_template = """{
            type: 'bar',
            data: {
                labels: [
        """ + str(text_day) + """ 
                ],
                datasets: [{
                    label: '支出',
                    data: [
        """ + str(text_time) + """   
                    ],
                    borderWidth: 2,
                    strokeColor: 'rgba(0,0,255,1)',   
                    backgroundColor: 'rgba(0,191,255,0.5)'    
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero:true
                        },
                        scaleLabel: {
                            display: true, 
                            labelString: '日付',
                            fontsize: 18
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        },
                        scaleLabel: {
                            display: true,
                            labelString: '支出額 (円)',
                            fontsize: 18
                        }
                    }]
                },
                responsive: true
            }
        }"""
    
    # json_template = """var json = {
    #   type: 'bar',
    #       data: {
    #           labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    #           datasets: [{
    #               label: '# of Votes',
    #               data: [12, 19, 3, 5, 2, 3],
    #               backgroundColor: [
    #                   'rgba(255, 99, 132, 0.2)',
    #                   'rgba(54, 162, 235, 0.2)',
    #                   'rgba(255, 206, 86, 0.2)',
    #                   'rgba(75, 192, 192, 0.2)',
    #                   'rgba(153, 102, 255, 0.2)',
    #                   'rgba(255, 159, 64, 0.2)'
    #               ],
    #               borderColor: [
    #                   'rgba(255, 99, 132, 1)',
    #                   'rgba(54, 162, 235, 1)',
    #                   'rgba(255, 206, 86, 1)',
    #                   'rgba(75, 192, 192, 1)',
    #                   'rgba(153, 102, 255, 1)',
    #                   'rgba(255, 159, 64, 1)'
    #               ],
    #               borderWidth: 1
    #           }]
    #       },
    #       options: {
    #           scales: {
    #               yAxes: [{
    #                   ticks: {
    #                       beginAtZero: true
    #                   }
    #               }]
    #           }
    #       }
    #     }
    # """


    # with open('timer/static/timer/data.js', 'w') as f:
    #     f.write(json_template)


class RecordDetailView(LoginRequiredMixin, DetailView):
  model = Record
  template_name = "timer/record_detail.html"
  
  def get_context_data(self, **kwargs):
          context = super().get_context_data(**kwargs) # はじめに継承元のメソッドを呼び出す
          today = datetime.date.today()
          day1 = today - datetime.timedelta(days=6)
          day2 = today - datetime.timedelta(days=5)
          day3 = today - datetime.timedelta(days=4)
          day4 = today - datetime.timedelta(days=3)
          day5 = today - datetime.timedelta(days=2)
          day6 = today - datetime.timedelta(days=1)

          day1_data = Record.objects.filter(date__date=day1)
          day2_data = Record.objects.filter(date__date=day2)
          day3_data = Record.objects.filter(date__date=day3)
          day4_data = Record.objects.filter(date__date=day4)
          day5_data = Record.objects.filter(date__date=day5)
          day6_data = Record.objects.filter(date__date=day6)
          day7_data = Record.objects.filter(date__date=today)

          daily_total_time = []
          day = [day1, day2, day3, day4, day5, day6, today]
          daily_total_time.append(calculation_daily_total_time(day1_data))
          daily_total_time.append(calculation_daily_total_time(day2_data))
          daily_total_time.append(calculation_daily_total_time(day3_data))
          daily_total_time.append(calculation_daily_total_time(day4_data))
          daily_total_time.append(calculation_daily_total_time(day5_data))
          daily_total_time.append(calculation_daily_total_time(day6_data))
          daily_total_time.append(calculation_daily_total_time(day7_data))
          
          text_day = ','.join(list(map(str, day)))
          text_time = ','.join(list(map(str, daily_total_time)))
          yokoziku = str(text_day)
          tateziku = str(text_time)

          context["tateziku"] = tateziku
          return context



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


