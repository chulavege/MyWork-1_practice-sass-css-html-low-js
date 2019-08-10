$(document).ready(function () {

    $('.menu-heading').click(function () {
        $(this).toggleClass('in').next().slideToggle();
        $('.menu-heading').not(this).removeClass('in').next().slideUp();        
    });

});

$(function(){
    $('a[href^="#"]').on('click', function(event) {
      // отменяем стандартное действие
      event.preventDefault();
      
      var sc = $(this).attr("href"),
          dn = $(sc).offset().top;
      /*
      * sc - в переменную заносим информацию о том, к какому блоку надо перейти
      * dn - определяем положение блока на странице
      */
      
      $('html, body').animate({scrollTop: dn}, 300);
      
      /*
      * 1000 скорость перехода в миллисекундах
      */
    });
  });