import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from './Loading';
import useAuth from '@/hooks/useAuth';

const PrivateRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (roles.length > 0 && !roles.includes(user.role)) {
        router.push('/dashboard/user');
      }
    }
  }, [user, loading, roles, router]);

  if (loading || !user || (roles.length > 0 && !roles.includes(user.role))) {
    return <Loading />;
  }

  return children;
};

export default PrivateRoute;