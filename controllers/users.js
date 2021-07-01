const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const ValidationError = require('../errors/ValidationError');
const AuthError = require('../errors/AuthError')


// Поиск всех юзеров
module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({message: `Ошибка ${err}`}));
};

// Поиск 1го юзера по id
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по данному Id не найден'))
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError('Id пользователя имеет не коректный формат'))
      }
      return res.status(500).send({ message: `Ошибка ${err}`});
    });
};

// Создание нового пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, password, email,
  } = req.body;
  if (!email || !password) {
    next(new ValidationError('Переданы некорректные данные при создании пользователя'));
  }
  return bcrypt.hash(password, 8, (err, hash) => User.findOne({ email })
    .then((user) => {
      if (user) {
        next(new ConflictError('Пользователь c такой почтой уже существует'));
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
        next(new ValidationError('Переданы не коректные данные'));
      }
      if (err.code === 11000) {
        next(new ConflictError('Такой пользователь уже существует'));
      }
      next(err);
    }));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неправильные почта или пароль');
          }

          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
         'some-secret-key',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        })
        .send({ token });
    })
    .catch(next);
}

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      if (err === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при редактировании пользователя'));
      }
      return res.status(500).send({ message: `Ошибка ${err}`});
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      if (err === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при редактировании пользователя'));
      }
      return res.status(500).send({ message: `Ошибка ${err}`});
    });
};
