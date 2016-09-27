"use strict";

require('dotenv').config();
const Pusher = require('pusher');

let pusher = new Pusher({
  appId: process.env.PUSHER_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER
});
pusher.port = 443;

setInterval(step, 10 * 1000);

function step() {
  var data = {
    x: Math.random() * 0.6 + 0.2,
    y: Math.random() * 0.6 + 0.2
  };
  console.log("data", data);
  pusher.trigger('pi-life', 'food', data);
}