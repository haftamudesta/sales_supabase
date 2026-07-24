import { useActionState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../supabase-client";

const initialState = {
  error: null,
};

async function signIn(_, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  return {
    error: null,
  };
}

export default function SignIn() {
  const navigate = useNavigate();

  const [state, action, pending] = useActionState(
    async (previousState, formData) => {
      const result = await signIn(previousState, formData);

      if (!result.error) {
        navigate("/dashboard");
      }

      return result;
    },
    initialState,
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-900 via-indigo-900 to-purple-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-8 w-8 text-white"
            >
              <path d="M12 2.25l2.757 5.587 6.168.896-4.463 4.35 1.054 6.143L12 16.326l-5.516 2.9 1.054-6.143-4.463-4.35 6.168-.896L12 2.25z" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>

          <p className="mt-2 text-slate-300">
            Sign in to access your Sales Dashboard
          </p>
        </div>

        <form action={action} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Email
            </label>

            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              className="w-full rounded-lg border border-slate-500 bg-white/10 px-4 py-3 text-white placeholder-slate-400 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Password
            </label>

            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              className="w-full rounded-lg border border-slate-500 bg-white/10 px-4 py-3 text-white placeholder-slate-400 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {state.error && (
            <div className="rounded-lg border border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-emerald-500 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-300">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-emerald-400 transition hover:text-emerald-300"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
