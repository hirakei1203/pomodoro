$(function(){

  // ドロップダウンを作る場合、以下コードとmaterializeを活用する
  $(".dropdown-trigger").dropdown();

  console.log("aaa");

  $(".task_min").on("keyup", function(){
    let task_setting_min = $(this).val();
    console.log(task_setting_min);
    $(".timeleft_min").html(task_setting_min);
  })

})

