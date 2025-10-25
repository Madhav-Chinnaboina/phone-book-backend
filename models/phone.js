const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(() => console.log('connected to MongoDB'))
  .catch(error => console.log('error connecting to MongoDB:', error.message))

const phoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d{5,}$/.test(v)
      },
      message: props => `${props.value} is not a valid number`,
    },
  },
})

phoneSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Phone', phoneSchema)
