const Card = require('../models/cards');

const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const ValidationError = require('../errors/ValidationError');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: `Ошибка ${err}` }));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Заполните форму правильно'))
      }
      return res.status(500).send({ message: `Ошибка ${err}` });
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карта не найдена'))
      }
      if (card.owner.equals(req.user.id)) {
        Card.findByIdAndRemove(card._id)
          .then((cards) => res.send(cards));
      }
      else {
        next(new ForbiddenError('Карточку может удолить только создатель'))
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Ошибка валидации'))
      }
      return res.status(500).send({ message: `Ошибка ${err}` });
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карта не найдена'))
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Некоректные данные'))
      }
      return res.status(500).send({ message: `Ошибка ${err}` });
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карта не найдена'))
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
       next(new ValidationError('Некоректные данные '))
      }
      return res.status(500).send({ message: `Ошибка ${err}` });
    });
};
