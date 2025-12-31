import React, { useState } from 'react';
import { safeArray } from '../../../../utils/dateUtils';

const BooksSection = ({ t, books = [], booksLoading, createBook }) => {
  const safeBooks = safeArray(books);
  const [showForm, setShowForm] = useState(false);
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
      await createBook(formData);
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
    } catch (error) {
      console.error('Error creating book:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (booksLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-accent-color/20 backdrop-blur-sm rounded-lg p-6 border border-white/20 animate-pulse-gentle"
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-light-text mb-2 animate-fade-in-up">
            {t('dashboard.booksManagement') || 'Books Management'}
          </h2>
          <p className="text-light-text/80 animate-fade-in-up delay-100">
            {t('dashboard.booksDescription') || 'Manage digital books and resources'}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-primary text-light-text rounded-lg font-medium transition-all hover:scale-105 hover-lift animate-bounce-in"
        >
          {showForm ? (t('dashboard.cancel') || 'Cancel') : (t('dashboard.addBook') || 'Add Book')}
        </button>
      </div>

      {/* Add Book Form */}
      {showForm && (
        <div className="bg-gradient-to-br from-dark-gradient-start to-dark-gradient-end backdrop-blur-sm rounded-lg p-6 border border-white/10 shadow-xl shadow-primary/10 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4 pb-2 border-b border-white/10">
            <span className="w-1 h-6 bg-gradient-to-b from-primary to-coral rounded-full"></span>
            <h3 className="text-xl font-semibold text-light-text">
              {t('dashboard.addNewBook') || 'Add New Book'}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.title') || 'Title'} *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('dashboard.enterTitle') || 'Enter book title'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.author') || 'Author'} *
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('dashboard.enterAuthor') || 'Enter author name'}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.isbn') || 'ISBN'} *
                </label>
                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('dashboard.enterISBN') || 'Enter ISBN'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.category') || 'Category'} *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('dashboard.enterCategory') || 'Enter category'}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-light-text mb-1">
                {t('dashboard.description') || 'Description'}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary resize-vertical"
                placeholder={t('dashboard.enterDescription') || 'Enter book description'}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.genre') || 'Genre'}
                </label>
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('dashboard.enterGenre') || 'Enter genre'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.publicationYear') || 'Publication Year'}
                </label>
                <input
                  type="text"
                  name="publication_year"
                  value={formData.publication_year}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('dashboard.enterPublicationYear') || 'Enter publication year'}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.coverImage') || 'Cover Image URL'}
                </label>
                <input
                  type="text"
                  name="cover_image"
                  value={formData.cover_image}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('dashboard.enterCoverImage') || 'Enter cover image URL'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.pdfFile') || 'PDF File URL'}
                </label>
                <input
                  type="text"
                  name="pdf_file"
                  value={formData.pdf_file}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('dashboard.enterPdfFile') || 'Enter PDF file URL'}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.fileType') || 'File Type'}
                </label>
                <select
                  name="file_type"
                  value={formData.file_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">{t('dashboard.selectFileType') || 'Select type'}</option>
                  <option value="pdf">PDF</option>
                  <option value="epub">EPUB</option>
                  <option value="mobi">MOBI</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.fileSize') || 'File Size (MB)'}
                </label>
                <input
                  type="text"
                  name="file_size"
                  value={formData.file_size}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text placeholder-light-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('dashboard.enterFileSize') || 'e.g., 2.5'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-text mb-1">
                  {t('dashboard.available') || 'Available'}
                </label>
                <select
                  name="available"
                  value={formData.available}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-light-text focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="true">{t('dashboard.yes') || 'Yes'}</option>
                  <option value="false">{t('dashboard.no') || 'No'}</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary text-light-text rounded-lg font-medium hover:bg-primary/80 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (t('dashboard.creating') || 'Creating...') : (t('dashboard.createBook') || 'Create Book')}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-500/20 text-gray-300 rounded-lg font-medium hover:bg-gray-500/30 transition-colors"
              >
                {t('dashboard.cancel') || 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Books Grid */}
      <div className="grid gap-6">
        {safeBooks.length > 0 ? (
          safeBooks.map((book, index) => (
            <div
              key={book?.id || index}
              className="bg-gradient-to-br from-dark-gradient-start to-dark-gradient-end backdrop-blur-sm rounded-lg p-6 border border-coral/30 hover:border-coral/50 transition-all duration-300 hover-lift animate-fade-in-left shadow-lg shadow-primary/10"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-light-text mb-2">{book?.title || 'Unknown Title'}</h3>
                  <p className="text-light-text/80 text-sm mb-3">{book?.author || 'Unknown Author'}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-light-text/60">
                    <span>
                      {t('dashboard.category') || 'Category'}: {book?.category || 'General'}
                    </span>
                    <span>
                      {t('dashboard.isbn') || 'ISBN'}: {book?.isbn || 'N/A'}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        (book?.status || 'available') === 'available'
                          ? 'bg-success-color/20 text-success-color'
                          : 'bg-error-color/20 text-error-color'
                      }`}
                    >
                      {book?.status || 'available'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <button className="px-3 py-1 bg-secondary-color/20 text-secondary-color rounded hover:bg-secondary-color/30 transition-colors">
                    {t('dashboard.edit') || 'Edit'}
                  </button>
                  <button className="px-3 py-1 bg-error-color/20 text-error-color rounded hover:bg-error-color/30 transition-colors">
                    {t('dashboard.delete') || 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 animate-fade-in-up">
            <p className="text-light-text/60 text-lg">{t('dashboard.noBooks') || 'No books found'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksSection;
