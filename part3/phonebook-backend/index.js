require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./modules/person')
app.use(express.json())
morgan.token('post-data', function (req) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :post-data'
  )
)
app.use(express.static('build'))

//Get all entries
app.get('/api/persons/', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})
//Get info
app.get('/info/', (request, response) => {
  Person.find({}).then((persons) => {
    response.send(
      `<p>Phonebook has info for ${persons.length
      } people</p><p>${new Date()}</p>`
    )
  })
})
//Get single entry
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((persons) => {
      response.json(persons)
    })
    .catch((error) => next(error))
})
//Delete entry
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

//Modify entry
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
  })
    .then((updatedPerson) => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

//Add entry
app.post('/api/persons/', (request, response, next) => {
  const body = request.body
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch((error) => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
