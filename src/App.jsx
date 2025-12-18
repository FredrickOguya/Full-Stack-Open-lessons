import { useState,useEffect } from "react";
import noteService from './Services/notes';
import Note from './components/Note'
import Notification from "./components/Notifications";
import Footer from "./components/Footer";


const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(()=> {
    noteService
      .getAll().then((initialNotes)=> {
        setNotes(initialNotes)
      })
  }, [])

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    }
    noteService
      .create(noteObject)
      .then((returnedNote) =>{
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
        
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find(note => note.id === id)
    const changedNote = {...note,important: !note.important}

    noteService
      .update(id,changedNote)
      .then(returned => {
        setNotes(notes.map(note => note.id !== id ? note : returned))
      })
      .catch(error => {
        setErrorMessage(
          `Note ${note.content} was already removed from the server`
        )
        setTimeout(()=> {
          setErrorMessage(null)
        },5000)
        setNotes(notes.filter(n => n.id !== id))
      })

  
  }
  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }
  
  const notesToShow = showAll ? notes: notes.filter((note) => note.important)

  

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportanceOf={()=> toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      <Footer/>
    </div>
  )
}

export default App;

