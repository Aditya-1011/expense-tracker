import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Auth = () => {
  const { isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();

  // If user is signed in, redirect to home immediately
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate("/");
    }
  }, [isLoaded, isSignedIn, navigate]);

  return (
    <div className="sign-in-container">
      <SignedOut>
        <SignUpButton mode="modal" />
        <SignInButton mode="modal" />
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
};

export default Auth;
