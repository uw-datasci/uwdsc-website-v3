import { AdminLayout } from "@/components/admin-layout";

export default function AdminPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminLayout>{children}</AdminLayout>;
}
