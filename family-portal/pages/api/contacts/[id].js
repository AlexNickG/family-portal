// pages/api/contacts/[id].js
import { getContactById } from '../../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Contact ID is required' });
  }

  try {
    const contact = await getContactById(id);
    res.status(200).json(contact);
  } catch (error) {
    console.error('API Error:', error);
    res.status(404).json({ error: 'Contact not found' });
  }
}