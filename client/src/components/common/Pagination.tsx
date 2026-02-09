
import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, disabled }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '1rem', gap: '1rem' }}>
            <button
                className="btn btn-secondary btn-sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1 || disabled}
            >
                Previous
            </button>
            <span>Page {currentPage} of {totalPages || 1}</span>
            <button
                className="btn btn-secondary btn-sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || disabled}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
