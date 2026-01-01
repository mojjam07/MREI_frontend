import React, { useState } from 'react';
import { safeArray, safeString } from '../../../../utils/dateUtils';
import { Plus, X, Edit2, Trash2, BookOpen, User, BarChart, FileText } from 'lucide-react';

const BooksSection = ({ t, books = [], booksLoading, createBook, updateBook, deleteBook }) => {
  const safeBooks = safeArray(books);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    genre: '',
    publication_year: '',
    description: '',
    cover_image: '',
    pdf_file: '',
    file_type: '',
    file_size: '',
    available: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateBook({ id: editingId, data: formData });
      } else {
        await createBook(formData);
      }
      setFormData({
        title: '',
        author: '',
        isbn: '',
        category: '',
        genre: '',
        publication_year: '',
        description: '',
        cover_image: '',
        pdf_file: '',
        file_type: '',
        file_size: '',
        available: true
      });
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error saving book:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (book) => {
    setFormData({
      title: book.title || '',
      author: book.author || '',
      isbn: book.isbn || '',
      category: book.category || '',
      genre: book.genre || '',
      publication_year: book.publication_year || '',
      description: book.description || '',
      cover_image: book.cover_image || '',
      pdf_file: book.pdf_file || '',
      file_type: book.file_type || '',
      file_size: book.file_size || '',
      available: book.available !== undefined ? book.available : true
    });
    setEditingId(book.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('dashboard.confirmDelete') || 'Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      category: '',
      genre: '',
      publication_year: '',
      description: '',
      cover_image: '',
      pdf_file: '',
      file_type: '',
      file_size: '',
      available: true
    });
    setShowForm(false);
    setEditingId(null);
  };

  const getStatusColor = (available) => {
    return available
      ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30'
      : 'bg-rose-400/20 text-rose-400 border border-rose-400/30';
  };

  const fileTypes = [
    { value: 'pdf', label: 'PDF' },
    { value: 'epub', label: 'EPUB' },
    { value: 'mobi', label: 'MOBI' },
    { value: 'other', label: 'Other' }
  ];

  if (booksLoading) {
    return (
      <div className="space-y-3 sm:space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="glass-card p-4 sm:p-6 animate-pulse-gentle"
          >
            <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-white/20 rounded w-full mb-1"></div>
            <div className="h-3 bg-white/20 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 animate-fade-in-up">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
            <span className="w-1 h-6 sm:h-8 bg-gradient-to-b from-primary to-coral rounded-full animate-pulse-gentle flex-shrink-0"></span>
            <span className="truncate">{t('dashboard.booksManagement') || 'Books Management'}</span>
          </h2>
          <p className="text-sm sm:text-base text-light-text/80 hidden sm:block">
            {t('dashboard.booksDescription') || 'Manage digital books and resources'}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary to-coral text-white rounded-lg font-medium hover-lift hover-scale transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          {showForm ? (
            <>
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{t('dashboard.cancel') || 'Cancel'}</span>
              <span className="sm:hidden">Close</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              {t('dashboard.addBook') || 'Add Book'}
            </>
          )}
        </button>
      </div>

      {/* Add/Edit Book Form */}
      {showForm && (
        <div className="glass-card p-4 sm:p-6 animate-fade-in-up hover-lift hover-glow-amber">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 pb-2 border-b border-white/10">
            <span className="w-1 h-5 sm:h-6 bg-gradient-to-b from-primary to-coral rounded-full animate-pulse-gentle flex-shrink-0"></span>
            <h3 className="text-lg sm:text-xl font-semibold text-light-text">
              {editingId ? (t('dashboard.editBook') || 'Edit Book') : (t('dashboard.addNewBook') || 'Add New Book')}
            </h3>
            <button
              onClick={handleCancel}
              className="ml-auto p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              aria-label="Cancel"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-light-text mb-1">
                  {t('dashboard.title') || 'Title'} *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder={t('dashboard.enterTitle') || 'Enter book title'}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-light-text mb-1">
                  {t('dashboard.author') || 'Author'} *
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder={t('dashboard.enterAuthor') || 'Enter author name'}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-light-text mb-1">
                  {t('dashboard.isbn') || 'ISBN'}
                </label>
                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder={t('dashboard.enterISBN') || 'Enter ISBN'}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-light-text mb-1">
                  {t('dashboard.category') || 'Category'}
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder={t('dashboard.enterCategory') || 'Enter category'}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-light-text mb-1">
                {t('dashboard.description') || 'Description'}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary resize-vertical text-sm sm:text-base"
                placeholder={t('dashboard.enterDescription') || 'Enter book description'}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-light-text mb-1">
                  {t('dashboard.genre') || 'Genre'}
                </label>
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder={t('dashboard.enterGenre') || 'Enter genre'}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-light-text mb-1">
                  {t('dashboard.publicationYear') || 'Publication Year'}
                </label>
                <input
                  type="text"
                  name="publication_year"
                  value={formData.publication_year}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder={t('dashboard.enterPublicationYear') || 'Enter publication year'}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-light-text mb-1">
                  {t('dashboard.coverImage') || 'Cover Image URL'}
                </label>
                <input
                  type="text"
                  name="cover_image"
                  value={formData.cover_image}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder={t('dashboard.enterCoverImage') || 'Enter cover image URL'}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-light-text mb-1">
                  {t('dashboard.pdfFile') || 'PDF File URL'}
                </label>
                <input
                  type="text"
                  name="pdf_file"
                  value={formData.pdf_file}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder={t('dashboard.enterPdfFile') || 'Enter PDF file URL'}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-light-text mb-1">
                  {t('dashboard.fileType') || 'File Type'}
                </label>
                <select
                  name="file_type"
                  value={formData.file_type}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-light-text focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                >
                  <option value="">{t('dashboard.selectFileType') || 'Select type'}</option>
                  {fileTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-light-text mb-1">
                  {t('dashboard.fileSize') || 'File Size (MB)'}
                </label>
                <input
                  type="text"
                  name="file_size"
                  value={formData.file_size}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder={t('dashboard.enterFileSize') || 'e.g., 2.5'}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-light-text mb-1">
                  {t('dashboard.available') || 'Available'}
                </label>
                <select
                  name="available"
                  value={formData.available.toString()}
                  onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.value === 'true' }))}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 glass-card text-light-text focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                >
                  <option value="true">{t('dashboard.yes') || 'Yes'}</option>
                  <option value="false">{t('dashboard.no') || 'No'}</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary to-coral text-white rounded-lg font-medium hover-lift hover-scale transition-all disabled:opacity-50 shadow-lg hover:shadow-primary/30 text-sm sm:text-base"
              >
                {isSubmitting ? (t('dashboard.saving') || 'Saving...') : editingId ? (t('dashboard.update') || 'Update') : (t('dashboard.createBook') || 'Create Book')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 glass-card text-light-text rounded-lg font-medium hover-lift hover-scale transition-all border border-white/20 hover:border-white/40 text-sm sm:text-base"
              >
                {t('dashboard.cancel') || 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Books Grid */}
      <div className="grid gap-4 sm:gap-6">
        {safeBooks.length > 0 ? (
          safeBooks.map((book, index) => (
            <div
              key={book?.id || index}
              className="glass-card p-4 sm:p-6 hover-lift hover-glow-amber animate-scale-in glow-amber border border-white/20 hover:border-white/40 transition-all duration-300"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className="flex flex-col">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-1 h-5 sm:h-6 bg-gradient-to-b from-primary to-coral rounded-full animate-pulse-gentle flex-shrink-0"></span>
                      <h3 className="text-lg sm:text-xl font-semibold text-light-text truncate">
                        {safeString(book?.title, 'Unknown Title')}
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(book?.available)}`}>
                        <BarChart className="w-3 h-3" />
                        {safeString(book?.available ? t('dashboard.available') : t('dashboard.unavailable'), book?.available ? 'Available' : 'Unavailable')}
                      </span>
                      {book?.category && (
                        <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium bg-blue-400/20 text-blue-400 border border-blue-400/30 flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {safeString(book.category)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {book?.description && (
                  <p className="text-sm sm:text-base text-light-text/80 mb-3 line-clamp-2">
                    {safeString(book.description)}
                  </p>
                )}

                {/* Meta Information */}
                <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-light-text/60 mb-3">
                  {book?.author && (
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-coral flex-shrink-0" />
                      <span className="hidden sm:inline">{t('dashboard.author') || 'Author'}:</span>
                      <span className="sm:hidden">By:</span>
                      {safeString(book.author)}
                    </span>
                  )}
                  {book?.isbn && (
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 text-xs flex-shrink-0">#</span>
                      <span className="hidden sm:inline">{t('dashboard.isbn') || 'ISBN'}:</span>
                      <span className="sm:hidden">ISBN:</span>
                      {safeString(book.isbn)}
                    </span>
                  )}
                  {book?.genre && (
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
                      <span className="hidden sm:inline">{t('dashboard.genre') || 'Genre'}:</span>
                      <span className="sm:hidden">Genre:</span>
                      {safeString(book.genre)}
                    </span>
                  )}
                  {book?.publication_year && (
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-400 text-xs flex-shrink-0">📅</span>
                      <span className="hidden sm:inline">{t('dashboard.year') || 'Year'}:</span>
                      <span className="sm:hidden">Yr:</span>
                      {safeString(book.publication_year)}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 w-full pt-2 border-t border-white/10">
                  <button
                    onClick={() => handleEdit(book)}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-primary/20 to-coral/20 text-light-text rounded-lg hover-lift hover-scale transition-all duration-300 border border-primary/30 hover:border-primary/50 text-xs sm:text-sm flex items-center justify-center gap-1"
                  >
                    <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{t('dashboard.edit') || 'Edit'}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(book?.id)}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 glass-card text-rose-400 rounded-lg hover-lift hover-scale transition-all duration-300 border border-rose-400/30 hover:border-rose-400/50 hover:text-rose-300 text-xs sm:text-sm flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{t('dashboard.delete') || 'Delete'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card p-8 sm:p-12 text-center animate-fade-in-up">
            <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-light-text/20 mb-4" />
            <p className="text-base sm:text-lg text-light-text/60">
              {t('dashboard.noBooks') || 'No books found'}
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-primary to-coral text-white rounded-lg font-medium hover-lift transition-all shadow-lg hover:shadow-primary/30"
            >
              {t('dashboard.addFirstBook') || 'Add your first book'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksSection;

