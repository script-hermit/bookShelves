export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  thumbnail?: string;
  description?: string;
  pageCount?: number;
  publishedDate?: string;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  language?: string;
  publisher?: string;
  addedAt: Date;
  updatedAt: Date;
}

export interface BookshelfData {
  [status: string]: Book[];
}

export type BookStatus = 'Want to Read' | 'Currently Reading' | 'Finished Reading';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface SearchResult {
  kind: string;
  totalItems: number;
  items: GoogleBook[];
}

export interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    pageCount?: number;
    publishedDate?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    language?: string;
    publisher?: string;
    industryIdentifiers?: {
      type: string;
      identifier: string;
    }[];
  };
}

export interface DragEndEvent {
  active: {
    id: string;
    data: {
      current: {
        status: BookStatus;
        index: number;
      };
    };
  };
  over: {
    id: string;
    data: {
      current: {
        status: BookStatus;
      };
    };
  } | null;
}
