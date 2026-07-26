import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignOut() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    const result = await signOut();

    if (result.success) {
      navigate("/", { replace: true });
    }
  }

  return (
    <button
      onClick={handleSignOut}
      className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600"
    >
      Sign Out
    </button>
  );
}
