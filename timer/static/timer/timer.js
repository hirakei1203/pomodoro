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

  // カウントダウン機能を定義する
  let countdown = function(){
    if (status == 1){
      let task_remaining_min = $(".timeleft_min").html();
      let task_remaining_second = $(".timeleft_second").html();
      task_remaining_second_next = task_remaining_second - 1;
      task_remaining_min_next = task_remaining_min - 1;
      if (task_remaining_min == 0 && task_remaining_second == 0){
        $(".card_color").toggleClass("orange green");
        $(".status-name").toggleClass("display-none");
        // 休憩時間をセットしないと。。。！非同期通信でできるだろうか
        // $(".timeleft_min").html(休憩時間[min]);
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
  // --------------------------------------------------

  $("#startBTN").click(function(){
  // 毎秒カウントダウンを行う
  status = 1;
  $("#startBTN").prop("disabled", true);
  timerID = setInterval(countdown, 1000);
  })

  $("#pauseBTN").click(function(){
  status = 0; 
  timerID2 = clearInterval(timerID);
  $("#startBTN").prop("disabled", false);
  })

  // $("#skipBTN").click(function({
  // 二週目のアイドリング状態に戻る記述
  // })

  // inputタグに入力した数値を、メインタイマーに入力する
  $(".task_min").on("keyup", function(){
    let task_setting_min = $(this).val();
    $(".timeleft_min").html(task_setting_min);
  })

  $(".task_second").on("keyup", function(){
    let task_setting_second = $(this).val();
    $(".timeleft_second").html(task_setting_second);
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
    alert("done");
    $("#id_div_ajax_response").text(data);
  })
})



// スペースキーで操作できるように！
document.onkeydown = function(event) { 
  if (event) {
      if (event.keyCode == 32 || event.which == 32) {
          if(status == 1) {
            status = 0; 
            timerID2 = clearInterval(timerID);
            $("#startBTN").prop("disabled", false);
          } else if (status == 0) {
            status = 1;
            $("#startBTN").prop("disabled", true);
            timerID = setInterval(countdown, 1000);
          }
      }
      if(event.keyCode == 40 || event.which == 40){
        $( '#acdn-target' ).slideToggle() ;
        $("i", this).toggleClass("display-none");
      }
  }
};



})

