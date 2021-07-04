const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const {
  getAllUsers, getUserById, updateProfile, updateAvatar, getCurrentUser,
} = require('../controllers/users');

router.get('/users', getAllUsers);

router.get('/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().max(30).min(2),
      about: Joi.string().required().max(30).min(2),
    }),
  }), getCurrentUser);

router.get('/users/:userId',
  celebrate({
    body: Joi.object().keys({
      _id: Joi.string().length(24).hex(),
    }),
  }),
  getUserById);

router.patch('/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().max(30).min(2),
      about: Joi.string().required().max(30).min(2),
    }),
  }), updateProfile);
router.patch('./users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().pattern(/^(https:\/\/{2}{?:www}\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/),
    }),
  }),
  updateAvatar);

module.exports = router;
