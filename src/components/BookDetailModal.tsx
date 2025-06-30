import { useState } from 'react';
import { FaTimes, FaBook, FaStar, FaCalendar, FaUser, FaBuilding, FaGlobe, FaTrash, FaTag } from 'react-icons/fa';
import type { Book, BookStatus } from '../types';

interface BookDetailModalProps {
  book: Book;
  currentStatus: BookStatus;
  onClose: () => void;
  onUpdateStatus: (newStatus: BookStatus) => void;
  onRemove: () => void;
}

export default function BookDetailModal({ 
  book, 
  currentStatus, 
  onClose, 
  onUpdateStatus, 
  onRemove 
}: BookDetailModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<BookStatus>(currentStatus);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleStatusChange = () => {
    if (selectedStatus !== currentStatus) {
      onUpdateStatus(selectedStatus);
    }
  };

  const handleDelete = () => {
    onRemove();
    onClose();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.getFullYear().toString();
  };

  const statuses: BookStatus[] = ['Want to Read', 'Currently Reading', 'Finished Reading'];


  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <FaTimes />
        </button>
        <div className="modal-header">
          <FaBook className="modal-book-icon" />
          <h2 className="modal-title">{book.title}</h2>
        </div>
        <div className="modal-body">
          <div className="modal-info">
            <div><FaUser /> {book.author || 'Unknown Author'}</div>
            {book.publisher && <div><FaBuilding /> {book.publisher}</div>}
            {book.publishedDate && <div><FaCalendar /> {formatDate(book.publishedDate)}</div>}
            {book.language && <div><FaGlobe /> {book.language.toUpperCase()}</div>}
            {book.pageCount && <div><FaStar /> {book.pageCount} pages</div>}
            {book.categories && book.categories.length > 0 && (
              <div><FaTag /> {book.categories.join(', ')}</div>
            )}
            {book.isbn && <div>ISBN: {book.isbn}</div>}
          </div>
          {book.thumbnail && (
            <img className="modal-thumbnail" src={book.thumbnail} alt={book.title} />
          )}
          {book.description && (
            <div className="modal-description">{book.description}</div>
          )}
        </div>
        <div className="modal-actions">
          <select
            className="modal-select"
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value as BookStatus)}
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <button className="button" onClick={handleStatusChange} disabled={selectedStatus === currentStatus}>
            Move to Shelf
          </button>
          <button className="button button-secondary" onClick={() => setShowDeleteConfirm(true)}>
            <FaTrash /> Remove Book
          </button>
        </div>
        {showDeleteConfirm && (
          <div className="modal-delete-confirm">
            <p>Are you sure you want to remove this book?</p>
            <button className="button" onClick={handleDelete}>Yes, Remove</button>
            <button className="button button-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}
