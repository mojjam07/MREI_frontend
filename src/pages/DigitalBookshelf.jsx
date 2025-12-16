
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';
import PageHeader from '../components/layout/PageHeader';
import Footer from '../components/layout/Footer';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { API_BASE_URL, API_ENDPOINTS } from '../config';
import { Plus, Edit, Save, X } from 'lucide-react';


const DigitalBookshelf = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { createBook, updateBook, deleteBook, books: dashboardBooks, creatingBook, updatingBook, deletingBook } = useDashboard();
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  // Admin book management states
  const [editingBook, setEditingBook] = useState(null);
  const [addingBook, setAddingBook] = useState(false);
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    cover_image: null,
    pdf_file: null,
    publication_year: ''
  });



  useEffect(() => {
    // Use books from DashboardContext if available (for admin), otherwise fetch directly
    if (dashboardBooks) {
      setBooks(dashboardBooks);
    } else {
      fetch(API_BASE_URL + API_ENDPOINTS.COMMUNICATION.BOOKS)
        .then(response => response.json())
        .then(data => setBooks(data))
        .catch(error => console.error('Error fetching books:', error));
    }
  }, [dashboardBooks]);

  // Book management functions
  const handleBookSave = async (bookData, formFiles = null) => {
    try {
      // Check if we have files to upload
      if (formFiles && (formFiles.cover_image || formFiles.pdf_file)) {
        const formData = new FormData();
        
        // Append text fields
        formData.append('title', bookData.title || '');
        formData.append('author', bookData.author || '');
        formData.append('description', bookData.description || '');
        formData.append('genre', bookData.genre || '');
        formData.append('publication_year', bookData.publication_year || '');
        
        // Append files if they exist
        if (formFiles.cover_image) {
          formData.append('cover_image', formFiles.cover_image);
        }
        if (formFiles.pdf_file) {
          formData.append('pdf_file', formFiles.pdf_file);
        }
        
        if (bookData.id) {
          await updateBook({ id: bookData.id, data: formData });
          alert('Book updated successfully!');
        } else {
          await createBook(formData);
          alert('Book created successfully!');
        }
      } else {
        // Handle text-only updates (no file changes)
        if (bookData.id) {
          await updateBook({ id: bookData.id, data: bookData });
          alert('Book updated successfully!');
        } else {
          await createBook(bookData);
          alert('Book created successfully!');
        }
      }
      
      setEditingBook(null);
      setAddingBook(false);
      setBookForm({
        title: '',
        author: '',
        description: '',
        genre: '',
        cover_image: null,
        pdf_file: null,
        publication_year: ''
      });
    } catch (error) {
      console.error('Error saving book:', error);
      alert('Failed to save book');
    }
  };

  const handleBookDelete = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(bookId);
        alert('Book deleted successfully!');
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('Failed to delete book');
      }
    }
  };

  const openModal = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
    setIsReading(false);
    setPageNumber(1);
  };

  const startReading = () => {
    setIsReading(true);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />


      {/* Hero Section */}
      <section className="bg-primary text-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {t('digitalBookshelf.title')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-2xl mx-auto">
            {t('digitalBookshelf.subtitle')}
          </p>
        </div>
      </section>

      {/* Admin Book Management Section */}
      {user?.role === 'admin' && (
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Book Management</h2>
              <button
                onClick={() => setAddingBook(true)}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
                disabled={addingBook}
              >
                <Plus className="w-4 h-4" />
                Add New Book
              </button>
            </div>

            {/* Add/Edit Book Form */}
            {(addingBook || editingBook) && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">
                  {editingBook ? 'Edit Book' : 'Add New Book'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      value={editingBook ? editingBook.title : bookForm.title}
                      onChange={(e) => {
                        if (editingBook) {
                          setEditingBook({...editingBook, title: e.target.value});
                        } else {
                          setBookForm({...bookForm, title: e.target.value});
                        }
                      }}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all"
                      placeholder="Enter book title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Author</label>
                    <input
                      type="text"
                      value={editingBook ? editingBook.author : bookForm.author}
                      onChange={(e) => {
                        if (editingBook) {
                          setEditingBook({...editingBook, author: e.target.value});
                        } else {
                          setBookForm({...bookForm, author: e.target.value});
                        }
                      }}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all"
                      placeholder="Enter author name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Genre</label>
                    <input
                      type="text"
                      value={editingBook ? editingBook.genre : bookForm.genre}
                      onChange={(e) => {
                        if (editingBook) {
                          setEditingBook({...editingBook, genre: e.target.value});
                        } else {
                          setBookForm({...bookForm, genre: e.target.value});
                        }
                      }}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all"
                      placeholder="Enter genre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Publication Year</label>
                    <input
                      type="number"
                      value={editingBook ? editingBook.publication_year : bookForm.publication_year}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || '';
                        if (editingBook) {
                          setEditingBook({...editingBook, publication_year: value});
                        } else {
                          setBookForm({...bookForm, publication_year: value});
                        }
                      }}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all"
                      placeholder="2024"
                      min="1000"
                      max="2030"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Cover Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (editingBook) {
                          setEditingBook({...editingBook, cover_image: file});
                        } else {
                          setBookForm({...bookForm, cover_image: file});
                        }
                      }}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all"
                    />
                    {(editingBook?.cover_image || bookForm.cover_image) && typeof (editingBook?.cover_image || bookForm.cover_image) === 'object' && (
                      <p className="text-sm mt-1 text-gray-600">
                        Selected: {(editingBook?.cover_image || bookForm.cover_image).name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">PDF File</label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (editingBook) {
                          setEditingBook({...editingBook, pdf_file: file});
                        } else {
                          setBookForm({...bookForm, pdf_file: file});
                        }
                      }}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all"
                    />
                    {(editingBook?.pdf_file || bookForm.pdf_file) && typeof (editingBook?.pdf_file || bookForm.pdf_file) === 'object' && (
                      <p className="text-sm mt-1 text-gray-600">
                        Selected: {(editingBook?.pdf_file || bookForm.pdf_file).name}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={editingBook ? editingBook.description : bookForm.description}
                      onChange={(e) => {
                        if (editingBook) {
                          setEditingBook({...editingBook, description: e.target.value});
                        } else {
                          setBookForm({...bookForm, description: e.target.value});
                        }
                      }}
                      rows="3"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all"
                      placeholder="Enter book description"
                    ></textarea>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => {
                      if (editingBook) {
                        handleBookSave(editingBook, editingBook);
                      } else {
                        handleBookSave(bookForm, bookForm);
                      }
                    }}
                    disabled={creatingBook || updatingBook}
                    className="bg-success text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {(creatingBook || updatingBook) ? 'Saving...' : 'Save Book'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingBook(null);
                      setAddingBook(false);
                      setBookForm({
                        title: '',
                        author: '',
                        description: '',
                        genre: '',
                        cover_image: null,
                        pdf_file: null,
                        publication_year: ''
                      });
                    }}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Books Grid */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {books.map((book) => (

              <div
                key={book.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group relative"
              >
                <div onClick={() => openModal(book)} className="cursor-pointer">
                  <img
                    src={book.cover_image}
                    alt={book.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = '/images/placeholder-book.jpg';
                    }}
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{book.title}</h3>
                    <p className="text-gray-600 text-sm">{book.author}</p>
                  </div>
                </div>
                
                {/* Admin Controls */}
                {user?.role === 'admin' && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingBook(book);
                          setAddingBook(false);
                        }}
                        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                        title="Edit Book"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookDelete(book.id);
                        }}
                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                        title="Delete Book"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {!isReading ? (
              <div className="p-6">

                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold">{selectedBook.title}</h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    {t('digitalBookshelf.closeModal')}
                  </button>
                </div>
                <div className="flex flex-col md:flex-row gap-6">

                  <img
                    src={selectedBook.cover_image}
                    alt={selectedBook.title}
                    className="w-full md:w-48 h-64 object-cover rounded"
                    onError={(e) => {
                      e.target.src = '/images/placeholder-book.jpg';
                    }}
                  />
                  <div className="flex-1">

                    <p className="text-lg font-semibold mb-2">{t('digitalBookshelf.author')} {selectedBook.author}</p>
                    <p className="text-gray-700 mb-4">{selectedBook.description}</p>

                    <button
                      onClick={startReading}
                      className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition-colors"
                    >
                      {t('digitalBookshelf.readBook')}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6">

                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">{selectedBook.title}</h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    {t('digitalBookshelf.closeModal')}
                  </button>
                </div>
                <div className="flex justify-center mb-4">

                  <button
                    onClick={previousPage}
                    disabled={pageNumber <= 1}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded mr-2 disabled:opacity-50"
                  >
                    {t('digitalBookshelf.previous')}
                  </button>

                  <span className="px-4 py-2">
                    {t('digitalBookshelf.pageIndicator', { current: pageNumber, total: numPages })}
                  </span>

                  <button
                    onClick={nextPage}
                    disabled={pageNumber >= numPages}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded ml-2 disabled:opacity-50"
                  >
                    {t('digitalBookshelf.next')}
                  </button>
                </div>
                <div className="flex justify-center">

                  <Document
                    file={selectedBook.pdf_file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="border"
                  >
                    <Page pageNumber={pageNumber} />
                  </Document>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default DigitalBookshelf;
