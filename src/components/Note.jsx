const Note = ({ note,toggleImportanceOf }) => {
  const label = note.important ? 'make not important' : 'make important'
  return (
    <div>
      <li className="note">
        {note.content} 
        <button onClick={toggleImportanceOf}>{label}</button>
      </li>
    </div>
    
  )
}

export default Note

