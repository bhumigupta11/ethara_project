import { ReactNode } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50">
      {/* Subtle background decorations */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-gradient-radial from-blue-100/40 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-gradient-radial from-cyan-100/30 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-screen w-full max-w-[1600px] gap-5 px-4 py-4 lg:grid-cols-[280px_1fr] lg:px-6">
        <aside className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
          <Sidebar />
        </aside>
        <main className="flex min-h-screen min-w-0 flex-col gap-5">
          <Header />
          <section className="min-w-0 space-y-5 pb-6">{children}</section>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
