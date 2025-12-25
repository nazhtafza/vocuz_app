import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient"; 
import type { Session } from "@supabase/supabase-js";
import { Link } from "react-router-dom";

export function Login() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Cek session saat ini
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listener perubahan auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error signing out:", error.message);
  };

  const signUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin, // Redirect kembali ke halaman asal setelah login
      },
    });
    if (error) {
        console.error("Error signing in:", error.message);
        setLoading(false);
    }
  };

// tampilan if login
  if (session) {
    return (
      <div className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">vocuz.</h1>
          <div className="p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
            <h2 className="text-xl font-medium mb-2">Welcome back!</h2>
            <p className="text-gray-400 mb-8 text-sm">{session?.user?.email}</p>
            <button
              onClick={signOut}
              className="w-full bg-white text-black font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

// tampilan halaman login
  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
            backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(to right, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
        }}
      />

      {/* Main kontener*/}
      <div className="relative z-10 flex flex-col items-center gap-10 animate-in fade-in zoom-in duration-500">
        
        {/* 1. Logo */}
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          <Link to={"/"}>vocuz.</Link>
        </h1>

        <button
          onClick={signUp}
          disabled={loading}
          className="group flex items-center justify-center gap-3 bg-white text-black px-12 py-3 rounded-lg font-medium text-sm md:text-base hover:bg-gray-100 transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed min-w-75">
          {loading ? (
            // circular loading
            <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            // Google Icon SVG
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"/>
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"/>
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                fill="#FBBC05"/>
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"/>
            </svg>
          )}
          <span>{loading ? "Connecting..." : "Sign In with Google"}</span>
        </button>

        {/* 3. Footer Text / Terms */}
        <p className="text-gray-400 text-[10px] md:text-xs max-w-xs text-center leading-relaxed">
          By continuing, you agree to our{" "}
          <a href="#" className="underline hover:text-white transition-colors">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-white transition-colors">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;