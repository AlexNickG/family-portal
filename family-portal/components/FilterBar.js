// components/FilterBar.js
export default function FilterBar({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
        Filter:
      </span>
      
      <button
        onClick={() => onCategoryChange('')}
        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
          selectedCategory === ''
            ? 'bg-gray-900 text-white'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        All
      </button>

      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            selectedCategory === category
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}