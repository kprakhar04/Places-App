import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const activeHttpRequests = useRef([]);

    const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setIsLoading(true);
        const httpAbortCtrll = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrll);

        try {
            const response = await fetch(url, {
                method,
                body,
                headers,
                signal: httpAbortCtrll.signal  //this is to handle if someone chnages the page in between data is still getting loaded from the server
            });
            const responseData = await response.json();

            activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl => reqCtrl !== httpAbortCtrll)

            if (!response.ok) {
                throw new Error(responseData.message);
            }
            setIsLoading(false);
            return responseData;

        } catch (err) {
            setIsLoading(false);
            setError(err.message);
            throw err;
        }

    }, []);

    const clearError = () => {
        setError(null);
    }

    useEffect(() => {
        //clean up function works like an unmount 
        return () => {
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
        }
    }, [])

    return {
        isLoading,
        error,
        sendRequest,
        clearError
    };
}