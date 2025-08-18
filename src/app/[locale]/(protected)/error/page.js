'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ErrorPage() {
    const searchParams = useSearchParams();
    const [errorData, setErrorData] = useState(null);
    const [nextEndpoint, setNextEndpoint] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        try {
            // Read next parameter
            const next = searchParams.get('next');
            if (next) {
                setNextEndpoint(decodeURIComponent(next));
            }
            
            // Read and parse error data
            const errorParam = searchParams.get('error');
            if (errorParam) {
                const errorString = decodeURIComponent(errorParam);
                const parsedError = JSON.parse(errorString);
                setErrorData(parsedError);
            }
        } catch (error) {
            console.error('Failed to parse URL parameters:', error);
            setErrorData({
                status: 500,
                statusText: 'Parse Error',
                message: 'Failed to parse error information'
            });
        } finally {
            setLoading(false);
        }
    }, [searchParams]);
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }
    
    const handleRetry = () => {
        if (nextEndpoint) {
            // You could trigger a new API call here
            window.location.reload();
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-xl font-semibold text-red-600 mb-4">
                    API Request Failed
                </h1>
                
                {errorData && (
                    <div className="space-y-3 mb-6">
                        <div className="bg-red-50 p-3 rounded">
                            <p><strong>Status:</strong> {errorData.status}</p>
                            <p><strong>Error:</strong> {errorData.statusText}</p>
                            {errorData.url && (
                                <p><strong>URL:</strong> {errorData.url}</p>
                            )}
                        </div>
                        
                        {nextEndpoint && (
                            <div className="bg-blue-50 p-3 rounded">
                                <p><strong>Endpoint:</strong> {nextEndpoint}</p>
                            </div>
                        )}
                    </div>
                )}
                
                <div className="flex gap-2">
                    <button 
                        onClick={() => window.history.back()}
                        className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                    >
                        Go Back
                    </button>
                    
                    {nextEndpoint && (
                        <button 
                            onClick={handleRetry}
                            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        >
                            Retry
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}