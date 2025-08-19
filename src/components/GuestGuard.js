import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

const GuestGuard = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        // Only redirect if we're sure about the auth state (not loading)
        if (!loading) {
            if (user) {
                // User is logged in, redirect to dashboard
                router.push('/dashboard/user');
            } else {
                // No user, allow access to guest routes (login, register, etc.)
                setShouldRender(true);
            }
        }
    }, [user, loading, router]);

    // Show loading until we have determined auth state
    if (loading || (user && !shouldRender)) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    // Only render children if no user is authenticated
    if (!user) {
        return children;
    }

    // This should rarely be reached due to the redirect
    return null;
};

export default GuestGuard;