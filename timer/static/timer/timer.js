$(function(){

  // ドロップダウンを作る場合、以下コードとmaterializeを活用する
  $(".dropdown-trigger").dropdown();

  console.log("aaa");

  $(".task_min").on("keyup", function(){
    let task_setting_min = $(this).val();
    $(".timeleft_min").html(task_setting_min);
  })

  $(".task_second").on("keyup", function(){
    let task_setting_second = $(this).val();
    $(".timeleft_second").html(task_setting_second);
  })

})

