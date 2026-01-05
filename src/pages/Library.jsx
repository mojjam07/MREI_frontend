import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, X, Upload, Book, Loader2, AlertCircle, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import apiClient from '../services/apiClient';
import { API_ENDPOINTS } from '../config';
import PageHeader from '../components/layout/PageHeader';
import Footer from '../components/layout/Footer';

// Configure PDF.js worker for Vite - use CDN for reliability
// react-pdf 10.x bundles pdfjs-dist 4.x, use version matching installed pdfjs-dist@4.4.168
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.js`;

// Helper function to check if URL is a Google Drive PDF link
const isGoogleDrivePdf = (url) => {
  if (!url || typeof url !== 'string') return false;
  return url.includes('drive.google.com') && (
    url.includes('/file/d/') || 
    url.includes('?id=') ||
    url.includes('/open?id=')
  );
};

// Helper function to convert Google Drive URL to preview URL
const getGoogleDrivePreviewUrl = (url) => {
  if (!url) return '';
  // Handle /file/d/FILE_ID/view format
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
  }
  // Handle ?id=FILE_ID or open?id=FILE_ID format
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) {
    return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
  }
  return url;
};

// Helper function to generate book cover placeholder SVG data URL
const generateBookCoverUrl = (title, bgColor = '#4F46E5') => {
  // Truncate title if too long
  const displayTitle = title.length > 10 ? title.substring(0, 10) + '...' : title;
  const svg = `
    <svg width="150" height="220" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <rect x="10" y="10" width="130" height="200" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
      <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" 
            fill="#FFFFFF" font-family="Georgia, serif" font-size="14" font-weight="bold">
        ${encodeURIComponent(displayTitle)}
      </text>
      <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" 
            fill="rgba(255,255,255,0.8)" font-family="Arial, sans-serif" font-size="10">
        Islamic Book
      </text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

// Static fallback data with inline SVG placeholders
const staticBooks = [
  {
    id: 1,
    title: "The Holy Quran",
    author: "Allah (SWT)",
    cover_url: generateBookCoverUrl("Quran", "#166534"),
    description: "The central religious text of Islam.",
    pdf_url: null
  },
  {
    id: 2,
    title: "Sahih Al-Bukhari",
    author: "Imam Bukhari",
    cover_url: generateBookCoverUrl("Bukhari", "#7C3AED"),
    description: "One of the most authentic collections of Hadith.",
    pdf_url: null
  },
  {
    id: 3,
    title: "Riyad as-Salihin",
    author: "Imam An-Nawawi",
    cover_url: generateBookCoverUrl("Riyad", "#0891B2"),
    description: "The Gardens of the Righteous.",
    pdf_url: null
  },
  {
    id: 4,
    title: "Fortress of the Muslim",
    author: "Said bin Ali bin Wahf Al-Qahtani",
    cover_url: generateBookCoverUrl("Hisnul", "#EA580C"),
    description: "Invocations from the Quran and Sunnah.",
    pdf_url: null
  }
];

