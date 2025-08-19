"use client"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from '../components/Loading';
import useAuth from '@/hooks/useAuth';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard/user');
      } else {

        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return <Loading />;
}