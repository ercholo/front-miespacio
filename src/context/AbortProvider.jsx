import { useState, useCallback } from 'react';
import {AbortContext} from './AbortContext';
import PropTypes from 'prop-types';

export const AbortProvider = ({ children }) => {


    const [abortController, setAbortController] = useState(null);

    const createAbortController = useCallback(() => {

        const newAbortController = new AbortController();
        setAbortController(newAbortController);
        return newAbortController;
        
    }, []);

    const clearAbortController = useCallback(() => {
        setAbortController(null);
    }, []);

    return (
        <AbortContext.Provider value={{ abortController, createAbortController, clearAbortController }}>
            {children}
        </AbortContext.Provider>
    );
};

AbortProvider.propTypes = {
    children: PropTypes.node,
}
