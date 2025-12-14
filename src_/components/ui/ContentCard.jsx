import React from 'react';
import { Calendar, User, ExternalLink } from 'lucide-react';

const ContentCard = ({ content, onEdit, onDelete, showActions = false }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'news':
        return 'bg-blue-100 text-blue-800';
      case 'event':
        return 'bg-green-100 text-green-800';
      case 'testimonial':
        return 'bg-purple-100 text-purple-800';
      case 'campus_life':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderContent = () => {
    switch (content.type) {
      case 'news':
        return (
          <div>
            {content.title && <h3 className="font-semibold text-gray-800 mb-2">{content.title}</h3>}
            {content.content && <p className="text-sm text-gray-600 mb-2">{content.content}</p>}
            {content.image && (
              <img
                src={content.image}
                alt={content.title}
                className="w-full h-32 object-cover rounded-lg mb-2"
              />
            )}
          </div>
        );
      case 'event':
        return (
          <div>
            {content.title && <h3 className="font-semibold text-gray-800 mb-2">{content.title}</h3>}
            {content.content && <p className="text-sm text-gray-600 mb-2">{content.content}</p>}
            {content.event_date && (
              <p className="text-xs text-gray-500 mb-1">
                <Calendar className="w-3 h-3 inline mr-1" />
                {new Date(content.event_date).toLocaleDateString()}
              </p>
            )}
            {content.location && (
              <p className="text-xs text-gray-500">{content.location}</p>
            )}
          </div>
        );
      case 'testimonial':
        return (
          <div>
            <p className="text-sm text-gray-600 mb-2 italic">"{content.content}"</p>
            <div className="flex items-center space-x-2">
              {content.image && (
                <img
                  src={content.image}
                  alt={content.author}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <div>
                <p className="text-sm font-medium text-gray-800">{content.author}</p>
                <p className="text-xs text-gray-500">{content.author_title}</p>
              </div>
            </div>
          </div>
        );
      case 'campus_life':
        return (
          <div>
            {content.title && <h3 className="font-semibold text-gray-800 mb-2">{content.title}</h3>}
            {content.description && <p className="text-sm text-gray-600 mb-2">{content.description}</p>}
            {content.image && (
              <img
                src={content.image}
                alt={content.title}
                className="w-full h-32 object-cover rounded-lg"
              />
            )}
          </div>
        );
      default:
        return <p className="text-sm text-gray-600">{content.content}</p>;
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(content.type)}`}>
          {content.type.replace('_', ' ').toUpperCase()}
        </span>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>{new Date(content.created_at || content.updated_at).toLocaleDateString()}</span>
        </div>
      </div>

      {renderContent()}

      {showActions && (
        <div className="flex justify-end space-x-2 mt-3">
          {onEdit && (
            <button
              onClick={() => onEdit(content)}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(content)}
              className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentCard;
