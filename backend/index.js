require('dotenv').config()
const express = require('express')
const app = express();
const cors = require('cors')
const mongoose = require('mongoose');
const password = process.argv[2]

const url = process.env.MONGODB_URI
console.log('connecting to', url)


app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

mongoose.set('strictQuery',false)
mongoose.connect(url, { family: 4})

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  } ,
  important: Boolean,
})



const Note = require('./models/note')

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError'){
    return response.status(400).send({ error: 'malformatted id'})
  } else if(error.name === 'ValidationError'){
    return response.status(400).json({error: error.message})
  }

  next(error)
}

app.use(errorHandler)




app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})



app.get('/api/notes/:id',(request,response,next)=> {
  Note.findById(request.params.id).then(note => {
    if(note){
      response.json(note)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/notes/:id',(request,response,next) => {
  Note.findByIdAndDelete(request.params.id)
   .then(result => {
    response.status(204).end()
   })
   .catch(error => next(error))
})
app.post('/api/notes',(request,response, next)=> {
  const body = request.body
  if(!body.content){
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
  .catch(error => next(error))
})

const PORT = process.env.PORT 
app.listen(PORT, ()=> {
  console.log(`Server running on port ${PORT}`)
})

app.put('/api/notes/:id', (request,response,next)=> {
  const { content, important } = request.body

  Note.findById(request.params.id)
  .then(note => {
    if(!note){
      return response.status(404).end()
    }

    note.content = content
    note.important = important;

    return note.save().then((updatedNote) => {
      response.json(updatedNote)
    })
  })
  .catch(error => next(error))
})

