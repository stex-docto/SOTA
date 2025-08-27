import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SignInProvider } from '@/domain';
import { SignInUseCase } from '@/application';

interface UseSignInProviderReturn {
    answerAllRequests: (answer: boolean) => void;
    hasPendingRequests: boolean;
}

export function useSignInProvider(signInUseCase: SignInUseCase): UseSignInProviderReturn {
    const [signInRequests, setSignInRequests] = useState<Array<(value: boolean) => void>>([]);
    const signInRequestsRef = useRef<Array<(value: boolean) => void>>([]);

    // Keep ref in sync with state
    useEffect(() => {
        signInRequestsRef.current = signInRequests;
    }, [signInRequests]);

    const signInProvider: SignInProvider = useMemo(
        () => ({
            async request(): Promise<boolean> {
                return new Promise(resolve => {
                    // Add this promise to the list of waiting requests
                    setSignInRequests(prev => [...prev, resolve]);
                });
            }
        }),
        []
    );

    const answerAllRequests = useCallback((answer: boolean) => {
        signInRequestsRef.current.forEach(resolve => resolve(answer));
        setSignInRequests([]);
    }, []);

    // Register with SignInUseCase
    useEffect(() => {
        signInUseCase.registerSignInProvider(signInProvider);

        return () => {
            answerAllRequests(false);
            signInUseCase.unregisterSignInProvider();
        };
    }, [signInUseCase, signInProvider, answerAllRequests]);

    return {
        answerAllRequests,
        hasPendingRequests: signInRequests.length > 0
    };
}
