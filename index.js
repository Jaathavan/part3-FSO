const express = require('express');

const app = express();
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const Person = require('./models/person').default;

morgan.token('data', (req) => (req.method === 'POST' ? JSON.stringify(req.body) : ' '));

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));
app.use(cors());
app.use(express.static('build'));

// Displays number of people in phonebook on /info
app.get('/info', (request, response) => {
  Person.find({})
    .then((people) => {
      response.send(
        `
        <div>Phonebook has info for ${people.length} people</div>
        <div>${new Date()}</div>
        `,
      );
    });
});

// Displays persons in JSON on api/persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

// Fetch single source route
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// DELETE resource
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// POST new resource
app.post('/api/persons', (request, response, next) => {
  const { body } = request;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

// PUT new resource in old one // P.S translate Alan Turing from binary for easter egg
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body;

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidator: true, context: 'query' },
  )
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

// eslint-disable-next-line consistent-return
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);

// Listen to PORT
const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
