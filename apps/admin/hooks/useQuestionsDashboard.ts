"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { AppQuestion, QuestionPositionOption } from "@uwdsc/common/types";
import {
  createQuestion,
  deleteQuestion,
  getScopedQuestions,
  updateQuestion,
} from "@/lib/api/questions";
import {
  questionSchema,
  type QuestionFormValues,
} from "@/lib/schemas/questions";

export type QuestionsLoadState =
  | { status: "loading" }
  | { status: "forbidden"; message: string }
  | { status: "error"; message: string }
  | {
      status: "ready";
      questions: AppQuestion[];
      positions: QuestionPositionOption[];
      isPresident: boolean;
      vpSubteamNames: string[];
    };

export type QuestionDialogMode = "create" | "edit" | "view";

export function useQuestionsDashboard() {
  const [loadState, setLoadState] = useState<QuestionsLoadState>({
    status: "loading",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<QuestionDialogMode>("create");
  const [deleteTarget, setDeleteTarget] = useState<AppQuestion | null>(null);
  const [editing, setEditing] = useState<AppQuestion | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question_text: "",
      type: "textarea",
      max_length: null,
      placeholder: null,
      help_text: null,
      sort_order: 0,
      position_id: null,
    },
  });

  const load = useCallback(async () => {
    setLoadState({ status: "loading" });
    try {
      const data = await getScopedQuestions();
      setLoadState({
        status: "ready",
        questions: data.questions,
        positions: data.positions,
        isPresident: data.scope.isPresident,
        vpSubteamNames: data.scope.vpSubteamNames,
      });
    } catch (err: unknown) {
      const status = (err as { status?: number }).status;
      const message =
        err instanceof Error ? err.message : "Failed to load questions";
      if (status === 401) {
        setLoadState({
          status: "forbidden",
          message:
            "Only VPs can manage application questions. Presidents see all positions; other VPs see their own.",
        });
        return;
      }
      setLoadState({ status: "error", message });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = useCallback(() => {
    setDialogMode("create");
    setEditing(null);
    const firstPos =
      loadState.status === "ready"
        ? (loadState.positions[0]?.id ?? null)
        : null;
    form.reset({
      question_text: "",
      type: "textarea",
      max_length: null,
      placeholder: null,
      help_text: null,
      sort_order: 0,
      position_id: firstPos,
    });
    setDialogOpen(true);
  }, [form, loadState]);

  const openEdit = useCallback(
    (q: AppQuestion) => {
      if (!q.can_edit) {
        toast.error("You can only edit questions in your VP scope");
        return;
      }
      setDialogMode("edit");
      setEditing(q);
      form.reset({
        question_text: q.question_text,
        type: q.type,
        max_length: q.max_length,
        placeholder: q.placeholder,
        help_text: q.help_text,
        sort_order: q.sort_order,
        position_id: q.position_id,
      });
      setDialogOpen(true);
    },
    [form],
  );

  const openView = useCallback(
    (q: AppQuestion) => {
      setDialogMode("view");
      setEditing(q);
      form.reset({
        question_text: q.question_text,
        type: q.type,
        max_length: q.max_length,
        placeholder: q.placeholder,
        help_text: q.help_text,
        sort_order: q.sort_order,
        position_id: q.position_id,
      });
      setDialogOpen(true);
    },
    [form],
  );

  const submitQuestion = useCallback(
    async (values: QuestionFormValues) => {
      if (dialogMode === "view") return;
      setSaving(true);
      try {
        if (dialogMode === "edit" && editing) {
          await updateQuestion(editing.relation_id, values);
          toast.success("Question updated");
        } else {
          await createQuestion(values);
          toast.success("Question created");
        }
        setDialogOpen(false);
        setEditing(null);
        await load();
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        toast.error(message);
      } finally {
        setSaving(false);
      }
    },
    [dialogMode, editing, load],
  );

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteQuestion(deleteTarget.relation_id);
      toast.success("Question removed");
      setDeleteTarget(null);
      await load();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete question";
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, load]);

  const requestDelete = useCallback((q: AppQuestion) => {
    if (!q.can_edit) {
      toast.error("You can only delete questions in your VP scope");
      return;
    }
    setDeleteTarget(q);
  }, []);

  const onFormDialogOpenChange = useCallback((open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditing(null);
      setDialogMode("create");
    }
  }, []);

  const onDeleteDialogOpenChange = useCallback((open: boolean) => {
    if (!open) setDeleteTarget(null);
  }, []);

  return {
    loadState,
    load,
    form,
    dialogOpen,
    dialogMode,
    deleteTarget,
    editing,
    saving,
    deleting,
    openCreate,
    openEdit,
    openView,
    requestDelete,
    submitQuestion,
    confirmDelete,
    onFormDialogOpenChange,
    onDeleteDialogOpenChange,
  };
}
