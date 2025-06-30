import { useMemo } from 'react';
import { FaBook, FaBookOpen, FaCheckCircle, FaClock, FaChartPie } from 'react-icons/fa';
import type { BookshelfData } from '../types';

interface StatsProps {
  books: BookshelfData;
}

export default function Stats({ books }: StatsProps) {
  const stats = useMemo(() => {
    const wantToRead = books['Want to Read']?.length || 0;
    const currentlyReading = books['Currently Reading']?.length || 0;
    const finishedReading = books['Finished Reading']?.length || 0;
    const total = wantToRead + currentlyReading + finishedReading;

    // Calculate reading progress
    const completionRate = total > 0 ? (finishedReading / total) * 100 : 0;

    // Calculate total pages read (estimate for books without page count)
    const totalPagesRead = Object.values(books).flat().reduce((acc, book) => {
      return acc + (book.pageCount || 250); // Default to 250 pages if not specified
    }, 0);

    // Find most common categories
    const categoryCount: { [key: string]: number } = {};
    Object.values(books).flat().forEach(book => {
      book.categories?.forEach(category => {
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });
    });

    const topCategories = Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category, count]) => ({ category, count }));

    return {
      wantToRead,
      currentlyReading,
      finishedReading,
      total,
      completionRate,
      totalPagesRead,
      topCategories,
    };
  }, [books]);

  if (stats.total === 0) {
    return (
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
          <div className="text-center text-gray-500">
            <FaBook className="text-4xl mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Start Your Reading Journey</h3>
            <p className="text-sm">Add your first book to see your reading statistics</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
        <div className="flex items-center gap-3 mb-6">
          <FaChartPie className="text-2xl text-amber-500" />
          <h2 className="text-2xl font-bold text-gray-800">Reading Statistics</h2>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
            <FaClock className="text-2xl text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">{stats.wantToRead}</div>
            <div className="text-sm text-blue-600">Want to Read</div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center">
            <FaBookOpen className="text-2xl text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-700">{stats.currentlyReading}</div>
            <div className="text-sm text-orange-600">Currently Reading</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
            <FaCheckCircle className="text-2xl text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700">{stats.finishedReading}</div>
            <div className="text-sm text-green-600">Finished Reading</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
            <FaBook className="text-2xl text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-700">{stats.total}</div>
            <div className="text-sm text-purple-600">Total Books</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Reading Progress</span>
            <span className="text-sm text-gray-600">{stats.completionRate.toFixed(1)}% completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(stats.completionRate, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pages Read */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-2">📖 Total Pages</h4>
            <div className="text-xl font-bold text-amber-700">
              {stats.totalPagesRead.toLocaleString()}
            </div>
            <div className="text-sm text-amber-600">
              Approximately {Math.round(stats.totalPagesRead / 250)} average books
            </div>
          </div>

          {/* Top Categories */}
          {stats.topCategories.length > 0 && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-3">🏷️ Top Categories</h4>
              <div className="space-y-2">
                {stats.topCategories.map(({ category, count }) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 truncate">{category}</span>
                    <span className="text-sm font-medium text-indigo-600">
                      {count} book{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            <span>📅 Tracking since your first book</span>
            <span>•</span>
            <span>🎯 Keep up the great reading habit!</span>
            {stats.currentlyReading > 0 && (
              <>
                <span>•</span>
                <span>📚 {stats.currentlyReading} book{stats.currentlyReading !== 1 ? 's' : ''} in progress</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
