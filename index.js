const Joi = require('@hapi/joi')
const express = require('express')
const app = express()
const port = process.env.PORT || 8000

const formData = [
  { id: 1, fullname: 'Gavin Belson', email: 'gbelson@gmail.com' },
  { id: 2, fullname: 'Bertrand Gilfoyle', email: 'bgilfoyle@gmail.com' },
  { id: 3, fullname: 'Dinesh Chugtai', email: 'dchugtai@gmail.com' },
]

app.use(express.json())

///////////////////////
// Get endpoint

app.get('/', function(req, res) {
  res.send('Welcome to Go Fly First!')
})

app.get('/form', function(req, res) {
  res.send(formData)
})

app.get('/form/:id', function(req, res) {
  const data = formData.find(item => parseInt(req.params.id) === item.id)
  res.send(data)
})

/////////////////////////////////////////////////////////////////////////
// Post endpoint

app.post('/form', function(req, res) {
  const errorMessage = validate(req.body)
  if (errorMessage) {
    res.status(400).send(errorMessage)
    return
  }
  req.body.id = formData.length + 1
  formData.push(req.body)
  res.send(req.body)
})

app.listen(port, function() {
  console.log(`Server running at ${port}`)
})

//////////////////////////////////////////
// Validator function

function validate(passedData) {
  const match = formData.find(
    item =>
      parseInt(passedData.id) === item.id ||
      passedData.fullname === item.fullname
  )
  if (match) {
    return 'Duplicate entry not allowed'
  }

  const schema = {
    fullname: Joi.string()
      .min(6)
      .max(30)
      .required(),
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required(),
  }
  const { error } = Joi.validate(passedData, schema)
  return error
}
