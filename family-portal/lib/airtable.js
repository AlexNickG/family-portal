// lib/airtable.js
const Airtable = require('airtable');

console.log('Airtable config:', {
  hasApiKey: !!process.env.AIRTABLE_API_KEY,
  baseId: process.env.AIRTABLE_BASE_ID,
  tableName: process.env.AIRTABLE_TABLE_NAME
});

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

const tableName = process.env.AIRTABLE_TABLE_NAME || 'Relatives';

// Форматирование записи из Airtable
export const formatRecord = (record) => {
  const fields = record.fields;
  
  return {
    id: record.id,
    name: fields.Name || '',
    surname: fields.Surname || '',
    position: fields.Position || '',
    company: fields.Company || '',
    phone: fields.Phone || '',
    email: fields.Email || '',
    linkedin: fields.LinkedIn || '',
    facebook: fields.Facebook || '',
    instagram: fields.Instagram || '',
    twitter: fields.Twitter || '',
    telegram: fields.Telegram || '',
    category: fields.Category || '',
    notes: fields.Notes || '',
    photos: fields.Photos ? fields.Photos.map(photo => ({
      id: photo.id,
      url: photo.url,
      thumbnails: photo.thumbnails
    })) : []
  };
};

// Получение списка контактов с пагинацией и фильтрацией
export const getContacts = async ({ page = 1, pageSize = 24, search = '', category = '' }) => {
  try {
    let filterFormula = '';
    
    // Построение формулы фильтрации
    const filters = [];
    
    if (search) {
      filters.push(`OR(
        SEARCH(LOWER("${search}"), LOWER({Name})),
        SEARCH(LOWER("${search}"), LOWER({Surname})),
        SEARCH(LOWER("${search}"), LOWER({Company})),
        SEARCH(LOWER("${search}"), LOWER({Notes})),
        SEARCH(LOWER("${search}"), LOWER({Category}))
      )`);
    }
    
    if (category) {
      filters.push(`SEARCH(LOWER("${category}"), LOWER({Category}))`);
    }
    
    if (filters.length > 0) {
      filterFormula = filters.length > 1 ? `AND(${filters.join(',')})` : filters[0];
    }

    const records = await base(tableName)
      .select({
        filterByFormula: filterFormula,
        sort: [{ field: 'Name', direction: 'asc' }],
        pageSize: 100 // Загружаем больше для обработки на сервере
      })
      .all();

    const formattedRecords = records.map(formatRecord);
    
    // Пагинация на стороне сервера
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedRecords = formattedRecords.slice(startIndex, endIndex);
    
    return {
      records: paginatedRecords,
      totalRecords: formattedRecords.length,
      currentPage: page,
      totalPages: Math.ceil(formattedRecords.length / pageSize),
      pageSize
    };
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw new Error('Failed to fetch contacts from Airtable');
  }
};

// Получение одного контакта по ID
export const getContactById = async (id) => {
  try {
    const record = await base(tableName).find(id);
    return formatRecord(record);
  } catch (error) {
    console.error('Error fetching contact:', error);
    throw new Error('Failed to fetch contact from Airtable');
  }
};

// Получение всех уникальных категорий
export const getCategories = async () => {
  try {
    const records = await base(tableName)
      .select({
        fields: ['Category']
      })
      .all();

    const categoriesSet = new Set();
    
    records.forEach(record => {
      const category = record.fields.Category;
      if (category) {
        // Разделяем по запятой если несколько категорий
        category.split(',').forEach(cat => {
          const trimmed = cat.trim();
          if (trimmed) categoriesSet.add(trimmed);
        });
      }
    });

    return Array.from(categoriesSet).sort();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories from Airtable');
  }
};

export default base;