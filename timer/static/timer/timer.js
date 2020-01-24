$(function(){

  let timerID, timerID2;
  let status = 0; 
  let cycletime = 0;
  // 停止中=0, 稼働中=1, 休憩中=2, 長休憩中=3

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
    current_task_min = $(".timeleft_min").html();
    current_rest_min = $(".timeleft_rest_min").html();
    console.log(current_rest_min);
    timerID = setInterval(countdown, 1000);
  }

  let pause_timer = function(){
    status = 0; 
    timerID2 = clearInterval(timerID);
    $("#startBTN").prop("disabled", false);
    $(".time_box").prop("disabled", false);
  }


  // カウントダウン機能を定義する
  let countdown = function(){
    if (status == 1){
      let task_remaining_min = $(".timeleft_min").html();
      let task_remaining_second = $(".timeleft_second").html();
      task_remaining_second_next = task_remaining_second - 1;
      task_remaining_min_next = task_remaining_min - 1;
      $(".time_box").prop("disabled", true);
      if (task_remaining_min == 0 && task_remaining_second == 1){
        $(".timeleft_min").html(current_rest_min);
        $(".timeleft_second").html(00);
        $(".card_color").toggleClass("orange green");
        $(".status-name").toggleClass("display-none");
        $(".ajax_starter").trigger('click');
        status = 2;
        cycletime += 1;
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
    else if (status == 2){
      let task_remaining_min = $(".timeleft_min").html();
      let task_remaining_second = $(".timeleft_second").html();
      task_remaining_second_next = task_remaining_second - 1;
      task_remaining_min_next = task_remaining_min - 1;
      if (task_remaining_min == 0 && task_remaining_second == 1){
        $(".timeleft_min").html(current_task_min);
        $(".timeleft_second").html(00);
        $(".card_color").toggleClass("orange green");
        $(".status-name").toggleClass("display-none");
        $(".ajax_starter").trigger('click');
        status = 0;
        cycletime += 1;
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
    // else if (cycletime == xxx){
    //   DBからxxxに設定値を持ってこれるかしら？
    // }
  }
  // ここまで関数定義--------------------------------------------------

  $("#startBTN").click(function(){
  // 毎秒カウントダウンを行う
    start_timer();
  })

  $("#pauseBTN").click(function(){
    pause_timer();
  })

  // $("#skipBTN").click(function({
  // 二週目のアイドリング状態に戻る記述
  // })

  // inputタグに入力した数値を、メインタイマーに入力する
  // 休憩時間の時に休憩時間を入力できないエラー
  let input_field = function(){
  if (status == 0){
  $(".task_min").on("keyup", function(){
    let task_setting_min = $(this).val();
    $(".timeleft_min").html(task_setting_min);
  })

  $(".task_second").on("keyup", function(){
    let task_setting_second = $(this).val();
    $(".timeleft_second").html(task_setting_second);
  })
  } else if (status == 2) {
  $(".break_second").on("keyup", function(){
    let rest_setting_second = $(this).val();
    $(".timeleft_second").html(rest_setting_second);
  })
  }
  }
 


  $(".break_min").on("keyup", function(){
    let rest_setting_second = $(this).val();
    $(".timeleft_rest_min").html(rest_setting_second);
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

input_field();

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

