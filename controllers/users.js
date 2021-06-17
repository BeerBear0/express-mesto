const User = require('../models/users')


// Поиск всех юзеров
module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({message: `Ошибка ${err}`}))
}

// Поиск 1го юзера по id
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if(!user) {
        return res.status(404).send('Пользователь по данному ID не найден')
      }
      return res.send({ data: user })
    })
    .catch((err) => {
      if(err.name === 'CastError') {
        return res.status(400).send({message: 'Ошибка валидации. Заполните форму правильно'})
      }
      return res.status(500).send({message: `Ошибка ${err}`})
    })
}

// Создание нового пользователя
module.exports.createUser = (req, res) => {
console.log(res.user._id)
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.send(user))
    .catch(err => {
      if(err.name === 'ValidationError') {
        return res.status(400).send({message: 'Ошибка валидации. Заполните форму правильно'})
      }
      return res.status(500).send({message: `Ошибка ${err}`})
    })

}

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  const owner = req.user._id;

User.findByIdAndUpdate(owner, { name, about })
  .then(user => {
    if(user) {
      return res.status(200).send({ data: user })
    }
    return res.status(404).send({message: "Пользователь по данному ID не найден"})
  })
  .catch(err => {
    if (err === 'ValidationError') {
      return res.status(400).send({message: 'Ошибка валидации. Заполните форму правильно'})
    }
  })
}

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, { avatar })
    .then(user => {
      if(user) {
        return res.status(200).send({ data: user })
      }
      return res.status(404).send({message: "Пользователь по данному ID не найден"})
    })
    .catch(err => {
      if (err === 'ValidationError') {
        return res.status(400).send({message: 'Ошибка валидации. Заполните форму правильно'})
      }
    })
}
