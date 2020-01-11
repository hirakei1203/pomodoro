$(function(){


  $( '#acdn-button' ).click( function(){
    $( '#acdn-target' ).slideToggle() ;
  } ) ;

  let countdown = function(){
    let task_remaining_second = $(".timeleft_second").html();
    task_remaining_second_next = task_remaining_second - 1;
    
    $(".timeleft_second").html(task_remaining_second_next);
  }

  setInterval(countdown, 1000);


  $(".task_min").on("keyup", function(){
    let task_setting_min = $(this).val();
    $(".timeleft_min").html(task_setting_min);
  })

  $(".task_second").on("keyup", function(){
    let task_setting_second = $(this).val();
    $(".timeleft_second").html(task_setting_second);
  })

})

