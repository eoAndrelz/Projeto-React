import { useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import Note from './components/Note'
import Bin from './components/Bin'

function App() {
  const [notes, setNotes] = useState([])
  const [binnedItems, setBinnedItems] = useState([])

  useEffect(() => {
    const savedNotes = localStorage.getItem("notesList")
    const savedBinnedItems = localStorage.getItem("binnedItems") || "[]"

    if (!savedNotes) {
      const initialNotes = ["Note 1", "Note 2", "Note 3"]
      localStorage.setItem("notesList", JSON.stringify(initialNotes))
      setNotes(initialNotes)
    } else {
      setNotes(JSON.parse(savedNotes))
    }

    setBinnedItems(JSON.parse(savedBinnedItems))
  }, [])

  const filteredNotes = notes.filter(note => !binnedItems.includes(note))

  const handleNoteBinned = (note) => {
    const updatedNotes = notes.filter(n => n !== note)
    setNotes(updatedNotes)
    localStorage.setItem("notesList", JSON.stringify(updatedNotes))

    const updatedBinnedItems = [...binnedItems, note]
    setBinnedItems(updatedBinnedItems)
    localStorage.setItem("binnedItems", JSON.stringify(updatedBinnedItems))
  }

  const [{ isOverNotesArea }, drop] = useDrop(() => ({
    accept: "note",
    drop: (item) => {
      if (item.fromBin) {
        handleItemRestored(item.name)
      }
      return { name: "NotesArea" }
    },
    collect: (monitor) => ({
      isOverNotesArea: !!monitor.isOver(),
    }),
  }))

  const handleItemRestored = (itemToRestore) => {
    const updatedBinnedItems = binnedItems.filter(item => item !== itemToRestore)
    setBinnedItems(updatedBinnedItems)
    localStorage.setItem("binnedItems", JSON.stringify(updatedBinnedItems))
    if (!notes.includes(itemToRestore)) {
      const updatedNotes = [...notes, itemToRestore]
      setNotes(updatedNotes)
      localStorage.setItem("notesList", JSON.stringify(updatedNotes))
    }
  }

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-700 mb-2">Arraste as suas Notas</h1>
          <p className="text-lg text-gray-600">Organize os seus itens entre as areas</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div
            ref={drop}
            className={`space-y-4 p-6 rounded-xl shadow-lg transition-all duration-200 ${
              isOverNotesArea ? 'bg-indigo-100 border-2 border-dashed border-indigo-400' : 'bg-white border border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Area de Itens</h3>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                {filteredNotes.length} {filteredNotes.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>
            
            {filteredNotes.length > 0 ? (
              filteredNotes.map((item, index) => (
                <Note
                  key={`note-${index}`}
                  note={item}
                  onNoteBinned={handleNoteBinned}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Sem notas disponiveis, tente pegar da Lata!</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Bin
              binnedItems={binnedItems}
              onItemRestored={handleItemRestored}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App