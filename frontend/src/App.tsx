import { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState<string>("checking...");

  useEffect(() => {
    fetch("https://offline-expense-tracker-backend.vercel.app/health")
      .then((res) => res.json())
      .then(() => setStatus("Backend connected"))
      .catch(() => setStatus("Backend not reachable"));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Offline Expense Tracker</h1>
      <p>{status}</p>
    </div>
  );
}

export default App;
