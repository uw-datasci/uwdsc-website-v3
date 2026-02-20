export default function DashboardPage() {
  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the admin dashboard. Overview and statistics coming soon.
        </p>
      </div>

      {/* Dashboard content will go here */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Stats cards will go here */}
      </div>
    </div>
  );
}
