import { FrontendUser } from "@shared/schema";
import AdminPanel from "@/components/admin/admin-panel";

interface AdminProps {
  user: FrontendUser;
}

export default function Admin({ user }: AdminProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminPanel user={user} />
    </div>
  );
}