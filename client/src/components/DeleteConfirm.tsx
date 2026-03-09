import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface DeleteConfirmProps {
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    children: React.ReactElement; // The trigger button/icon
    className?: string;
}

const DeleteConfirm: React.FC<DeleteConfirmProps> = ({
    onConfirm,
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmLabel = 'Delete',
    cancelLabel = 'Cancel',
    children,
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    const updatePosition = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            // Default position: Above the trigger, centered
            setCoords({
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX + rect.width / 2,
            });
        }
    };

    const handleOpen = (e: React.MouseEvent) => {
        e.stopPropagation();
        updatePosition();
        setIsOpen(true);
    };

    const handleClose = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setIsOpen(false);
    };

    const handleConfirm = (e: React.MouseEvent) => {
        e.stopPropagation();
        onConfirm();
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            window.addEventListener('resize', updatePosition);
            window.addEventListener('scroll', updatePosition, true);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [isOpen]);

    const popoverContent = (
        <div
            ref={popoverRef}
            className="fixed z-[9999] pointer-events-auto animate-in fade-in zoom-in-95 duration-200"
            style={{
                top: `${coords.top - 12}px`, // Slight offset above
                left: `${coords.left}px`,
                transform: 'translate(-50%, -100%)', // Center horizontally, place above
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 min-w-[260px] max-w-[300px]">
                {/* Content */}
                <div className="mb-4">
                    <h4 className="text-slate-900 font-bold text-sm mb-1">{title}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{message}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={handleClose}
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 font-bold text-[11px] hover:bg-slate-50 transition-all uppercase tracking-wider"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 px-3 py-2 rounded-lg bg-red-500 text-white font-bold text-[11px] shadow-lg shadow-red-100 hover:bg-red-600 transition-all hover:-translate-y-0.5 uppercase tracking-wider"
                    >
                        {confirmLabel}
                    </button>
                </div>

                {/* Arrow */}
                <div
                    className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-slate-200 rotate-45 transform"
                />
            </div>
        </div>
    );

    return (
        <div ref={triggerRef} className={`inline-block ${className}`} onClick={handleOpen}>
            {children}
            {isOpen && createPortal(popoverContent, document.body)}
        </div>
    );
};

export default DeleteConfirm;
