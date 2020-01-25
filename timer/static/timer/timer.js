$(function(){

  let timerID, timerID2;
  let status = 0; 
  // 停止中=0, 稼働中=1
  let cycletime = 0;
  let task_status = 0;
  // タスク中=0, 休憩中=1, 長休憩中=2


  // 各関数の定義---------------------------------------
  // アコーディオン関数
  $( '#acdn-button' ).click( function(){
    $( '#acdn-target' ).slideToggle() ;
    $("i", this).toggleClass("display-none");
  } ) ;

  // "分"が切り替わった際に"秒"に59を入力する関数
  let nextmin = function() {
    $(".timeleft_second").html(59);
    $(".timeleft_min").html(task_remaining_min_next);
  }


  let start_timer = function(){
    status = 1;
    $("#startBTN").prop("disabled", true);
    current_task_min = $(".timeleft_task_min").html();
    current_rest_min = $(".timeleft_rest_min").html();
    timerID = setInterval(countdown, 1000);
  }

  let pause_timer = function(){
    status = 0; 
    timerID2 = clearInterval(timerID);
    $("#startBTN").prop("disabled", false);
    $(".time_box").prop("disabled", false);
  }

  let skip_timer = function(){
    task_status_exchange();
    console.log(current_task_min);
    if (task_status == 0){        
      task_status = 1;
      $(".timeleft_min").html(current_rest_min);
    }
    else if (task_status == 1){
      task_status = 0;
      $(".timeleft_min").html(current_task_min);
    }
    if (status == 1) {  
      pause_timer();
    }
    status = 0;
  }

  let task_status_exchange = function(){
    $(".timeleft_second").html(00);
    $(".card_color").toggleClass("orange green");
    $(".status-name").toggleClass("display-none");
    
  }

  // カウントダウン機能を定義する
  let countdown = function(){
      let task_remaining_min = $(".timeleft_min").html();
      let task_remaining_second = $(".timeleft_second").html();
      task_remaining_second_next = task_remaining_second - 1;
      task_remaining_min_next = task_remaining_min - 1;
      $(".time_box").prop("disabled", true);
      if (task_remaining_min == 0 && task_remaining_second == 1 && task_status == 0){
        task_status_exchange();
        $(".timeleft_min").html(current_rest_min);
        $(".ajax_starter").trigger('click');
        task_status = 1;
        cycletime += 1;
      }
      else if (task_remaining_min == 0 && task_remaining_second == 1 && task_status == 1){
        task_status_exchange();
        $(".timeleft_min").html(current_task_min);
        task_status = 0;
        cycletime += 1;
        pause_timer();
      }
      else if (task_remaining_second == 0){
        nextmin();
      }
      else if (task_remaining_second_next == 0){        
        $(".timeleft_second").html(00);
        setTimeout(nextmin, 1000);
      }
      else {
        $(".timeleft_second").html(task_remaining_second_next);
      }

    }

    // inputタグに入力した数値を、メインタイマーに入力する
    let input_field = function(){
      if (task_status == 0){
        let task_setting_min = $(".task_min").val();
        let task_setting_second = $(".task_second").val();
        $(".timeleft_min").html(task_setting_min);
        $(".timeleft_second").html(task_setting_second);
      } 
      else if (task_status == 1) {
        let rest_setting_min = $(".break_min").val();
        let rest_setting_second = $(".break_second").val();
        $(".timeleft_min").html(rest_setting_min);
        $(".timeleft_second").html(rest_setting_second);
      }
    }
    // else if (cycletime == xxx){
    //   DBからxxxに設定値を持ってこれるかしら？
    // }

  // ここまで関数定義--------------------------------------------------

  $("#startBTN").click(function(){
  // 毎秒カウントダウンを行う
    start_timer();
  })

  $("#pauseBTN").click(function(){
    pause_timer();
  })

  $("#skipBTN").click(function(){
    skip_timer();
  })


// ajax
$("form").submit(function(event){
  event.preventDefault();
  var form = $(this);
  $.ajax({
    url: form.prop("action"),
    method: form.prop("method"),
    data: form.serialize(),
    timeout: 10000,
    dataType: "text",
  })
  .done(function(data){
    $("#id_div_ajax_response").text(data);
  })
})


$(".time_box").on("keyup", function(){
  input_field();
})

// スペースキーで操作できるように！
document.onkeydown = function(event) { 
  if (event) {
      if (event.keyCode == 32 || event.which == 32) {
          if(status == 1) {
            pause_timer();
          } else if (status == 0) {
            start_timer();
          }
      }
      if(event.keyCode == 40 || event.which == 40){
        $( '#acdn-target' ).slideToggle() ;
        $("i", this).toggleClass("display-none");
      }
  }
};



})

