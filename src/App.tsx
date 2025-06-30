import { useState, useEffect } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { useShelf } from './hooks/useShelf';
import Auth from './components/Auth';
import SearchBar from './components/SearchBar';
import Shelf from './components/Shelf';
import BookDetailModal from './components/BookDetailModal';
import type { BookStatus } from './types';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';

const shelfStatuses: BookStatus[] = ['Want to Read', 'Currently Reading', 'Finished Reading'];

function App() {
  const [user, setUser] = useState<any>(null);
  const [selected, setSelected] = useState<{ status: BookStatus | null; index: number | null }>({ status: null, index: null });
  const { books, addBook, updateStatus, removeBook } = useShelf(user);

  // DnD-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { 
      activationConstraint: { 
        distance: 8,
        delay: 100,
        tolerance: 5
      } 
    })
  );

  // Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    console.log('Drag started:', event);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log('Drag ended:', event);
    const { active, over } = event;
    
    if (!over || !active) {
      console.log('No valid drop target');
      return;
    }
    
    const activeId = String(active.id);
    const overId = String(over.id);
    
    console.log(`Active: ${activeId}, Over: ${overId}`);
    
    // Parse the dragged item ID
    const [fromStatus, fromIndexStr] = activeId.split('-');
    const fromIndex = parseInt(fromIndexStr, 10);
    
    // Determine the target status
    let toStatus = overId;
    
    // If dropped on another book, get its status
    if (overId.includes('-')) {
      const [targetStatus] = overId.split('-');
      toStatus = targetStatus;
    }
    
    console.log(`From: ${fromStatus} (index ${fromIndex}) -> To: ${toStatus}`);
    
    // Don't move if dropping on the same shelf
    if (fromStatus === toStatus) {
      console.log('Same shelf, no move needed');
      return;
    }
    
    console.log(`Moving book from ${fromStatus} to ${toStatus}`);
    updateStatus(fromStatus as BookStatus, fromIndex, toStatus as BookStatus);
  };

  // Modal logic
  const selectedBook =
    selected.status !== null && selected.index !== null
      ? books[selected.status]?.[selected.index]
      : null;

  if (!user) return <Auth />;

  return (
    <div className="container">
      <div className="header">
        <h1>📚 My Bookshelf</h1>
        <button onClick={() => signOut(auth)} style={{ color: '#b91c1c', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
          Sign Out
        </button>
      </div>
      <SearchBar onAdd={addBook} />
      
      {/* Genre Color Legend */}
      <div className="genre-legend">
        <h3>📖 Book Colors by Genre</h3>
        <div className="genre-legend-grid">
          <div className="genre-item"><span className="genre-color" style={{background: 'linear-gradient(to right, #8B4513, #A0522D)'}}></span> Fiction</div>
          <div className="genre-item"><span className="genre-color" style={{background: 'linear-gradient(to right, #FF69B4, #C71585)'}}></span> Romance</div>
          <div className="genre-item"><span className="genre-color" style={{background: 'linear-gradient(to right, #2F4F4F, #1C1C1C)'}}></span> Mystery</div>
          <div className="genre-item"><span className="genre-color" style={{background: 'linear-gradient(to right, #4B0082, #7B68EE)'}}></span> Fantasy</div>
          <div className="genre-item"><span className="genre-color" style={{background: 'linear-gradient(to right, #00CED1, #4682B4)'}}></span> Sci-Fi</div>
          <div className="genre-item"><span className="genre-color" style={{background: 'linear-gradient(to right, #2E8B57, #3CB371)'}}></span> Biography</div>
          <div className="genre-item"><span className="genre-color" style={{background: 'linear-gradient(to right, #B8860B, #DAA520)'}}></span> History</div>
          <div className="genre-item"><span className="genre-color" style={{background: 'linear-gradient(to right, #708090, #A9A9A9)'}}></span> Other</div>
        </div>
      </div>
      
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="bookshelf">
          <SortableContext
            items={[
              ...Object.entries(books).flatMap(([status, bookList]) => 
                bookList.map((_, i) => `${status}-${i}`)
              )
            ]}
            strategy={verticalListSortingStrategy}
          >
            {shelfStatuses.map((status) => (
              <Shelf
                key={status}
                label={status}
                books={books[status] || []}
                status={status}
                onBookClick={(book) => {
                  const index = books[status]?.findIndex((b) => b.id === book.id);
                  setSelected({ status, index: index !== undefined ? index : null });
                }}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>
      {selectedBook && selected.status && selected.index !== null && (
        <BookDetailModal
          book={selectedBook}
          currentStatus={selected.status}
          onClose={() => setSelected({ status: null, index: null })}
          onUpdateStatus={(newStatus) => {
            updateStatus(selected.status as BookStatus, selected.index as number, newStatus);
            setSelected({ status: null, index: null });
          }}
          onRemove={() => {
            removeBook(selected.status as BookStatus, selected.index as number);
            setSelected({ status: null, index: null });
          }}
        />
      )}
    </div>
  );
}

export default App;
