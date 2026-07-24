import { useActionState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const initialState = {
  error: null,
  success: false,
};

export default function SignUp() {
  const { signUp } = useAuth();

  const [state, action, pending] = useActionState(async (_, formData) => {
    const email = formData.get("email");
    const password = formData.get("password");

    const result = await signUp(email, password);

    return {
      success: result.success,
      error: result.error ?? null,
    };
  }, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-900 via-indigo-900 to-purple-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>

          <p className="mt-2 text-slate-300">Join the Sales Dashboard</p>
        </div>

        <form action={action} className="space-y-5">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-lg border border-slate-500 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            minLength={6}
            className="w-full rounded-lg border border-slate-500 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none"
          />

          {state.error && (
            <p className="rounded-lg bg-red-500/20 p-3 text-red-300">
              {state.error}
            </p>
          )}

          {state.success && (
            <p className="rounded-lg bg-emerald-500/20 p-3 text-emerald-300">
              Account created successfully. Check your email to verify your
              account if email confirmation is enabled.
            </p>
          )}

          <button
            disabled={pending}
            className="w-full rounded-lg bg-emerald-500 py-3 font-semibold text-white hover:bg-emerald-600"
          >
            {pending ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-300">
          Already have an account?{" "}
          <Link
            to="/"
            className="font-semibold text-emerald-400 hover:text-emerald-300"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
