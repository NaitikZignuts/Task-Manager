import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { setUser, setLoading, setError } from '../features/auth/authSlice';
import { getUserProfile } from '../features/auth/authService';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userProfile = await getUserProfile(firebaseUser.uid);
          dispatch(setUser(userProfile));
        } else {
          dispatch(setUser(null));
        }
      } catch (err) {
        dispatch(setError(err.message));
      } finally {
        // Always set loading to false after auth state is determined
        dispatch(setLoading(false));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const logout = async () => {
    try {
      await signOut(auth);
      dispatch(setUser(null));
    } catch (err) {
      dispatch(setError(err.message));
      throw err;
    }
  };

  return { user, loading, error, logout };
};

export default useAuth;