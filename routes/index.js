const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const NotFoundError = require('../errors/NotFoundError');

router.use('/', usersRouter);
router.use('/', cardsRouter);
router.use('/*', (req, res, next) => {
  const err = new NotFoundError('Запрашиваемый адресс не существует');
  next(err);
});

module.exports = router;
