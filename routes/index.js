const NotFoundError = require('../errors/NotFoundError')

const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');


router.use('/', usersRouter);
router.use('/', cardsRouter);
router.use('/*', (req, res, next) => {
  const err = new NotFoundError('Запрашиваемый адресс не существует');
  next(err);
});

module.exports = router;
