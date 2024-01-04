import { useEffect, useRef } from 'react';

export default function useTimeout(callback, delay) {

    const timeoutRef = useRef(null);
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const tick = () => savedCallback.current();
        if (typeof delay === 'number' ) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(tick, delay);
            return () => clearTimeout(timeoutRef.current);
        } else {
            clearTimeout(timeoutRef.current);
        }
    }, [delay]);
    return timeoutRef;
}