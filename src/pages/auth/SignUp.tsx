import { SignUpForm } from "@/components/auth/SignUpForm";
import { useAuthContext } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function SignUp() {
  const { user } = useAuthContext();

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="legal-gradient-text">Law</span>
            <span className="text-primary">Bit</span>
          </h1>
          <p className="text-muted-foreground">
            Create your account to get started
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
} 