import React, { useState, useRef, TouchEvent } from 'react';
import { Trash2 } from 'lucide-react';

interface SwipeableRowProps {
    children: React.ReactNode;
    onDelete: () => void;
    className?: string; // used for outer borders etc
    innerClassName?: string; // used for padding inside the draggable div
}

export function SwipeableRow({ children, onDelete, className = '', innerClassName = '' }: SwipeableRowProps) {
    const [offset, setOffset] = useState(0);
    const startX = useRef<number | null>(null);
    const startY = useRef<number | null>(null);
    const isSwiping = useRef(false);
    
    const actionThreshold = -80; // distance to trigger delete

    const handleTouchStart = (e: TouchEvent) => {
        startX.current = e.touches[0].clientX;
        startY.current = e.touches[0].clientY;
        isSwiping.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (startX.current === null || startY.current === null) return;
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        
        const diffX = currentX - startX.current;
        const diffY = currentY - startY.current;

        // If scrolling vertically more than horizontally, cancel swipe tracking
        if (!isSwiping.current && Math.abs(diffY) > Math.abs(diffX)) {
            startX.current = null;
            return;
        }

        isSwiping.current = true;

        if (diffX < 0) { // Only allow swiping left
            setOffset(Math.max(diffX, -100)); // limit max swipe visually
        } else {
             setOffset(0);
        }
    };

    const handleTouchEnd = () => {
        if (offset <= actionThreshold) {
            onDelete();
        }
        setOffset(0);
        startX.current = null;
        startY.current = null;
        isSwiping.current = false;
    };

    return (
        <div className={`relative overflow-hidden w-full ${className}`}>
            {/* Background Action Area (Delete) */}
            <div className="absolute inset-0 flex items-center justify-end px-6 bg-red-500/10">
                <Trash2 size={20} className="text-red-500" />
            </div>
            
            {/* Foreground Content */}
            <div 
                className={`relative bg-surface-deep w-full transition-transform duration-200 ${innerClassName}`}
                style={{ transform: `translateX(${offset}px)` }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {children}
            </div>
        </div>
    );
}
