interface ApplicationsErrorProps {
  readonly message: string;
}

export function ApplicationsError({ message }: ApplicationsErrorProps) {
  return (
    <div className="space-y-4 mt-8 w-full">
      <h1 className="text-3xl font-bold">Applications</h1>
      <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
        <p className="text-sm text-destructive">Error: {message}</p>
      </div>
    </div>
  );
}
