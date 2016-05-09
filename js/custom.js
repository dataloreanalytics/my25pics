/*------------------------------------------------------------------
Project:    Cubic
Author:     Yevgeny S.
URL:        https://twitter.com/YevSim
Version:    1.0
Created:        03/04/2014
Last change:    15/04/2014
-------------------------------------------------------------------*/

/* ===== Wrapper ===== */

$('.wrapper .text').hover (function() {
    $('.wrapper-inner').toggleClass('fading');
    return false;
});

/* ====== Color Options ===== */

$('.color-options .option').on('click', function() {
    var color = $(this).data('color');
    $('body').removeClass();
    $('body').addClass('body-' + color);
    return false;
});

/* ===== Menu ===== */

$('#menu-open').on('click', function() {
    $(this).toggleClass('show hidden');
    $('#menu-dummy').toggleClass('show hidden');
    $(".menu ul li").toggleClass("hidden show animated bounceInRight");
    setTimeout(function(){
        $('#menu-close').toggleClass('show hidden');
        $('#menu-dummy').toggleClass('show hidden');
    }, 2500);
    return false;
});
$('#menu-close').on('click', function() {
    $(this).toggleClass('show hidden');
    $('#menu-dummy').toggleClass('show hidden');
    $(".menu ul li").toggleClass("bounceInRight bounceOutRight");
    setTimeout(function(){
        $('#menu-open').toggleClass('show hidden');
        $('#menu-dummy').toggleClass('show hidden');
        $('.menu ul li').removeClass('animated bounceOutRight');
        $('.menu ul li').toggleClass('show hidden');
    }, 2500);
    return false;
});


/* ===== Blocks ===== */

function blockSize() {
    $('.block').height(function () {
        return $(this).width();
    });
    $('.block-address').height(function () {
        return $(this).width();
    });
    $('.block-hf').outerHeight(function () {
        return $(this).outerWidth()/2-5;
    });
}
blockSize();
$(window).resize(blockSize);

/* ===== Block Hover ===== */

$('.block-hover').hover (function() {
    $(this).find('.plus').toggleClass('animated rotateIn');
    return false;
});

/* ===== Smooth Scrolling ===== */

$(document).ready(function(){
    $('a[href*=#home],a[href*=#about], a[href*=#features], a[href*=#facebook], a[href*=#team], a[href*=#contact]').bind("click", function(e){
      var anchor = $(this);
      $('html, body').stop().animate({
        scrollTop: $(anchor.attr('href')).offset().top
      }, 1000);
      e.preventDefault();
    });
   return false;
});

/* ===== Tooltips ===== */

function menuTooltip() {
    if (window.matchMedia("(min-width: 768px)").matches) {
        $('.menu a').tooltip();
    } else {
        $('.menu a').tooltip('destroy');
    }
}
menuTooltip();
$(window).resize(menuTooltip);
// $(window).on('resize', menuTooltip);


/* ===== Waypoints ===== */

function checkWidth() {
    if (window.matchMedia("(min-width: 768px)").matches) {
        $('.fadingIn').waypoint(function() {
            $(this).removeClass('transparent');
            $(this).addClass('visible');
            return false;
        }, { offset: '95%' });
    } else {
        $('.fadingIn').hover (function() {
            $(this).removeClass('transparent');
            return false;
        });
    }
}
checkWidth();
$(window).resize(checkWidth);
