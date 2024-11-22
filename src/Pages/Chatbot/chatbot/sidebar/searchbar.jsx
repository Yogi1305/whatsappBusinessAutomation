import React from 'react';


const SearchBar = ({ searchText, setSearchText }) => {
  return (
    <div className="p-4 border-b">
      <div className="relative">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search contacts..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <SearchIcon className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
};

export default SearchBar;