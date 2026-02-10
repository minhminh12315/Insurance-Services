
import React from 'react';
import Swal from 'sweetalert2';

interface DeleteButtonProps {
    onConfirm: () => Promise<void> | void;
    title?: string;
    text?: string;
    confirmButtonText?: string;
    className?: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
    onConfirm,
    title = 'Are you sure?',
    text = "You won't be able to revert this!",
    confirmButtonText = 'Yes, delete it!',
    className = "btn btn-danger btn-sm"
}) => {
    const handleClick = () => {
        Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444', // Tailored to match danger color
            cancelButtonColor: '#64748b',
            confirmButtonText: confirmButtonText
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await onConfirm();
                    Swal.fire(
                        'Deleted!',
                        'The item has been deleted.',
                        'success'
                    );
                } catch (error) {
                    console.error(error);
                    Swal.fire(
                        'Error!',
                        'Failed to delete the item.',
                        'error'
                    );
                }
            }
        });
    };

    return (
        <button className={className} onClick={handleClick} title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
        </button>
    );
};

export default DeleteButton;
