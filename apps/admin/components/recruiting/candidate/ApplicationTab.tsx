import { History } from "lucide-react";
import type { CandidateView } from "@uwdsc/common/types";

export function ApplicationTab({ candidate }: { readonly candidate: CandidateView }) {
  const sections = candidate.sections.filter((section) => section.answers.length > 0);

  return (
    <div className="flex flex-col gap-6">
      {candidate.returning && (
        <section className="rounded-lg border bg-muted/40 px-4 py-3">
          <h3 className="flex items-center gap-2 text-[13px] font-semibold">
            <History className="size-3.5" aria-hidden />
            Past roles on record
          </h3>
          {candidate.pastRoles.length > 0 ? (
            <ul className="mt-1.5 flex flex-col gap-0.5 text-[13px] text-muted-foreground">
              {candidate.pastRoles.map((role) => (
                <li key={`${role.termCode}-${role.positionName}`}>
                  <span className="text-foreground">{role.positionName}</span>
                  {role.subteamName ? `, ${role.subteamName}` : ""} · {role.termCode}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-[13px] text-muted-foreground">
              Applied as a returning member, but there are no exec team rows for them yet.
            </p>
          )}
        </section>
      )}

      {sections.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">No answers saved.</p>
      )}

      {sections.map((section) => (
        <section key={section.key} className="flex flex-col gap-3">
          <div className="flex items-baseline gap-2 border-b pb-1.5">
            <h3 className="text-sm font-semibold">{section.title}</h3>
            {section.subtitle && (
              <span className="text-xs text-muted-foreground">{section.subtitle}</span>
            )}
          </div>
          <dl className="flex flex-col gap-4">
            {section.answers.map((answer) => (
              <div key={answer.questionId} className="flex flex-col gap-1">
                <dt className="text-[13px] font-medium text-muted-foreground">
                  {answer.question}
                </dt>
                <dd className="text-sm leading-6 whitespace-pre-wrap">{answer.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
