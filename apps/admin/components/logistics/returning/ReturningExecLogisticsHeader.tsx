type ReturningExecLogisticsHeaderProps = Readonly<{
  submitted: boolean;
}>;

export function ReturningExecLogisticsHeader({
  submitted,
}: ReturningExecLogisticsHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold">Returning Exec Form</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Let us know whether you&apos;re interested in returning next term.
        {submitted && " Your response has been saved — you can update it anytime."}
      </p>
    </div>
  );
}
