var bodyParser = require('body-parser');
var plaid = require('plaid');


exports.handler = function(event, context, callback) {
// We store the access_token in memory - in production, store it in
// a secure persistent data store.

console.log("event stringify", JSON.stringify(event));
var eventbody = event.body;
console.log("event body ", event.body);
//public_token=public-sandbox-7123&account_id=vP8BxpnNxVT4123
var splitbody = event.body.split('=');   
console.log("event split", splitbody[1]); 
var slicedice = splitbody[1];
console.log("slicedice", slicedice.slice(0, -11));
var realtoken = slicedice.slice(0, -11);


var ACCESS_TOKEN = null;
var PUBLIC_TOKEN = null;

var client = new plaid.Client(
  'PLAID_CLIENT_ID',
  'PLAID_SECRET',
  'PLAID_PUBLIC_KEY',
  plaid.environments.sandbox
);

const response = {
  statusCode: 200,
  headers: {
    "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
  },
  //body: JSON.stringify({ "message": "Hello World!" })
  body: JSON.stringify(event)
};

// Accept the public_token sent from Link
  client.exchangePublicToken(realtoken, function(error, tokenResponse) {
    if (error != null) {
      console.log('Could not exchange public_token!' + '\n' + error);
      //return response.json({error: msg});
    }
    console.log('Stuff!' + '\n' + tokenResponse);
    ACCESS_TOKEN = tokenResponse.access_token;
    var ITEM_ID = tokenResponse.item_id;
    console.log('Access Token: ' + ACCESS_TOKEN);
    console.log('Item ID: ' + ITEM_ID);
  });

callback(null, response);
};