import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Library = () => {
  const { t } = useLanguage();
  const [selectedBook, setSelectedBook] = useState(null);
  const [customFile, setCustomFile] = useState(null);

  // Sample data - in a real app this would come from an API
  const sampleBooks = [
    {
      id: 1,
      title: "The Holy Quran",
      author: "Allah (SWT)",
      cover: "https://via.placeholder.com/150x220?text=Quran",
      description: "The central religious text of Islam."
    },
    {
      id: 2,
      title: "Sahih Al-Bukhari",
      author: "Imam Bukhari",
      cover: "https://via.placeholder.com/150x220?text=Bukhari",
      description: "One of the most authentic collections of Hadith."
    },
    {
      id: 3,
      title: "Riyad as-Salihin",
      author: "Imam An-Nawawi",
      cover: "https://via.placeholder.com/150x220?text=Riyad",
      description: "The Gardens of the Righteous."
    },
    {
      id: 4,
      title: "Fortress of the Muslim",
      author: "Said bin Ali bin Wahf Al-Qahtani",
      cover: "https://via.placeholder.com/150x220?text=Hisnul+Muslim",
      description: "Invocations from the Quran and Sunnah."
    }
  ];

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setCustomFile(fileUrl);
      setSelectedBook({
        id: 'custom',
        title: file.name,
        author: 'You',
        isCustom: true,
        fileUrl: fileUrl
      });
    }
  };

  const closeReader = () => {
    setSelectedBook(null);
  };

  return (
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
                {t('digitalBookshelf.selectFile')}
              </label>
              <p className="mt-2 text-sm text-gray-500">
                {customFile ? t('digitalBookshelf.readNow') : t('digitalBookshelf.noFileSelected')}
              </p>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {sampleBooks.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <div className="h-64 bg-gray-200 relative group cursor-pointer" onClick={() => setSelectedBook(book)}>
                <img 
                  src={book.cover} 
                  alt={book.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 text-white font-bold px-4 py-2 border-2 border-white rounded">
                    {t('digitalBookshelf.readBook')}
                  </span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{book.title}</h3>
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
          ))}
        </div>

        {/* Reader Modal */}
        {selectedBook && (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeReader}></div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full h-[80vh] flex flex-col">
                <div className="bg-white px-4 py-3 border-b flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {selectedBook.title}
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none text-2xl font-bold"
                    onClick={closeReader}
                  >
                    {t('digitalBookshelf.closeModal')}
                  </button>
                </div>
                
                <div className="flex-1 bg-gray-100 p-4 overflow-auto flex items-center justify-center">
                  {selectedBook.isCustom ? (
                    <iframe src={selectedBook.fileUrl} className="w-full h-full rounded shadow" title={selectedBook.title}></iframe>
                  ) : (
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">PDF Viewer</h3>
                      <p className="mt-1 text-sm text-gray-500">In a real application, this would render the PDF content.</p>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between items-center">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:text-sm"
                    disabled
                  >
                    {t('digitalBookshelf.previous')}
                  </button>
                  <span className="text-sm text-gray-500">
                    {t('digitalBookshelf.pageIndicator').replace('{current}', '1').replace('{total}', '10')}
                  </span>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:text-sm"
                    disabled
                  >
                    {t('digitalBookshelf.next')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
