import { useState } from "react";
import Card from "../components/Card";

const SettingsPage = () => {
  const [theme, setTheme] = useState("dark");

  return (
    <div className="space-y-6">
      <Card title="Settings" subtitle="Personalize Ethara for your team">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 transition hover:shadow-[0_4px_12px_rgba(37,99,235,0.1)]">
            <h3 className="text-lg font-bold text-slate-900">Theme mode</h3>
            <p className="mt-2 text-slate-600">Currently set to light mode - optimized for productivity and accessibility.</p>
            <div className="mt-4 flex items-center gap-3">
              <button
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  theme === "dark" ? "bg-slate-700 text-white" : "bg-white text-slate-700 border border-slate-200"
                }`}
                onClick={() => setTheme("dark")}
              >
                Dark
              </button>
              <button
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  theme === "light" ? "bg-blue-600 text-white" : "bg-white text-slate-700 border border-slate-200"
                }`}
                onClick={() => setTheme("light")}
              >
                Light
              </button>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 transition hover:shadow-[0_4px_12px_rgba(37,99,235,0.1)]">
            <h3 className="text-lg font-bold text-slate-900">Notifications</h3>
            <p className="mt-2 text-slate-600">Receive inventory alerts, order updates, and low-stock warnings.</p>
            <div className="mt-4 flex flex-col gap-3">
              <label className="flex items-center gap-3 text-sm text-slate-700">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 bg-white text-blue-600 cursor-pointer" defaultChecked />
                <span>Email Alerts</span>
              </label>
              <label className="flex items-center gap-3 text-sm text-slate-700">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 bg-white text-blue-600 cursor-pointer" defaultChecked />
                <span>Dashboard Notifications</span>
              </label>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
