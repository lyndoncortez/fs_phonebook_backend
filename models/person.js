const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const contactSchema = new mongoose.Schema({
    name: {
      type: String,
      minLength: [3, 'minimum of 3 characters']
    },
    number: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          // Custom phone number validation
          const phoneNumberRegex = /^[0-9]{2,3}-[0-9]+$/;
          return phoneNumberRegex.test(value);
        },
        message: 'Invalid phone number format. Use the format XX-XXXXXXX or XXX-XXXXXXX.',
      },
    }
})

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', contactSchema)