import { useState } from 'react';

// Hook phát hiện click bên ngoài phần tử
export const useClickOutside = (handler) => {
    const ref = useRef();

    useEffect(() => {
        // Hàm xử lý sự kiện click bên ngoài
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                handler();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handler]);

    return ref;
};

// Hook trì hoãn giá trị để tối ưu hiệu suất
export const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};
