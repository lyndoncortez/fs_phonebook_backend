const express = require('express')
const app = express()
var morgan = require('morgan')

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

morgan.token('data', (req, res) => {
    return JSON.stringify(req.body);
});

let contacts = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => {
    const maxId = contacts.length > 0
        ? Math.max(...contacts.map(c => c.id))
        : 0
    
        return maxId + 1
}

app.get('/info', (request, response) => {
    const currentDate = new Date().toString()
    response.send(`<p>Phonebook has info for ${contacts.length} people <br><br>${currentDate} </p>`)
})

app.get('/api/persons', (request, response) => {
    response.json(contacts)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const contact = contacts.find(contact => contact.id === id)

    contact ? response.json(contacts.filter(contact => contact.id === id)) : response.status(404).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    const existingContact = contacts.find(contact => contact.name === body.name);
    let errorJson = {error: ''}

    if(!body.name || !body.number || existingContact) {
        if (!body.name) {
            errorJson = { error: 'name is missing' };
          } else if (!body.number) {
            errorJson = { error: 'number is missing' };
          } else if (existingContact) {
            errorJson = { error: 'name must be unique' };
          }

        return response.status(400).json(errorJson)
    }

    const contact = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    contacts = contacts.concat(contact)

    response.json(contact)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    contacts = contacts.filter(contact => contact.id !== id)

    response.status(204).end()
})

const PORT = process.env.port || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})