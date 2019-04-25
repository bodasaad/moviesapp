
$(document).ready(function(){
    'use strict';
  $(window).scroll(() =>{
    let headerHegiht = $('#header').height();
    let windowOffset = $(this).scrollTop();

    if(windowOffset >= (headerHegiht - 100)){
      $("nav").css({
        display: 'block',
      });
      }else{
        $('nav').css({
          display: 'none'
        });
      }
  });
});