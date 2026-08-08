import { useActionState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const initialState = {
  error: null,
  success: false,
};

export default function SignUp() {
  const navigate = useNavigate();

  const { signUp, session, loading } = useAuth();

  useEffect(() => {
    if (!loading && session) {
      navigate("/dashboard", { replace: true });
    }
  }, [session, loading, navigate]);

  const [state, action, pending] = useActionState(async (_, formData) => {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const accountType = formData.get("account-type");

    const result = await signUp(name, email, password, accountType);

    return {
      success: result.success,
      error: result.error ?? null,
    };
  }, initialState);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-900 via-indigo-900 to-purple-900">
        <p className="text-lg text-white">Loading...</p>
      </div>
    );
  }

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

          <h1 className="text-3xl font-bold text-white">Create Account</h1>

          <p className="mt-2 text-slate-300">Join the Sales Dashboard</p>
        </div>

        <form action={action} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Full Name
            </label>

            <input
              name="name"
              type="text"
              placeholder="Enter your full name"
              required
              autoComplete="name"
              className="w-full rounded-lg border border-slate-500 bg-white/10 px-4 py-3 text-white placeholder-slate-400 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Email
            </label>

            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              autoComplete="email"
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
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-lg border border-slate-500 bg-white/10 px-4 py-3 text-white placeholder-slate-400 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <fieldset className="rounded-lg border border-slate-500 bg-white/5 p-4">
            <legend className="px-2 text-sm font-medium text-slate-200">
              Select your role
            </legend>

            <div className="mt-2 flex items-center gap-4">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition hover:bg-white/10">
                <input
                  type="radio"
                  name="account-type"
                  value="admin"
                  required
                  className="h-4 w-4 accent-emerald-500"
                />

                <span className="text-slate-200">Admin</span>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition hover:bg-white/10">
                <input
                  type="radio"
                  name="account-type"
                  value="sales_rep"
                  className="h-4 w-4 accent-emerald-500"
                />

                <span className="text-slate-200">Sales Rep</span>
              </label>
            </div>
          </fieldset>

          {state.error && (
            <p className="rounded-lg bg-red-500/20 p-3 text-red-300">
              {state.error}
            </p>
          )}

          {state.success && (
            <p className="rounded-lg bg-emerald-500/20 p-3 text-emerald-300">
              Account created successfully.
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-emerald-500 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-300">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="font-semibold text-emerald-400 transition hover:text-emerald-300"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
