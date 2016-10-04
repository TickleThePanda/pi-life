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

setInterval(step, 10 * 1000);

function step() {
  var data = {
    x: Math.random() * 0.6 + 0.2,
    y: Math.random() * 0.6 + 0.2
  };
  console.log("data", data);
  pusher.trigger('pi-life', 'food', data);
}

app.listen(PORT, () => {
  console.log(`pi-life listening on port ${PORT}!`);
});
