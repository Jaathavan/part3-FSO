require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

morgan.token('data', function (req, res) { return JSON.stringify(req.body) })

app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())

//Displays persons in JSON on api/persons
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

//Fetch single source route
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

//DELETE resource
app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

//POST new resource
app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (body.name === undefined) {
        return response.status(400).json({
            error: 'name is missing'
        })
    }
    else if (body.number === undefined) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }
    // else if (Person.find({ name: body.name })) {
    //     return response.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }
    // else if (Person.find({ number: body.number })) {
    //     return response.status(400).json({
    //         error: 'number must be unique'
    //     })
    // }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

//Listen to PORT
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})