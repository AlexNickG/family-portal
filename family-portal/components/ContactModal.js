// components/ContactModal.js
import { X, Mail, Phone, Linkedin, Facebook, Instagram, Twitter, Send, User } from 'lucide-react';
import { useEffect } from 'react';
import PhotoGallery from './PhotoGallery';

export default function ContactModal({ contact, onClose }) {
  const fullName = `${contact.name} ${contact.surname}`.trim();

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Блокировка прокрутки фона
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const socialLinks = [
    { icon: Linkedin, url: contact.linkedin, label: 'LinkedIn', color: 'text-blue-600' },
    { icon: Facebook, url: contact.facebook, label: 'Facebook', color: 'text-blue-700' },
    { icon: Instagram, url: contact.instagram, label: 'Instagram', color: 'text-pink-600' },
    { icon: Twitter, url: contact.twitter, label: 'Twitter', color: 'text-sky-500' },
    { icon: Send, url: contact.telegram, label: 'Telegram', color: 'text-blue-500' },
  ].filter(social => social.url);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>

          <div className="p-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              {/* Main Photo or Icon */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  {contact.photos && contact.photos.length > 0 ? (
                    <img
                      src={contact.photos[0].thumbnails?.large?.url || contact.photos[0].url}
                      alt={fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {fullName}
                </h2>
                
                {contact.position && (
                  <p className="text-lg text-gray-700 mb-1">{contact.position}</p>
                )}
                
                {contact.company && (
                  <p className="text-lg text-gray-600 mb-3">{contact.company}</p>
                )}

                {contact.category && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {contact.category.split(',').map((cat, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-full"
                      >
                        {cat.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4 mb-6">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <Mail className="w-5 h-5 text-gray-500" />
                  <span>{contact.email}</span>
                </a>
              )}

              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span>{contact.phone}</span>
                </a>
              )}
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Social Media</h3>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors ${social.color}`}
                    >
                      <social.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{social.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {contact.notes && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Notes</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{contact.notes}</p>
              </div>
            )}

            {/* Photo Gallery */}
            {contact.photos && contact.photos.length > 1 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Photos</h3>
                <PhotoGallery photos={contact.photos} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}