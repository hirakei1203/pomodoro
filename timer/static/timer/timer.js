$(function(){

  $(".dropdown-trigger").dropdown();


  $(".task_min").on("keyup", function(){
    let task_setting_min = S(this).val();
    console.log(task_setting_min);
  })

})

