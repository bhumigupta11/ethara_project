import { useState } from "react";
import Card from "../components/Card";

const SettingsPage = () => {
  const [theme, setTheme] = useState("dark");

  return (
    <div className="space-y-6">
      <Card title="Settings" subtitle="Personalize Ethara for your team">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
            <h3 className="text-lg font-semibold text-white">Theme mode</h3>
            <p className="mt-2 text-slate-400">Toggle between a modern dark design and a warm light experience.</p>
            <div className="mt-4 flex items-center gap-3">
              <button
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  theme === "dark" ? "bg-violet-500 text-white" : "bg-slate-800 text-slate-200"
                }`}
                onClick={() => setTheme("dark")}
              >
                Dark
              </button>
              <button
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  theme === "light" ? "bg-violet-500 text-white" : "bg-slate-800 text-slate-200"
                }`}
                onClick={() => setTheme("light")}
              >
                Light
              </button>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
            <p className="mt-2 text-slate-400">Receive inventory alerts, order updates, and low-stock warnings.</p>
            <div className="mt-4 flex flex-col gap-3">
              <label className="flex items-center gap-3 text-sm text-slate-300">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-500 bg-slate-900 text-violet-500" />
                Email Alerts
              </label>
              <label className="flex items-center gap-3 text-sm text-slate-300">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-500 bg-slate-900 text-violet-500" />
                Dashboard Notifications
              </label>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
