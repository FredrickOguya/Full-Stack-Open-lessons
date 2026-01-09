require('dotenv').config()
const express = require('express')
const app = express();
const cors = require('cors')
const mongoose = require('mongoose');
const password = process.argv[2]
const url = `mongodb+srv://onyangofredrickoguya:${password}@cluster0.hxovx14.mongodb.net/noteApp?appName=Cluster0`


app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

mongoose.set('strictQuery',false)
mongoose.connect(url, { family: 4})

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject)=> {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = require('./models/note')



let notes = [];



const generateId = () => {
  
  const maxId = notes.length> 0 ? Math.max(...notes.map(n=> Number(n.id))) : 0;
  return String(maxId + 1);

};



app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})



app.get('/api/notes/:id',(request,response)=> {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})

app.delete('/api/notes/:id',(request,response) => {
  const id = request.params.id;
  notes = notes.filter((note)=> note.id !== id)

  response.status(204).end()
})
app.post('/api/notes',(request,response)=> {
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
})

const PORT = process.env.PORT 
app.listen(PORT, ()=> {
  console.log(`Server running on port ${PORT}`)
})

app.put('/api/notes/:id', (request,response)=> {
  const id = request.params.id;
  const body = request.body;
  const note = notes.find(note=> note.id === id);
  
  if(note){
    changedNote = {...note,important: body.important}

    notes = notes.map(n => n.id === id ? changedNote: n)
    response.json(changedNote)
  }
  


})
