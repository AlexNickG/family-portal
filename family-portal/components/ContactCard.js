// components/ContactCard.js
import { User } from 'lucide-react';

export default function ContactCard({ contact, onClick }) {
  const fullName = `${contact.name} ${contact.surname}`.trim();
  const photoUrl = contact.photos && contact.photos.length > 0 
    ? contact.photos[0].thumbnails?.large?.url || contact.photos[0].url 
    : null;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden border border-gray-200"
    >
      {/* Photo */}
      <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={fullName}
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-20 h-20 text-gray-400" />
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg truncate">
          {fullName || 'No name'}
        </h3>
        
        {contact.position && (
          <p className="text-sm text-gray-600 mt-1 truncate">
            {contact.position}
          </p>
        )}
        
        {contact.company && (
          <p className="text-sm text-gray-500 mt-0.5 truncate">
            {contact.company}
          </p>
        )}

        {contact.category && (
          <div className="mt-3 flex flex-wrap gap-1">
            {contact.category.split(',').slice(0, 2).map((cat, idx) => (
              <span
                key={idx}
                className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded"
              >
                {cat.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}