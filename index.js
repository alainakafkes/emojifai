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
      var tags = []
      for (var i=0; i<10; i++) {
        tags.push(JSON.stringify(res['outputs'][0]['data']['concepts'][i]['name']));
      }
      return tags.toString();
    },  
    (err) => {
      console.error(err);
    }); 
}

app.post('/analyze', (req, res) => {
  if (req.body.token != VERIFY_TOKEN) {
    return res.status(401).send('Unauthorized.');
  }

  var receivedText = req.body.text;
  var responseUrl = req.body.response_url;

  if (!receivedText) {
    console.error('No image URL provided.');
  }

  if (receivedText == 'help') {
    textToSend = 'Copy your favorite image URL and try this:  "/analyze <image-url>". :see_no_evil:';
  }

  else {
    textToSend = 'Analyzing image... :sparkles:'
  }

  res.status(200).send({
    'response_type' : 'in_channel',
    'text' : textToSend
  });
});

app.listen(PORT, (err) => {
  if (err) {
    return console.error(err)
  }

console.log('Starting server on port: ', PORT)
});
