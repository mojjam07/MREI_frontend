
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';


import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';
import PageHeader from '../components/layout/PageHeader';
import Footer from '../components/layout/Footer';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';


import { Plus, Edit, Save, X, Upload } from 'lucide-react';







import { pdfjs } from 'react-pdf';

// Configure PDF.js worker using the standard react-pdf approach
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

console.log('PDF.js worker configured with:', pdfjs.GlobalWorkerOptions.workerSrc);
console.log('React-PDF version:', pdfjs.version);

const DigitalBookshelf = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const { createBook, updateBook, deleteBook, books: dashboardBooks, creatingBook, updatingBook } = useDashboard();
  const books = dashboardBooks || [];
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

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
      // Show more specific error message
      let errorMessage = 'Failed to save book. Please try again.';
      if (error.response?.data) {
        // If there's a response from the server, show the server error
        const serverErrors = error.response.data;
        if (typeof serverErrors === 'object') {
          const errorDetails = Object.entries(serverErrors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n');
          errorMessage = `Failed to save book:\n${errorDetails}`;
        } else if (typeof serverErrors === 'string') {
          errorMessage = `Failed to save book: ${serverErrors}`;
        }
      } else if (error.message) {
        errorMessage = `Failed to save book: ${error.message}`;
      }
      alert(errorMessage);
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
    setPdfLoading(true);
    setPdfError(null);
    setPageNumber(1);
    setNumPages(null);

    // Add timeout for loading state to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (pdfLoading) {
        console.warn('PDF loading timeout reached, checking worker status...');
        console.warn('Worker source:', pdfjs.GlobalWorkerOptions.workerSrc);
        console.warn('React-PDF version:', pdfjs.version);
        setPdfError('PDF loading timed out. This may be due to worker configuration issues. Check console for details.');
        setPdfLoading(false);
      }
    }, 15000); // Reduced to 15 seconds for faster feedback

    // Store timeout ID for cleanup
    setTimeout(() => clearTimeout(loadingTimeout), 16000);
  };


  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPdfLoading(false);
    setPdfError(null);
    console.log('PDF loaded successfully with', numPages, 'pages');
  };





  const onDocumentLoadError = (error) => {
    console.group('PDF Loading Error Analysis');
    console.error('Error details:', {
      error,
      message: error?.message,
      name: error?.name,
      stack: error?.stack,
      selectedBook: selectedBook,
      fileType: selectedBook?.pdf_file?.type || 'unknown',
      fileSize: selectedBook?.pdf_file?.size || 'unknown',
      workerSrc: pdfjs.GlobalWorkerOptions.workerSrc,
      reactPdfVersion: pdfjs.version,
      pdfjsDistVersion: pdfjs.version
    });
    console.groupEnd();

    setPdfLoading(false);
    let errorMessage = 'Failed to load PDF file. ';
    let shouldRetry = false;

    // Enhanced error detection and messaging
    if (error?.name === 'InvalidPDFException') {
      errorMessage += 'The file appears to be corrupted or is not a valid PDF. Please check if the file is not password-protected or corrupted.';
    } else if (error?.name === 'MissingPDFException') {
      errorMessage += 'PDF content could not be found in the file. The file may be incomplete or corrupted.';
    } else if (error?.name === 'UnexpectedServerResponse') {
      errorMessage += 'Server returned an unexpected response. Please check if the file exists and the server is accessible.';
      shouldRetry = true;
    } else if (error?.message?.includes('CORS')) {
      errorMessage += 'Cross-origin access is blocked. This might be due to server CORS settings or an inaccessible URL.';
    } else if (error?.message?.includes('404')) {
      errorMessage += 'The PDF file could not be found. Please check if the URL is correct.';
    } else if (error?.message?.includes('Worker') || error?.message?.includes('worker')) {
      errorMessage += 'There seems to be an issue with the PDF processing worker. This might be due to version incompatibility or network issues.';
      shouldRetry = true;
    } else if (error?.message?.includes('Failed to fetch') || error?.message?.includes('Network Error')) {
      errorMessage += 'Network error occurred while loading the PDF. Please check your internet connection.';
      shouldRetry = true;
    } else if (error?.message?.includes('Loading chunk') || error?.message?.includes('Loading PDF')) {
      errorMessage += 'The PDF is taking too long to load. This may be due to file size or network issues.';
      shouldRetry = true;
    } else if (selectedBook?.pdf_file?.type && selectedBook?.pdf_file?.type !== 'application/pdf') {
      errorMessage += `Invalid file type: ${selectedBook.pdf_file.type}. Please ensure you have selected a valid PDF file.`;
    } else if (selectedBook?.pdf_file?.size > 50 * 1024 * 1024) {
      errorMessage += 'The PDF file is too large. Maximum size allowed is 50MB.';
    } else if (selectedBook?.id === 'local-temp' && selectedBook?.pdf_file instanceof File) {
      // Special handling for local files
      errorMessage += 'Local PDF file could not be processed. This may be due to browser security restrictions or file corruption.';
      shouldRetry = true;
    } else {
      errorMessage += 'An unexpected error occurred while loading the PDF. Please try again or contact support if the problem persists.';
      shouldRetry = true;
    }

    setPdfError(errorMessage);

    // Add retry option for recoverable errors
    if (shouldRetry && selectedBook) {
      const retryConfirmed = window.confirm(errorMessage + '\n\nWould you like to try loading the PDF again?');
      if (retryConfirmed) {
        console.log('Retrying PDF load for book:', selectedBook.title);
        setPdfLoading(true);
        setPdfError(null);
        // Small delay before retry
        setTimeout(() => {
          // Force re-render by updating page number
          setPageNumber(1);
        }, 500);
        return;
      }
    }
  };







  // Enhanced function to get the correct file format for react-pdf with better validation
  const getPdfFile = (book) => {
    console.log('Getting PDF file for book:', book.title, 'ID:', book.id);
    console.log('Book PDF file details:', {
      type: typeof book.pdf_file,
      isFile: book.pdf_file instanceof File,
      fileName: book.pdf_file?.name,
      fileSize: book.pdf_file?.size,
      fileType: book.pdf_file?.type,
      url: book.pdf_file?.url
    });

    try {
      if (book.id === 'local-temp') {
        // For local files, return the File object directly
        const file = book.pdf_file;
        console.log('Local file detected:', {
          name: file?.name,
          size: file?.size,
          type: file?.type,
          lastModified: file?.lastModified
        });

        if (!file) {
          console.error('No local file provided for local-temp book');
          return null;
        }

        if (!(file instanceof File)) {
          console.error('Local file is not a File object:', typeof file);
          return null;
        }

        // Enhanced validation for local files
        if (file.type !== 'application/pdf' && !file.name?.toLowerCase().endsWith('.pdf')) {
          console.error('Invalid file type for local PDF:', {
            type: file.type,
            name: file.name,
            endsWithPdf: file.name?.toLowerCase().endsWith('.pdf')
          });
          return null;
        }

        // Check file size
        if (file.size > 50 * 1024 * 1024) {
          console.error('File too large for local PDF:', file.size);
          return null;
        }

        console.log('Returning local File object for PDF rendering');
        return file;
      } else if (typeof book.pdf_file === 'string') {
        // For server URLs, return the string URL
        const url = book.pdf_file.trim();
        console.log('Remote URL detected:', url);

        if (!url) {
          console.error('Empty URL provided for remote PDF');
          return null;
        }

        // Basic URL validation
        if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
          console.error('Invalid URL format for remote PDF:', url);
          return null;
        }

        console.log('Returning URL string for PDF rendering');
        return url;
      } else if (book.pdf_file && typeof book.pdf_file === 'object') {
        // Handle File objects from other sources
        if (book.pdf_file instanceof File) {
          console.log('File object detected from other source');
          return book.pdf_file;
        }

        // Check for URL property
        if (book.pdf_file.url && typeof book.pdf_file.url === 'string') {
          console.log('URL property found in object:', book.pdf_file.url);
          return book.pdf_file.url;
        }

        console.error('Object PDF file does not have valid File or URL property');
        return null;
      }

      console.error('No valid PDF file found in book object - invalid structure');
      return null;
    } catch (error) {
      console.error('Error in getPdfFile:', error);
      console.error('Error stack:', error.stack);
      return null;
    }
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  };


  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);







  const handleLocalFileChange = (event) => {
    const file = event.target.files[0];
    
    if (!file) {
      alert('Please select a file.');
      return;
    }

    // Enhanced file validation
    if (file.type !== 'application/pdf') {
      alert('Please select a valid PDF file. Current file type: ' + file.type);
      return;
    }

    // File size validation (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      alert(`File is too large. Maximum size allowed is 50MB. Current file size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return;
    }

    // File name validation
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('File must have a .pdf extension.');
      return;
    }

    console.log('Processing local PDF file:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });

    setSelectedBook({
      id: 'local-temp',
      title: file.name.replace('.pdf', ''),
      author: 'Local Document',
      description: t('digitalBookshelf.uploadSubtitle'),
      pdf_file: file, // Pass File object directly
      cover_image: null,
      fileName: file.name,
      fileSize: file.size
    });
    setIsReading(true);
    setIsModalOpen(true);
    setPageNumber(1);
    setNumPages(null); // Reset pages
    setPdfLoading(true);
    setPdfError(null);
    
    // Clear the input for future uploads
    event.target.value = '';
  };

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

      {/* Local PDF Reader Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-50 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('digitalBookshelf.uploadTitle')}</h2>
                    <p className="text-gray-600">{t('digitalBookshelf.uploadSubtitle')}</p>
                </div>
                <div>
                     <label className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors cursor-pointer shadow-md">
                        <Upload className="w-5 h-5" />
                        <span className="font-medium">{t('digitalBookshelf.selectFile')}</span>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleLocalFileChange}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>
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
                        // For editing, separate book data from files
                        const { cover_image, pdf_file, ...bookData } = editingBook;
                        const files = { cover_image, pdf_file };
                        handleBookSave(bookData, files);
                      } else {
                        // For new books, bookForm contains both data and files
                        const { cover_image, pdf_file, ...bookData } = bookForm;
                        const files = { cover_image, pdf_file };
                        handleBookSave(bookData, files);
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
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowDebugInfo(!showDebugInfo)}
                      className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 transition-colors"
                      title="Toggle Debug Info"
                    >
                      Debug
                    </button>
                    <button
                      onClick={closeModal}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      {t('digitalBookshelf.closeModal')}
                    </button>
                  </div>
                </div>

                {/* Debug Information Panel */}
                {showDebugInfo && (
                  <div className="mb-4 p-3 bg-gray-100 rounded-lg text-xs font-mono">
                    <h3 className="font-bold mb-2">PDF Debug Information</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>Worker Source: {pdfjs.GlobalWorkerOptions.workerSrc}</div>
                      <div>React-PDF Version: {pdfjs.version}</div>
                      <div>Book ID: {selectedBook.id}</div>
                      <div>File Type: {selectedBook.pdf_file?.type || 'unknown'}</div>
                      <div>File Size: {selectedBook.pdf_file?.size ? `${(selectedBook.pdf_file.size / 1024 / 1024).toFixed(2)}MB` : 'unknown'}</div>
                      <div>Is Local File: {selectedBook.id === 'local-temp'}</div>
                      <div>Loading State: {pdfLoading ? 'Loading' : 'Not Loading'}</div>
                      <div>Has Error: {pdfError ? 'Yes' : 'No'}</div>
                    </div>
                    <button
                      onClick={() => {
                        console.log('Manual PDF Debug Info:', {
                          selectedBook,
                          pdfjsWorker: pdfjs.GlobalWorkerOptions.workerSrc,
                          pdfjsVersion: pdfjs.version,
                          pdfLoading,
                          pdfError
                        });
                        alert('Debug info logged to console');
                      }}
                      className="mt-2 bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                    >
                      Log to Console
                    </button>
                  </div>
                )}
                <div className="flex justify-center mb-4">

                  <button
                    onClick={previousPage}
                    disabled={pageNumber <= 1}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded mr-2 disabled:opacity-50"
                  >
                    {t('digitalBookshelf.previous')}
                  </button>


                  <span className="px-4 py-2">
                    {t('digitalBookshelf.pageIndicator', { current: pageNumber, total: numPages || 0 })}
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
                  {pdfLoading && (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                      <p className="text-gray-600">Loading PDF...</p>
                    </div>
                  )}

                  {pdfError && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="text-red-500 mb-4">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <p className="text-red-600 font-medium mb-2">Failed to load PDF</p>
                      <p className="text-gray-600 text-sm max-w-md">{pdfError}</p>
                      <button
                        onClick={() => {
                          setPdfLoading(true);
                          setPdfError(null);
                          // Force re-render by updating page number
                          setPageNumber(1);
                        }}
                        className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  )}

                  {!pdfLoading && !pdfError && (
                    <Document
                      file={getPdfFile(selectedBook)}
                      onLoadSuccess={onDocumentLoadSuccess}
                      onLoadError={onDocumentLoadError}
                      className="border"
                    >
                      <Page pageNumber={pageNumber} />
                    </Document>
                  )}
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
