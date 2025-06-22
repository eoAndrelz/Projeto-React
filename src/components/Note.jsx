import { useDrag } from 'react-dnd'

const Note = ({ note, onNoteBinned }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "note",
    item: { name: note },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult()
      if (item && dropResult && dropResult.name === "Bin") {
        onNoteBinned(item.name)
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    })
  }))

  return (
    <div
      ref={drag}
      className={`p-4 rounded-lg shadow-md cursor-grab active:cursor-grabbing transition-all duration-150 ${
        isDragging 
          ? 'opacity-30 bg-indigo-200 transform scale-95' 
          : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg'
      } flex items-center justify-between`}
    >
      <span className="font-medium">{note}</span>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5 text-indigo-200" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4 8h16M4 16h16" 
        />
      </svg>
    </div>
  )
}

export default Note