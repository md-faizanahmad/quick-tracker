import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
function App() {
  const [status, setStatus] = useState<string>("checking...");

  useEffect(() => {
    fetch("https://offline-expense-tracker-backend.vercel.app/health")
      .then((res) => res.json())
      .then(() => setStatus("Backend connected"))
      .catch(() => setStatus("Backend not reachable"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-xl font-bold">Offline Expense Tracker</h1>
      <Plus size={18} />
      <p className="text-sm text-gray-600">Frontend structure ready {status}</p>
    </div>
  );
}

export default App;
