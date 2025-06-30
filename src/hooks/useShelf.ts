import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import type { Book, BookshelfData, BookStatus } from "../types";

export function useShelf(user: User | null) {
  const [books, setBooks] = useState<BookshelfData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    const userRef = doc(db, "bookshelves", user.uid);

    setLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      userRef,
      (snapshot) => {
        try {
          if (snapshot.exists()) {
            const data = snapshot.data();
            setBooks(data.shelves || {});
          } else {
            // Initialize empty shelves for new users
            const initialShelves = {
              "Want to Read": [],
              "Currently Reading": [],
              "Finished Reading": [],
            };
            setDoc(userRef, { shelves: initialShelves });
            setBooks(initialShelves);
          }
          setLoading(false);
        } catch (err) {
          console.error("Error loading books:", err);
          setError("Failed to load your books");
          setLoading(false);
        }
      },
      (err) => {
        console.error("Firestore listener error:", err);
        setError("Connection error");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const updateRemote = async (newShelves: BookshelfData) => {
    if (user?.uid) {
      const userRef = doc(db, "bookshelves", user.uid);
      try {
        await updateDoc(userRef, { shelves: newShelves });
      } catch (err) {
        console.error("Error updating books:", err);
        setError("Failed to save changes");
      }
    }
  };

  const addBook = (book: Omit<Book, 'id' | 'addedAt' | 'updatedAt'>, status: BookStatus = "Want to Read") => {
    const newBook: Book = {
      ...book,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      addedAt: new Date(),
      updatedAt: new Date(),
    };

    const updated: BookshelfData = {
      ...books,
      [status]: [...(books[status] || []), newBook],
    };
    
    setBooks(updated);
    updateRemote(updated);
  };

  const updateStatus = (oldStatus: BookStatus, index: number, newStatus: BookStatus) => {
    const book = books[oldStatus]?.[index];
    if (!book) return;

    const updatedBook = { ...book, updatedAt: new Date() };
    const updated: BookshelfData = {
      ...books,
      [oldStatus]: books[oldStatus].filter((_, i) => i !== index),
      [newStatus]: [...(books[newStatus] || []), updatedBook],
    };
    
    setBooks(updated);
    updateRemote(updated);
  };

  const removeBook = (status: BookStatus, index: number) => {
    const updated: BookshelfData = {
      ...books,
      [status]: books[status].filter((_, i) => i !== index),
    };
    
    setBooks(updated);
    updateRemote(updated);
  };

  const updateBook = (status: BookStatus, index: number, updatedBook: Partial<Book>) => {
    const book = books[status]?.[index];
    if (!book) return;

    const newBook = { ...book, ...updatedBook, updatedAt: new Date() };
    const updated: BookshelfData = {
      ...books,
      [status]: books[status].map((b, i) => i === index ? newBook : b),
    };
    
    setBooks(updated);
    updateRemote(updated);
  };

  return { 
    books, 
    loading, 
    error, 
    addBook, 
    updateStatus, 
    removeBook, 
    updateBook 
  };
}
