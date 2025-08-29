import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const AuthListener = () => {
  const { isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // When Clerk finishes loading and user is signed out, send them to /auth
    if (isLoaded && !isSignedIn) {
      navigate('/auth');
    }
  }, [isLoaded, isSignedIn, navigate]);

  return null;
};

export default AuthListener;
