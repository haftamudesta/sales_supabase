import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    const result = await signOut();

    if (result.success) {
      navigate("/", { replace: true });
    }
  }

  return (
    <header className="mb-6 flex items-center justify-between bg-linear-to-r from-slate-900 via-indigo-900 to-blue-900 px-6 py-4 shadow-lg">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="#22c55e"
        >
          <path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.47L12 17.34l-5.8 3.05 1.11-6.47-4.7-4.58 6.49-.94L12 2.5z" />
        </svg>

        <div>
          <h1 className="text-3xl font-bold text-white">
            Sales Team Dashboard
          </h1>

          {user && (
            <p className="text-sm text-slate-300">
              Welcome,{" "}
              <span className="font-semibold text-emerald-400">
                {user.email}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Right Side */}
      {user && (
        <button
          onClick={handleSignOut}
          className="rounded-lg bg-red-500 px-5 py-2 font-semibold text-white transition hover:bg-red-600"
        >
          Sign Out
        </button>
      )}
    </header>
  );
}
