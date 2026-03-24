export default function QuestionsPage() {
  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-3xl font-bold">Application Questions</h1>
        <p className="text-muted-foreground">
          Manage the question bank used across application forms.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"></div>
    </div>
  );
}
