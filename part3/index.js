const express = require('express')
const app = express()

app.use(express.json())

let persons = [
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

//Displays persons in JSON on api/persons
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

//Displays number of ppl in phonebook on /info
app.get('/info', (request, response) => {
    response.send(
        `
        <div>Phonebook has info for ${persons.length} people</div>
        ${new Date()}
        `
    )
})

//Fetch single source route
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
})

//Delete resource
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    
    response.status(204).end()
})

const generateId = () => {
    return Math.random * 100000
}

//POST new resource
app.post('/api/persons', (request, response) => {
    const person = request.body
    console.log(person)
    response.json(person)
})

//Listen to PORT
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})