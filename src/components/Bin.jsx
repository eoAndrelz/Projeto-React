import { useDrop, useDrag } from 'react-dnd'

const Bin = ({ binnedItems, onItemRestored }) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: "note",
    drop: () => ({ name: "Bin" }),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }))

  const isActive = canDrop && isOver

  return (
    <div
      ref={drop}
      className={`p-6 rounded-xl shadow-lg transition-all duration-200 min-h-[300px] ${
        isActive 
          ? 'bg-red-50 border-2 border-dashed border-red-400' 
          : 'bg-white border border-gray-200'
      }`}
    >
      <div className="flex items-center justify-center gap-2 mb-4">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-6 w-6 ${isActive ? 'text-red-500' : 'text-gray-500'}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
          />
        </svg>
        <h2 className={`text-xl font-semibold ${isActive ? 'text-red-600' : 'text-gray-700'}`}>
          Lata
        </h2>
        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
          isActive 
            ? 'bg-red-100 text-red-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {binnedItems.length} {binnedItems.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {binnedItems.length > 0 ? (
        <div className="space-y-3">
          {binnedItems.map((item, index) => (
            <DraggableBinnedItem
              key={`binned-${index}`}
              item={item}
              onItemRestored={onItemRestored}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>Arraste aqui para deletar</p>
        </div>
      )}
    </div>
  )
}

const DraggableBinnedItem = ({ item, onItemRestored }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "note",
    item: { name: item, fromBin: true },
    end: (itemDragged, monitor) => {
      const dropResult = monitor.getDropResult()
      if (itemDragged && dropResult && dropResult.name === "NotesArea") {
        onItemRestored(itemDragged.name)
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag}
      className={`p-3 rounded-lg cursor-move flex items-center justify-between transition-all ${
        isDragging 
          ? 'opacity-30 bg-gray-200 transform scale-95' 
          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
      }`}
    >
      <span className="text-gray-700 line-through">{item}</span>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5 text-gray-400" 
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

export default Bin