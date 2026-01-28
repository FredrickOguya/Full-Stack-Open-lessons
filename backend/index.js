const express = require('express')
const app = express()
let notes = []


const PORT = 3001

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request,response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)

  if (note){
    response.send(note)
  } else {
    response.status(404).end()
  }

})

app.delete('api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
