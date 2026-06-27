import Header from "@/components/admin/header";
import Sidebar from "@/components/admin/sidebar";
import { useMenu } from "@/hooks/useMenu";
import { Outlet } from "react-router";

const AdminLayout = () => {
  const { open, setOpen } = useMenu();

  return (
    <div className="flex min-h-screen w-full md:pl-64">
      <Sidebar />
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
