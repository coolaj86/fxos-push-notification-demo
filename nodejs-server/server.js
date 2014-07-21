'use strict';

var path = require('path')
  , connect = require('connect')
  , app = connect()
  , urlrouter = require('connect_router')
  , send = require('connect-send-json')
  , serveStatic = require('serve-static')
  //, config = require('./config')
  , route
  ;


app.use(send.json());
app.use(serveStatic(path.join(__dirname, 'app')));

function route(rest) {
  rest.get('/api', function (req, res) {
    res.statusCode = 501;
    res.json({ error: { message: "Not Implemented" } });
  });
}

app.use(urlrouter(route));

module.exports = app;