const Library = () => {
  const { t } = useLanguage();
  const [books, setBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [customFile, setCustomFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  // Zoom functions
  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3.0));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setScale(1.0);
  };

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setBooksLoading(true);
        const response = await apiClient.get(API_ENDPOINTS.LIBRARY.BOOKS);
        // API returns { success: true, data: { books: [...], pagination: {...} } }
        // We need to extract the books array from the response
        setBooks(response.data?.data?.books || response.data || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch books:', err);
        const message = err.response?.data?.detail || err.message || 'Failed to load books';
        setError(message);
        // Fallback to static data
        setBooks(staticBooks);
      } finally {
        setBooksLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (customFile) {
        URL.revokeObjectURL(customFile);
      }
    };
  }, [customFile]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.includes('pdf')) {
        alert('Please select a PDF file only.');
        return;
      }

      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB.');
        return;
      }

      try {
        // Cleanup previous file URL if exists
        if (customFile) {
          URL.revokeObjectURL(customFile);
        }

        const fileUrl = URL.createObjectURL(file);
        setCustomFile(fileUrl);
        setSelectedBook({
          id: 'custom',
          title: file.name,
          author: 'You',
          isCustom: true,
          pdf_url: fileUrl
        });
        setPageNumber(1);
        setError(null);
      } catch (err) {
        console.error('Error processing file:', err);
        setError('Failed to process the selected file. Please try again.');
      }
    }
  };

  const closeReader = () => {
    setSelectedBook(null);
    setPageNumber(1);
    setNumPages(null);
    setScale(1.0);
  };

  return (
    <>
      <PageHeader />
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            {t('digitalBookshelf.title')}
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            {t('digitalBookshelf.subtitle')}
          </p>
        </div>

        {/* Error message display */}
        {error && (
          <div className="mb-12 rounded-lg border border-yellow-200 bg-yellow-100 p-4 text-center text-yellow-800">
            <div className="flex items-center justify-center">
              <AlertCircle className="mr-3 h-5 w-5" />
              <div>
                <h3 className="font-semibold">Could not connect to the library.</h3>
                <p className="text-sm">{error}. Showing available offline books.</p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12 text-center">
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('digitalBookshelf.uploadTitle')}</h2>
            <p className="text-gray-600 mb-6">{t('digitalBookshelf.uploadSubtitle')}</p>
            
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors">
              <input
                type="file"
                id="pdf-upload"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="pdf-upload"
                className="cursor-pointer inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Upload className="w-5 h-5 mr-2" />
                {t('digitalBookshelf.selectFile')}
              </label>
              <p className="mt-2 text-sm text-gray-500">
                {customFile ? t('digitalBookshelf.readNow') : t('digitalBookshelf.noFileSelected')}
              </p>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {booksLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          </div>) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {books && books.length > 0 ? (
              books.map((book) => (
                <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
                  <div className="h-64 bg-gray-200 relative group cursor-pointer" onClick={() => setSelectedBook(book)}>
                    {book.cover_url ? (
                      <img 
                        src={book.cover_url} 
                        alt={book.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/images/placeholder-book.svg';
                        }}
                      />
                    ) : (
                      <img 
                        src="/images/placeholder-book.svg" 
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 text-white font-bold px-4 py-2 border-2 border-white rounded">
                        {t('digitalBookshelf.readBook')}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-semibold">{t('digitalBookshelf.author')}</span> {book.author}
                    </p>
                    <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">{book.description}</p>
                    <button
                      onClick={() => setSelectedBook(book)}
                      className="w-full mt-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
                    >
                      {t('digitalBookshelf.readBook')}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                <Book className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No books available in the library yet.</p>
              </div>
            )}
            </div>
        )}

        {/* Reader Modal */}
        {selectedBook && (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeReader}></div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full h-[85vh] flex flex-col">
                <div className="bg-white px-4 py-3 border-b flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {selectedBook.title}
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={closeReader}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="flex-1 bg-gray-100 p-4 overflow-auto flex justify-center">
                  {selectedBook.pdf_url ? (
                    isGoogleDrivePdf(selectedBook.pdf_url) ? (
                      // Render Google Drive PDFs using iframe with preview URL
                      <iframe
                        src={getGoogleDrivePreviewUrl(selectedBook.pdf_url)}
                        className="w-full h-full min-h-[600px] border-0"
                        title={selectedBook.title}
                        allow="autoplay; fullscreen"
                        allowFullScreen
                      />
                    ) : (
                      // Render regular PDFs using react-pdf
                      <Document
                        file={selectedBook.pdf_url}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={(error) => {
                          console.error('PDF load error:', error);
                          setError('Failed to load PDF file. Please try again.');
                        }}
                        loading={
                          <div className="flex items-center justify-center h-64">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                            <span className="ml-2 text-gray-600">Loading PDF...</span>
                          </div>
                        }
                        error={
                          <div className="flex flex-col items-center justify-center h-64 text-red-500">
                            <AlertCircle className="w-8 h-8 mb-2" />
                            <p>Failed to load PDF file.</p>
                            <button 
                              onClick={() => setError(null)}
                              className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                            >
                              Try Again
                            </button>
                          </div>
                        }
                      >
                        <Page 
                          pageNumber={pageNumber} 
                          renderTextLayer={true}
                          renderAnnotationLayer={true}
                          scale={scale}
                          className="shadow-lg"
                          width={Math.min(window.innerWidth * 0.8, 800 * scale)}
                          loading={
                            <div className="flex items-center justify-center h-64">
                              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                              <span className="ml-2 text-gray-600">Loading page...</span>
                            </div>
                          }
                        />
                      </Document>
                    )
                  ) : (
                    <div className="text-center flex flex-col items-center justify-center h-full">
                      <Book className="w-16 h-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">No PDF Available</h3>
                      <p className="text-gray-500">This book does not have a PDF file attached.</p>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 flex flex-wrap justify-between items-center border-t gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none disabled:opacity-50"
                      onClick={previousPage}
                      disabled={pageNumber <= 1}
                      title={t('digitalBookshelf.previous')}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
                      {t('digitalBookshelf.pageIndicator').replace('{current}', pageNumber).replace('{total}', numPages || '--')}
                    </span>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none disabled:opacity-50"
                      onClick={nextPage}
                      disabled={numPages && pageNumber >= numPages}
                      title={t('digitalBookshelf.next')}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Zoom Controls */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
                      {Math.round(scale * 100)}%
                    </span>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none disabled:opacity-50"
                      onClick={zoomOut}
                      disabled={scale <= 0.5}
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                      onClick={resetZoom}
                      title="Reset Zoom"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none disabled:opacity-50"
                      onClick={zoomIn}
                      disabled={scale >= 3.0}
                      title="Zoom In"
                    >
                      <ZoomIn className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
      <Footer />
    </>
  );
};

export default Library;
