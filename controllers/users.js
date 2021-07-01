const User = require('../models/users');
const bcrypt = require('bcrypt');
const validator = require('validator')
const isEmail = require('validator/lib/isEmail');
const jwt = require('jsonwebtoken');

const errorsMessage = {
  400: 'Переданы некорректные данные при создании пользователя',
  '400login': 'Не заполнены все поля',
  '400user': 'Переданы некорректные данные при обновлении профиля',
  '400ava': 'Переданы некорректные данные при обновлении аватара',
  401: 'Логин или пароль не правильные',
  404: 'Пользователь по указанному _id не найден',
  '404email': 'Пользователь с такой почтой не найден',
  409: 'Пользователь c такой почтой уже существует',
};


// Поиск всех юзеров
module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send(errorsMessage[500]));
};

// Поиск 1го юзера по id
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send(errorsMessage[404]);
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send(errorsMessage[400]);
      }
      return res.status(500).send(errorsMessage[500]);
    });
};

// Создание нового пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, password, email,
  } = req.body;
  if (!email || !password) {
    next(new RequestError(errorsMessage[400]));
  }
  return bcrypt.hash(password, 8, (err, hash) => User.findOne({ email })
    .then((user) => {
      if (user) {
        next(new AlreadyHaveError(errorsMessage[409]));
      }
      return User.create({
        name, about, avatar, password: hash, email,
      })
        .then(() => res.status(200).send({
          data: {
            name, about, avatar, email,
          },
        }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError(errorsMessage[400]));
      }
      if (err.name === 'CastError') {
        next(new NotFoundError(errorsMessage[404]));
      }
      next(err);
    }));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if(!email || !password) {
    next(new RequestError(errorsMessage['400login']))
  }
  return User.findOne({ email }.select('+password'))
    .then(user => {
      next( new NotFoundError(errorsMessage[401]))
    })

  const token = jwt.sign({ id: user.id}, 'some-secret-key', {expiresIn: '7d'})

  return res.status(200).send({ id: user.id, token})
}

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res.status(200).send({ data: user });
      }
      return res.status(404).send(errorsMessage[404]);
    })
    .catch((err) => {
      if (err === 'ValidationError') {
        return res.status(400).send(errorsMessage[400]);
      }
      return res.status(500).send(errorsMessage[500]);
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res.status(200).send({ data: user });
      }
      return res.status(404).send(errorsMessage[404]);
    })
    .catch((err) => {
      if (err === 'ValidationError') {
        return res.status(400).send(errorsMessage[400]);
      }
      return res.status(500).send(errorsMessage[500]);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then(user => res.send(user))
    .catch(err =>  next(err))
}