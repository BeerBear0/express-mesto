const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.use('/', usersRouter);
router.use('/', cardsRouter);
router.use('/*', (req, res) => {
  return res.status(404).send({message: `Запрашиваемыый адресс не существует.`})
})

module.exports = router;