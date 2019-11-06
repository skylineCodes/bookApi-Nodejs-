/* eslint-disable no-console */
/* eslint linebreak-style: ["error", "windows"] */

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

if (process.env.ENV === 'Test') {
  console.log('This is a test');
  const db = mongoose.connect('mongodb://localhost/bookAPI_Test');
} else {
  console.log('This is for real');
  /* eslint-disable-next-line no-unused-vars */
  const db = mongoose.connect('mongodb://localhost/bookAPI', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
}

const port = process.env.PORT || 3000;
const Book = require('./models/bookModel');
const bookRouter = require('./routes/books')(Book);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', bookRouter);

app.get('/', (req, res) => res.send('Welcome to bookApi'));

app.server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Running on port ${port}`);
});

module.exports = app;
