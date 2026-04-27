"use client";

import { Pencil } from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@uwdsc/ui";
import type { ApplicationReviewStatus } from "@uwdsc/common/types";
import { PRESIDENT_REVIEW_ONLY_STATUS_LIST } from "@/constants/applications";

interface SelectionOutcomeEditProps {
  readonly disabled?: boolean;
  readonly onSelect: (status: ApplicationReviewStatus) => void;
}

export function SelectionOutcomeEdit({
  disabled,
  onSelect,
}: SelectionOutcomeEditProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5"
          disabled={disabled}
          aria-label="Edit role outcome"
        >
          <Pencil className="size-3.5" />
          Edit
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {PRESIDENT_REVIEW_ONLY_STATUS_LIST.map((status) => (
          <DropdownMenuItem key={status} onClick={() => onSelect(status)}>
            {status}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
