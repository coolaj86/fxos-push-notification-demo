//
// A lovely Simple Push Notification demo
//
// https://developer.mozilla.org/en-US/docs/WebAPI
// https://developer.mozilla.org/en-US/docs/Web/API/Simple_Push_API
// https://developer.mozilla.org/en-US/Apps/Build/App_permissions
// https://developer.mozilla.org/en-US/Apps/Build/API_support_table

$(function() {
  'use strict';

  window.onerror = function (e) {
    console.error('[window.onerror] uncaught exception');
    console.error(e);
    log.error('[window.onerror] uncaught exception');
    log.error(e && e.message || e);
  };

  // using systemXHR
  $.ajaxSetup( {
    xhr: function() { return new window.XMLHttpRequest({ mozSystem: true, mozAnon: true }); }
  });
  $('.js-test-site-container').hide();

  // TODO Promise
  var log = window.AjLogger.create('#console')
    , db = new window.PouchDB('settings')
    , homeBase = 'http://ffpush.dev.coolaj86.com'
    , home = homeBase + '/api/push'
    //, home = 'https://u34hasta3bs5.runscope.net'
    ;

  $('#push-form').on('submit', function (ev) {
    ev.preventDefault();
    ev.stopPropagation();

    db.get('push_endpoint', function (err, doc) {
      if (err && 404 !== err.status) {
        console.error(err);
        log.alert('Error with PouchDB / IndexedDB: ' + err.message);
      }

      if (!doc) {
        registerMozilla();
      } else /* if (!doc.friendlyId) */ {
        registerHome(doc.url, doc.oldUrl);
      /*
      } else {
        showRegistration(doc);
      */
      }
    });
  });

  $('body').on('click', '[name="reset"]', function () {
    db.get('push_endpoint', function (err, doc) {
      var request
        , count = 0
        ;

      if (!doc) {
        return;
      }

      function unregister(url) {
        request = navigator.push.unregister(url);
        request.onsuccess = function (e) {
          console.log(e);
          log('[unregistered]');
        };
        request.onerror = function (e) {
          if (count > 3) {
            return;
          }
          count += 1;
          setTimeout(function () {
            unregister(url);
          }, 10 * 60 * 1000);
          console.log(e);
          log('[fail] [unregister]:' + (e && e.message || JSON.stringify(e)));
        };
      }

      unregister(doc.url);
      db.remove(doc._id, doc._rev, function (/*err, response*/) {
        log.warn('[delete]');
      });
    });
  });
  $('body').on('click', '#console-clear', function () {
    log.clear();
  });

  // Register with Mozilla for a push notification
  function registerMozilla(oldUrl) {
    if (!window.navigator.push) {
      console.error('missing navigator.push');
    }
 
    var req = navigator.push.register()
      ;
    
    log('Registering for push notification...');
    req.addEventListener('success', function (/*ev*/) {
      var endpoint = req.result
        ;

      db.put({
        _id: 'push_endpoint'
      , url: req.result
      }, function (err) {
        if (err) {
          log.error('error saving endpoint to Pouch');
          log.error(err);
        }
        registerHome(endpoint, oldUrl);
      });
    });

    req.addEventListener('error', function(ev) {
      console.error("Error getting a new endpoint: " + ev.target.error.name);
      console.error("Error getting a new endpoint: " + req.error);
      console.error("Error getting a new endpoint: " + req.error.name);

      log.error(ev.target.error.name);
      log.error(req.error);
      log.error(req.error.name);
    });
  }

  // Register at our own server to use that url
  function registerHome(endpoint, oldUrl) {
    // TODO update server to keep friendlyId the same
    $.post(home, { url: endpoint, previous: oldUrl }).then(
      function (body) {
        db.get('push_endpoint', function (err, doc) {
          if (!doc || !doc.url) {
            log.error('db data disappeared');
            doc = { _id: 'push_endpoint' };
          }

          doc.url = endpoint;
          doc.friendlyId = body.id;

          db.put(doc, function (err) {
            if (err) {
              log('error storing in pouch', 'error');
              log(err && err.message || err, 'error');
            } else {
              showRegistration(doc);
            }
          });
        });
      }
    , function (err) {
        // NOTE: you may never get here because Firefox OS
        // doesn't send you data from non-200 requests
        log('error communicating with server', 'error');
        log(err && err.message || err, 'error');
      });
  }

  function showRegistration(doc) {
    $('a.js-test-site').attr('href', homeBase).text(homeBase);
    $('.js-test-site-container').show();
    log.clear();
    log('Registered');
    log.info(doc.friendlyId);
    log(doc.url);
  }


  // Receive the push notifications
  if (!window.navigator.mozSetMessageHandler) {
    window.navigator.mozSetMessageHandler('push', function(ev) {
      console.log('[push notification]');
      console.log(ev);
      log.clear();
      log('[push notification]');
      log('v' + ev.version);
      log('from ' + ev.pushEndpoint);
      log("retrieving... ");
      
      db.get('push_endpoint', function (err, doc) {
        $.get(home + '/' + doc.friendlyId + '/data')
          .then(
            function () {
              log.clear();
              log('[push notification] retrieved data:');
              log(JSON.stringify(doc));
            }
          , function () {
              log.error("failed to retrieve push data");
            }
          );
      });
    });
  } else {
    // No message handler
  }

  if (window.navigator.mozSetMessageHandler) {
    window.navigator.mozSetMessageHandler('push-register', function() {
      log.clear();
      log.warn("[push-register] renewing endpoint...");
      
      db.get('push_endpoint', function(err, doc) {
        if (!doc) {
          registerMozilla();
          return;
        }

        db.remove(doc._id, doc._rev, function (/*err, response*/) {
          registerMozilla(doc.url);
        });
      });
    });
  } else {
    // No message handler
  }
});
