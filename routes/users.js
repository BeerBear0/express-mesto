const router = require('express').Router();

const {
  getAllUsers, getUserById, updateProfile, updateAvatar, getCurrentUser,
} = require('../controllers/users');

router.get('/users', getAllUsers);
router.get('/users/:userId', getUserById);
router.get('/users/me', getCurrentUser)
router.patch('/users/me', updateProfile);
router.patch('./users/me/avatar', updateAvatar);

module.exports = router;
