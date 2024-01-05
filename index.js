require('dotenv').config()

const express = require('express')
const app = express()
const Person = require('./models/person')

var morgan = require('morgan')

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

morgan.token('data', (req, res) => {
    return JSON.stringify(req.body);
});

// const generateId = () => {
//     const maxId = contacts.length > 0
//         ? Math.max(...contacts.map(c => c.id))
//         : 0
    
//         return maxId + 1
// }

app.get('/info', (request, response) => {
    const currentDate = new Date().toString()
    response.send(`<p>Phonebook has info for ${contacts.length} people <br><br>${currentDate} </p>`)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(contacts => {
    response.json(contacts)
  })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(contact => {
      response.json(contact)
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    Person.find({name: body.name})
      .then(existingContact => {
        if(existingContact) {
          existingContact.number = body.number
          existingContact.save().then(updatedContact => {
            response.json(updatedContact)
          })
        } else {
          const contact = new Person({
            name: body.name,
            number: body.number
          })
    
          contact.save().then(savedContact => {
            response.json(savedContact)
          })
        }
      })
      .catch(error => next(error))
    // let errorJson = {error: ''}

    // if(!body.name || !body.number || existingContact) {
    //     if (!body.name) {
    //         errorJson = { error: 'name is missing' };
    //       } else if (!body.number) {
    //         errorJson = { error: 'number is missing' };
    //       } else if (existingContact) {
    //         errorJson = { error: 'name must be unique' };
    //       }

    //     return response.status(400).json(errorJson)
    // }
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.port || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})