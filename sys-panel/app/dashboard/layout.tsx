import Sidebar from "@/app/components/Sidebard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 flex font-['Poppins',sans-serif]">
      {/* Sidebar fijo a la izquierda */}
      <Sidebar />

      {/* Contenido principal con margen izquierdo */}
      <main className="flex-1 ml-64 p-8 text-white min-h-screen">
        {children}
      </main>
    </div>
  );
}