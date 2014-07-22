$(function () {
  'use strict';

  var friendlyId
    ;

  $('body').on('submit', '.js-form-ffpushinstruction', function (ev) {
    ev.preventDefault();
    ev.stopPropagation();

    $('.js-steps').hide();
    $('.js-step-1').show();
  });


  $('body').on('submit', '.js-form-ffpushid', function (ev) {
    ev.preventDefault();
    ev.stopPropagation();

    friendlyId = $('.js-form-ffpushid input').val().toLowerCase();

    $.get('/api/push/' + friendlyId).then(function (data) {
      if (data && data.exists) {
        $('.js-steps').hide();
        $('.js-step-2').show();
      } else {
        window.alert('Invalid Id');
      }
    }, function () {
      window.alert('Network Error');
    });
  });

  $('body').on('submit', '.js-form-ffpushdata', function (ev) {
    ev.preventDefault();
    ev.stopPropagation();

    var data = $('.js-form-ffpushdata textarea').val()
      ;

    try {
      data = JSON.parse(data);
    } catch(e) {
      data = { message: data };
    }

    $.ajax({
      url: '/api/push/' + friendlyId
    , type: 'POST'
    , contentType : 'application/json'
    , data: JSON.stringify(data)
    }).then(function (data) {
      // TODO websocket updates
      $('.js-console').show();
      $('.js-console-data').append(JSON.stringify(data, null, '  '));
      //$('.js-console-data').append('<div class="alert alert-success">Client received notification</div>');
    });
  });


  $('.js-steps').hide();
  $('.js-step-0').show();
});
