var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var Clarifai = require('clarifai');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

dotenv.load();

var client = process.env.CLARIFAI_CLIENT;
var secret = process.env.CLARIFAI_SECRET;
var analyzeApp = new Clarifai.App(
  client,
  secret
);

var VERIFY_TOKEN = process.env.SLACK_VERIFY_TOKEN;
if (!VERIFY_TOKEN) {
  console.error('No SLACK_VERIFY_TOKEN provided.');
  process.exit(1);
}

var PORT = process.env.PORT || 3000;

function analyzeImage(imgUrl) {
  analyzeApp.models.predict(Clarifai.GENERAL_MODEL, imgUrl).then(
    (res) => {
      console.log(res);
      //return res;
    },  
    (err) => {
      console.error(err);
    }); 
}

app.post('/analyze', (req, res) => {
  var msg;
  if (req.body.token != VERIFY_TOKEN) {
    return res.status(401).send('Unauthorized.');
  }

  if (!req.body.text) {
    console.error('No image URL provided.');
  }

  if (req.body.text == 'help') {
    msg = 'insert help message here';
  }

  else {
    analyzeImage(req.body.text);
    msg = 'analyzing...';
  }

  res.status(200).send({
    'response_type' : 'in_channel',
    'text' : msg
  });
});

app.listen(PORT, (err) => {
  if (err) {
    return console.error(err)
  }

console.log('Starting server on port: ', PORT)
});
