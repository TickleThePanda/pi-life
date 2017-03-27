"use strict";

require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const htmling = require('htmling');
const Pusher = require('pusher');
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('html', htmling.express(__dirname + '/views/', {watch:true}));
app.set('view engine', 'html');

let pusher = new Pusher({
  appId: process.env.PUSHER_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER
});
pusher.port = 443;

app.get('/', (req, res) => {
  req.PUSHKEY = process.env.PUSHER_KEY;
  res.render('index', req);
});

function step() {
  var data = {
    x: Math.random() * 0.6 + 0.2,
    y: Math.random() * 0.6 + 0.2
  };
  pusher.trigger('pi-life', 'food', data, r => { console.log(r) });
}

(function loop() {
  var mid = 7 * 1000;
  var max = 12 * 1000;
  var range = (max - mid) * 2;
  var rand = (Math.random() * range) - (range / 2) + mid;
  setTimeout(() => {
    step();
    loop();
  }, rand);
})();

app.listen(PORT, () => {
  console.log(`pi-life listening on port ${PORT}!`);
});

