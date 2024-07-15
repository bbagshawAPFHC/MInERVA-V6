import React, { useState } from 'react';

interface AdvancedSearchProps {
  onSearch: (params: any) => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    hospital: '',
    businessUnit: '',
    gender: '',
    zipCode: '',
    state: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hospital">
          Hospital
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="hospital"
          type="text"
          placeholder="Hospital"
          name="hospital"
          value={searchParams.hospital}
          onChange={handleInputChange}
        />
      </div>
      {/* Add more fields similar to the hospital input */}
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default AdvancedSearch;