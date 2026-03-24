export default function ReviewPage() {
  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-3xl font-bold">Applications Review</h1>
        <p className="text-muted-foreground">
          Review applicant submissions and track decision status.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"></div>
    </div>
  );
}
