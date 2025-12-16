
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import PageHeader from '../components/layout/PageHeader';
import Footer from '../components/layout/Footer';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const DigitalBookshelf = () => {
  const { t } = useLanguage();
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    fetch('/data/books.json')
      .then(response => response.json())
      .then(data => setBooks(data))
      .catch(error => console.error('Error fetching books:', error));
  }, []);

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

      {/* Books Grid */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => openModal(book)}
              >
                <img
                  src={book.cover}
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
                    src={selectedBook.cover}
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
                    file={selectedBook.pdf}
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
