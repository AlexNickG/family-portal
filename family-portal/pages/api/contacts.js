// pages/api/contacts.js
import { getContacts, getCategories } from '../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { page = '1', pageSize = '24', search = '', category = '', getCategories: fetchCategories } = req.query;

    // Если запрашиваются только категории
    if (fetchCategories === 'true') {
      const categories = await getCategories();
      return res.status(200).json({ categories });
    }

    // Получение контактов
    const result = await getContacts({
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      search: search.trim(),
      category: category.trim()
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
}