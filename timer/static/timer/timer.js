$(function(){


  $( '#acdn-button' ).click( function(){
    $( '#acdn-target' ).slideToggle() ;
  } ) ;

  let set59 = function() {
    $(".timeleft_second").html(59);
  }

  let countdown = function(){
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

