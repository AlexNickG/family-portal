// pages/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import ContactCard from '../components/ContactCard';
import ContactModal from '../components/ContactModal';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';

export default function Home() {
  const [contacts, setContacts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedContact, setSelectedContact] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Загрузка категорий
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/contacts?getCategories=true');
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Загрузка контактов
  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          pageSize: '24',
          search: searchQuery,
          category: selectedCategory
        });
        
        const response = await fetch(`/api/contacts?${params}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch contacts');
        }
        
        const data = await response.json();
        
        setContacts(data.records || []);
        setTotalPages(data.totalPages || 1);
        setTotalRecords(data.totalRecords || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [currentPage, searchQuery, selectedCategory]);

  // Обработчик открытия модального окна
  const handleCardClick = async (contactId) => {
    try {
      const response = await fetch(`/api/contacts/${contactId}`);
      const data = await response.json();
      setSelectedContact(data);
      setModalOpen(true);
    } catch (err) {
      console.error('Failed to load contact details:', err);
    }
  };

  // Обработчик поиска
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Сброс на первую страницу
  };

  // Обработчик фильтра
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Сброс на первую страницу
  };

  // Обработчик смены страницы
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>Family Portal - Contacts Directory</title>
        <meta name="description" content="Family contacts directory" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-semibold text-gray-900">Family Portal</h1>
            <p className="mt-1 text-sm text-gray-600">
              {totalRecords} {totalRecords === 1 ? 'contact' : 'contacts'}
            </p>
          </div>
        </header>

        {/* Search and Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-4">
            <SearchBar onSearch={handleSearch} />
            <FilterBar 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-600">Loading contacts...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">Error: {error}</p>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No contacts found</p>
            </div>
          ) : (
            <>
              {/* Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {contacts.map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    onClick={() => handleCardClick(contact.id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal */}
        {modalOpen && selectedContact && (
          <ContactModal
            contact={selectedContact}
            onClose={() => {
              setModalOpen(false);
              setSelectedContact(null);
            }}
          />
        )}
      </main>
    </>
  );
}