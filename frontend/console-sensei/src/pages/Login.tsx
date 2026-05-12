import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { supabase } from "../lib/supabase";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Access Your Workspace"
      subtitle="Sign in securely with your corporate Google account."
    >
      <div className="space-y-8 py-4">
        <div className="flex flex-col gap-4">
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex items-center justify-center gap-4 px-6 py-4 rounded-2xl border border-border hover:bg-brand-blue/[0.02] hover:border-brand-blue/50 transition-all font-bold text-lg glass group shadow-xl hover:shadow-brand-blue/10 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />
            ) : (
              <svg viewBox="0 0 24 24" className="w-6 h-6 transition-transform group-hover:scale-110" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            {loading ? "Connecting..." : "Continue with Google"}
          </button>
        </div>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-border/50"></div>
          <span className="flex-shrink-0 mx-4 text-foreground/20 text-[10px] font-black uppercase tracking-[0.2em]">Secure Single Sign-On</span>
          <div className="flex-grow border-t border-border/50"></div>
        </div>

        <p className="text-center text-xs text-foreground/40 font-medium">
          By continuing, you agree to our terms and privacy policy.
          <br />
          Access is restricted to authorized company members.
        </p>
      </div>
    </AuthLayout>
  );
}
