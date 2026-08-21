import { renderTextAreaField, renderTextField } from "@uwdsc/ui";
import { answerMaxLength } from "@/lib/utils/application";
import type { ApplicationInputType } from "@uwdsc/common/types";

export interface AnswerQuestion {
  question_text: string;
  type: ApplicationInputType;
  placeholder: string | null;
  max_length: number | null;
}

export function renderAnswerField(question: AnswerQuestion) {
  const maxLength = answerMaxLength(question);
  const counter = (value: string) => (
    <span className={value.length > maxLength ? "text-red-400" : undefined}>
      {value.length}/{maxLength} characters
    </span>
  );
  const shared = {
    placeholder: question.placeholder ?? "",
    label: question.question_text,
    required: true,
    description: counter,
    descriptionClassName: "text-right tabular-nums"
  };

  return question.type === "text" ? renderTextField(shared) : renderTextAreaField(shared);
}
