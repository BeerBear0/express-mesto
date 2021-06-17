const express  = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

const app = express();
const { PORT = 3000 } = process.env;

const routerUser = require('./routes/users')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.use((req, res, next) => {
  req.user = {
    _id: '60cb1868f3fc3c457851d719' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/', require('./routes/index'))

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}` )
})