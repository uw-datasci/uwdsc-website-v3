import type { Question, QuestionsListResponse } from "@uwdsc/common/types";
import type { QuestionFormValues } from "@/lib/schemas/questions";
import { createApiError } from "./error";

export async function getScopedQuestions(): Promise<QuestionsListResponse> {
  const response = await fetch("/api/applications/questions");
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data as QuestionsListResponse;
}

export async function createQuestion(
  payload: QuestionFormValues,
): Promise<Question> {
  const response = await fetch("/api/applications/questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json()) as { question: Question };
  if (!response.ok) throw createApiError(data, response.status);
  return data.question;
}

export async function updateQuestion(
  positionQuestionId: number,
  payload: QuestionFormValues,
): Promise<Question> {
  const response = await fetch(
    `/api/applications/questions/${positionQuestionId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  const data = (await response.json()) as { question: Question };
  if (!response.ok) throw createApiError(data, response.status);
  return data.question;
}

export async function deleteQuestion(positionQuestionId: number): Promise<void> {
  const response = await fetch(
    `/api/applications/questions/${positionQuestionId}`,
    {
      method: "DELETE",
    },
  );
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
}
