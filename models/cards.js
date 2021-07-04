const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },

  link: {
    type: String,
    required: true,
    validate: {
      validator(url) {
        return /^((http|https):\/\/)(www\.)?([\w\W\d]{1,})(\.)([A-Za-z]{1,10})([\w\W\d]{1,})?$/.test(url);
      },
      message: (props) => `${props.value} Введите правильный URL!`,
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

  likes: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    }],
    default: [],
  },

  createAt: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model('card', cardSchema);
