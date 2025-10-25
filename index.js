require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Phone = require('./models/phone')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('person', (req) => {
  if (req.method === 'POST' && req.body.name && req.body.number) {
    return JSON.stringify({ name: req.body.name, number: req.body.number })
  }
  return ''
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :person')
)

app.get('/api/persons', (req, res, next) => {
  Phone.find({})
    .then((results) => {
      res.json(results)
    })
    .catch((error) => next(error))
})

app.get('/info', (req, res) => {
  Phone.countDocuments({})
    .then((count) => {
      const time = new Date()
      res.send(
        `<div><p>Phonebook has info for ${count}</p><p>${time}</p></div>`
      )
    })
})

app.get('/api/persons/:id', (req, res, next) => {
  const { id } = req.params
  Phone.findById(id)
    .then((phone) => {
      res.json(phone)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const { id } = req.params
  Phone.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const person = req.body

  if (!person.name || !person.number) {
    return res.status(400).json({
      error: 'name or number is missing',
    })
  }

  const phone = new Phone({
    name: person.name,
    number: person.number,
  })

  phone
    .save()
    .then((result) => {
      res.json(result)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { id } = req.params
  const { number } = req.body

  Phone.findByIdAndUpdate(
    id,
    { number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((result) => {
      if (!result) {
        return res.status(404).end()
      }
      res.json(result)
    })
    .catch((error) => next(error))
})

const errorHandlers = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return res.status(400).end()
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandlers)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`)
})
