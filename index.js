var app = require('express');
var bodyParser = require('body-parser');

var VERIFY_TOKEN = process.env.SLACK_VERIFY_TOKEN;
if (!VERIFY_TOKEN) {
  console.error('No SLACK_VERIFY_TOKEN provided.');
  process.exit(1)
}

var PORT = process.env.PORT || 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

app.post('/analyze', (req, res) => {
  if (req.body.token != VERIFY_TOKEN) {
    return res.status(401).send('Unauthorized.');
  }

  if (!req.body.text) {
    console.error('No image URL provided.');
  }

  if (req.body.text == 'help') {
    msg = 'insert help message here'
  }

  res.status(200).send({
    'response_type' : 'in_channel',
    'text' : msg
  });
}

app.listen(PORT, (err) => {
  if (err) {
    return console.error(err)
  }

console.log('Starting server on port: ', PORT))
}
