export function Header() {
  return (
    <header
      className="bg-linear-to-r from-slate-900 via-indigo-900 to-blue-900"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "16px 24px",
        borderBottom: "1px solid #e5e7eb",
        marginBottom: "24px",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="#22c55e"
      >
        <path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.47L12 17.34l-5.8 3.05 1.11-6.47-4.7-4.58 6.49-.94L12 2.5z" />
      </svg>

      <h1
        style={{
          margin: 0,
          fontSize: "2rem",
          fontWeight: 700,
          color: "#fff",
        }}
      >
        Sales Team Dashboard
      </h1>
    </header>
  );
}
