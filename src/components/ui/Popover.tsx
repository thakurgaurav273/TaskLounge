import React, { useEffect, useRef } from 'react';

interface PopoverProps {
    x: number;
    y: number;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Popover: React.FC<PopoverProps> = ({ x, y, isOpen, onClose, children }) => {
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen || !popoverRef.current) return;

        const rect = popoverRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let adjustedX = x;
        let adjustedY = y + 8; 
        if (adjustedX + rect.width > viewportWidth) {
            adjustedX = viewportWidth - rect.width - 10;
        }

        if (adjustedY + rect.height > viewportHeight) {
            adjustedY = y - rect.height - 8;
        }

        if (adjustedX < 10) {
            adjustedX = 10;
        }

        if (adjustedY < 10) {
            adjustedY = 10;
        }

        popoverRef.current.style.left = `${adjustedX}px`;
        popoverRef.current.style.top = `${adjustedY}px`;
    }, [isOpen, x, y]);

    if (!isOpen) return null;

    return (
        <>
            <div 
                className="fixed inset-0 z-[40] h-[100vh] w-[100vw] top-[0] left-[0]"
                onClick={onClose}
            />
            
            <div 
                ref={popoverRef}
                className="fixed z-[50] p-[12px] bg-[white] border-[1px] border-[#e5e7eb] rounded-[8px] min-w-[200px]"
                style={{
                    top: `${y + 8}px`,
                    left: `${x}px`,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </>
    );
};

export default Popover;