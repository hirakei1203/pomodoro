$(function(){

  let status = 0; 
  // 停止中=0, 稼働中=1

  // 各関数の定義---------------------------------------
  // アコーディオン関数
  $( '#acdn-button' ).click( function(){
    $( '#acdn-target' ).slideToggle() ;
    $("i", this).toggleClass("display-none");
  } ) ;

  // "分"が切り替わった際に"秒"に59を入力する関数
  let set59 = function() {
    $(".timeleft_second").html(59);
  }

  // カウントダウン機能を定義する
  let countdown = function(){
    if (status == 1){
      let task_remaining_min = $(".timeleft_min").html();
      let task_remaining_second = $(".timeleft_second").html();
      task_remaining_second_next = task_remaining_second - 1;
      if (task_remaining_second_next == 0){
        task_remaining_min_next = task_remaining_min - 1;
        $(".timeleft_min").html(task_remaining_min_next);
        $(".timeleft_second").html(00);
        setTimeout(set59, 1000);
      }
      else {
        $(".timeleft_second").html(task_remaining_second_next);
      }
    }
  }
  // --------------------------------------------------

  $("#startBTN").click(function(){
  // 毎秒カウントダウンを行う
  status = 1;
  $("#startBTN").prop("disabled", true);
  setInterval(countdown, 1000);
  })

  $("#pauseBTN").click(function(){
  status = 0;
  $("#startBTN").prop("disabled", false);
  })

  // inputタグに入力した数値を、メインタイマーに入力する
  $(".task_min").on("keyup", function(){
    let task_setting_min = $(this).val();
    $(".timeleft_min").html(task_setting_min);
  })

  $(".task_second").on("keyup", function(){
    let task_setting_second = $(this).val();
    $(".timeleft_second").html(task_setting_second);
  })

// スペースキーで操作できるように！
document.onkeydown = function(event) { 
  if (event) {
      if (event.keyCode == 32 || event.which == 32) {
          if(status == 1) {
            status = 0;
            $("#startBTN").prop("disabled", false);
          } else if (status == 0) {
            status = 1;
            $("#startBTN").prop("disabled", true);
            setInterval(countdown, 1000);
          }
      }
  }
};
})

