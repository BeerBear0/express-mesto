const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const auth = require('./middlewares/auth')
const { login, createUser} = require('./controllers/users')

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.post('/signin', login);
app.post('/signup', createUser)

app.use(auth)

app.use('/', require('./routes/index'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
