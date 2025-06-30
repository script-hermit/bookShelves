import { useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { FaBook } from 'react-icons/fa';
import type { Book } from '../types';

interface BookSpineProps {
  book: Book;
  index: number;
  status: string;
  onClick: () => void;
}

function BookSpine({ book, index, status, onClick }: BookSpineProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `${status}-${index}`,
    data: {
      status,
      index,
      book,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 2 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    backgroundColor: isDragging ? 'rgba(255, 0, 0, 0.1)' : 'transparent',
  };

  // Track if we're actually dragging
  const handleClick = (e: React.MouseEvent) => {
    // Don't open modal if we just finished dragging
    if (isDragging) {
      e.preventDefault();
      return;
    }
    onClick();
  };

  // Generate a consistent color for each book based on genre
  const getBookColor = (book: Book) => {
    // Define genre color mappings
    const genreColors = {
      // Fiction genres
      'Fiction': ['#8B4513', '#A0522D'], // Brown - classic literature
      'Romance': ['#FF69B4', '#C71585'], // Pink/Magenta
      'Mystery': ['#2F4F4F', '#1C1C1C'], // Dark gray/black
      'Thriller': ['#8B0000', '#4B0000'], // Dark red
      'Horror': ['#1a0000', '#330000'], // Very dark red/black
      'Fantasy': ['#4B0082', '#7B68EE'], // Purple/Indigo
      'Science Fiction': ['#00CED1', '#4682B4'], // Teal/Steel blue
      'Historical Fiction': ['#D2691E', '#CD853F'], // Peru/Tan
      'Adventure': ['#228B22', '#32CD32'], // Forest/Lime green
      'Young Adult': ['#FF1493', '#FF6347'], // Deep pink/Tomato
      
      // Non-fiction genres
      'Biography': ['#2E8B57', '#3CB371'], // Sea green
      'Autobiography': ['#2E8B57', '#3CB371'], // Sea green
      'History': ['#B8860B', '#DAA520'], // Dark/Golden rod
      'Philosophy': ['#483D8B', '#6A5ACD'], // Dark slate blue
      'Psychology': ['#5F9EA0', '#87CEEB'], // Cadet/Sky blue
      'Science': ['#008B8B', '#20B2AA'], // Dark cyan/Light sea green
      'Technology': ['#4169E1', '#6495ED'], // Royal/Cornflower blue
      'Business': ['#556B2F', '#6B8E23'], // Dark olive green
      'Self-Help': ['#FF7F50', '#FFA500'], // Coral/Orange
      'Health': ['#98FB98', '#90EE90'], // Pale/Light green
      'Travel': ['#20B2AA', '#48D1CC'], // Light sea green/Medium turquoise
      'Cooking': ['#FF4500', '#FF6347'], // Orange red/Tomato
      'Art': ['#9370DB', '#BA55D3'], // Medium/Medium orchid
      'Music': ['#FFD700', '#FFA500'], // Gold/Orange
      'Sports': ['#32CD32', '#228B22'], // Lime/Forest green
      
      // Academic subjects
      'Education': ['#4682B4', '#87CEEB'], // Steel/Sky blue
      'Mathematics': ['#2F4F4F', '#708090'], // Dark slate gray/Slate gray
      'Literature': ['#8B4513', '#CD853F'], // Saddle brown/Peru
      'Religion': ['#663399', '#9966CC'], // Rebecca purple variants
      'Social Science': ['#B8860B', '#DAA520'], // Dark/Golden rod
      'Political Science': ['#2F4F4F', '#696969'], // Dark slate/Dim gray
      
      // Default fallback
      'General': ['#708090', '#A9A9A9'], // Slate/Dark gray
    };

    // Get the first category if available, or use 'General' as fallback
    const primaryGenre = book.categories?.[0] || 'General';
    
    // Find matching genre (case-insensitive partial matching)
    const matchedGenre = Object.keys(genreColors).find(genre => 
      primaryGenre.toLowerCase().includes(genre.toLowerCase()) ||
      genre.toLowerCase().includes(primaryGenre.toLowerCase())
    );
    
    if (matchedGenre) {
      return genreColors[matchedGenre as keyof typeof genreColors];
    }
    
    // If no genre match, use title-based hashing as fallback
    const colors = Object.values(genreColors);
    let hash = 0;
    for (let i = 0; i < book.title.length; i++) {
      hash = book.title.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };
  
  const [from, to] = getBookColor(book);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="book-spine"
      onClick={handleClick}
      tabIndex={0}
      aria-label={`Drag to move or click to view details for ${book.title}`}
    >
      <div
        className="book-spine-gradient"
        style={{
          background: `linear-gradient(to bottom, ${from}, ${to})`,
        }}
      >
        <FaBook className="book-spine-icon" />
        <span className="book-spine-title">{book.title}</span>
      </div>
    </div>
  );
}

interface ShelfProps {
  label: string;
  books: Book[];
  status: string;
  onBookClick: (book: Book) => void;
  children?: React.ReactNode;
}

export default function Shelf({ label, books, status, onBookClick, children }: ShelfProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: status,
  });

  const style = {
    backgroundColor: isOver ? 'rgba(191, 160, 117, 0.1)' : undefined,
  };

  return (
    <div className="shelf" ref={setNodeRef} style={style}>
      <div className="shelf-label">{label}</div>
      <div className="shelf-books">
        {books.length === 0 ? (
          <div className="shelf-empty">No books</div>
        ) : (
          books.map((book, idx) => (
            <BookSpine
              key={book.id || idx}
              book={book}
              index={idx}
              status={status}
              onClick={() => onBookClick(book)}
            />
          ))
        )}
      </div>
      <div className="shelf-edge" />
      {children}
    </div>
  );
}
