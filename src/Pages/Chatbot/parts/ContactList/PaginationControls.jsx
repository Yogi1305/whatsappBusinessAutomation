import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  const handleInputChange = (e) => {
    const page = parseInt(e.target.value);
    if (!isNaN(page)) onPageChange(page);
  };

  return (
    <div className="pagination-controls">
      <button 
        className="pagination-button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={18} />
      </button>
      
      <div className="page-input-container">
        <input
          type="number"
          value={currentPage}
          onChange={handleInputChange}
          min="1"
          max={totalPages}
          className="page-input"
        />
        <span className="total-pages">of {totalPages}</span>
      </div>
      
      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default React.memo(PaginationControls);