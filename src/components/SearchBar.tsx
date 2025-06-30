import { useState } from 'react';
import { FaSearch, FaSpinner, FaPlus } from 'react-icons/fa';
import type { GoogleBook, Book, BookStatus } from '../types';

interface SearchBarProps {
  onAdd: (book: Omit<Book, 'id' | 'addedAt' | 'updatedAt'>, status?: BookStatus) => void;
}

export default function SearchBar({ onAdd }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GoogleBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchBooks = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          searchQuery
        )}&maxResults=10&key=${import.meta.env.VITE_GOOGLE_BOOKS_API_KEY || ''}`
      );
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data.items || []);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchBooks(query);
  };

  const handleAddBook = (googleBook: GoogleBook, status: BookStatus = 'Want to Read') => {
    const book: Omit<Book, 'id' | 'addedAt' | 'updatedAt'> = {
      title: googleBook.volumeInfo.title,
      author: googleBook.volumeInfo.authors?.join(', ') || 'Unknown Author',
      isbn: googleBook.volumeInfo.industryIdentifiers?.find(id => 
        id.type === 'ISBN_13' || id.type === 'ISBN_10'
      )?.identifier,
      thumbnail: googleBook.volumeInfo.imageLinks?.thumbnail,
      description: googleBook.volumeInfo.description,
      pageCount: googleBook.volumeInfo.pageCount,
      publishedDate: googleBook.volumeInfo.publishedDate,
      categories: googleBook.volumeInfo.categories || [],
      averageRating: googleBook.volumeInfo.averageRating,
      ratingsCount: googleBook.volumeInfo.ratingsCount,
      language: googleBook.volumeInfo.language,
      publisher: googleBook.volumeInfo.publisher,
    };

    onAdd(book, status);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="searchbar-container">
      <form className="searchbar-form" onSubmit={handleSearch} autoComplete="off">
        <input
          className="searchbar-input"
          type="text"
          placeholder="Search for books by title, author, or ISBN..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button className="button searchbar-button" type="submit" disabled={loading} aria-label="Search">
          {loading ? <FaSpinner className="searchbar-spinner" /> : <FaSearch />}
        </button>
      </form>
      {showResults && results.length > 0 && (
        <ul className="searchbar-results">
          {results.map((book, idx) => (
            <li key={book.id || idx} className="searchbar-result">
              <div className="searchbar-result-info">
                {book.volumeInfo.imageLinks?.thumbnail && (
                  <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} className="searchbar-result-thumb" />
                )}
                <div className="searchbar-result-meta">
                  <div className="searchbar-result-title">{book.volumeInfo.title}</div>
                  <div className="searchbar-result-author">{book.volumeInfo.authors?.join(', ')}</div>
                </div>
              </div>
              <button
                className="button searchbar-add"
                type="button"
                onClick={() => handleAddBook(book)}
                aria-label="Add book"
              >
                <FaPlus />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
