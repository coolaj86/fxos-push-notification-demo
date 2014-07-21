$(function () {
  'use strict';

  $('body').on('submit', '.js-form-ffpushinstruction', function (ev) {
    ev.preventDefault();
    ev.stopPropagation();

    $('.js-steps').hide();
    $('.js-step-1').show();

    // TODO get reg info
    window.alert("you clicked okay");
  });


  $('body').on('submit', '.js-form-ffpushid', function (ev) {
    ev.preventDefault();
    ev.stopPropagation();

    $('.js-steps').hide();
    $('.js-step-2').show();

    // TODO get reg info

    window.alert("you clicked submit");
  });

  $('body').on('submit', '.js-form-ffpushdata', function (ev) {
    ev.preventDefault();
    ev.stopPropagation();

    // TODO get data
    window.alert("you clicked pushdata");

    // TODO websocket
    $('.js-console').show();
    $('.js-console-data').append('<div>Dummy Message</div>');
  });


  $('.js-steps').hide();
  $('.js-step-0').show();
});
