"use client";

import type { ReactNode } from "react";
import {
  EditQuestionDialog,
  DeleteQuestionDialog,
  QuestionsBankSection,
  QuestionsDashboardError,
  QuestionsDashboardForbidden,
  QuestionsDashboardLoading,
} from "@/components/applications/questions";
import { useQuestionsDashboard } from "@/hooks/useQuestionsDashboard";

export default function QuestionsPage() {
  const {
    loadState,
    load,
    form,
    dialogOpen,
    deleteTarget,
    editing,
    saving,
    deleting,
    openCreate,
    openEdit,
    requestDelete,
    submitQuestion,
    confirmDelete,
    onFormDialogOpenChange,
    onDeleteDialogOpenChange,
  } = useQuestionsDashboard();

  let main: ReactNode;
  switch (loadState.status) {
    case "loading":
      main = <QuestionsDashboardLoading />;
      break;
    case "forbidden":
      main = <QuestionsDashboardForbidden message={loadState.message} />;
      break;
    case "error":
      main = (
        <QuestionsDashboardError message={loadState.message} onRetry={load} />
      );
      break;
    case "ready": {
      const { questions, positions, isPresident } = loadState;
      main = (
        <>
          <QuestionsBankSection
            positions={positions}
            questions={questions}
            isPresident={isPresident}
            onAddClick={openCreate}
            onEdit={openEdit}
            onRequestDelete={requestDelete}
          />

          <EditQuestionDialog
            form={form}
            open={dialogOpen}
            onOpenChange={onFormDialogOpenChange}
            editing={editing !== null}
            isPresident={isPresident}
            positions={positions}
            saving={saving}
            onSubmit={submitQuestion}
          />

          <DeleteQuestionDialog
            question={deleteTarget}
            onOpenChange={onDeleteDialogOpenChange}
            deleting={deleting}
            onConfirm={confirmDelete}
          />
        </>
      );
      break;
    }
    default: {
      const _exhaustive: never = loadState;
      main = _exhaustive;
    }
  }

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-3xl font-bold">Application Questions</h1>
        <p className="text-muted-foreground">
          Manage the question bank used across application forms. Access is
          limited to VPs; Presidents can edit all positions, other VPs only
          their own.
        </p>
      </div>

      {main}
    </div>
  );
}
