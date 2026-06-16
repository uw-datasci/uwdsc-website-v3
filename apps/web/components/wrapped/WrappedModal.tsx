"use client";

import { X } from "lucide-react";
import { Button, Dialog, DialogClose, DialogContent, DialogTitle } from "@uwdsc/ui";
import { WrappedStory } from "./WrappedStory";

interface WrappedModalProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export function WrappedModal({ open, onOpenChange }: WrappedModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-[390px] h-[85dvh] max-h-[844px] rounded-3xl border-0 p-0 bg-background overflow-hidden max-sm:max-w-none max-sm:h-dvh max-sm:max-h-none max-sm:rounded-none"
      >
        {/* Accessible title for screen readers; visually hidden so slides own the canvas. */}
        <DialogTitle className="sr-only">DSC Wrapped</DialogTitle>

        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-30 text-white hover:bg-white/10 rounded-full"
          >
            <X className="size-5" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogClose>

        {/* Wrapped content */}
        <WrappedStory active={open} />
      </DialogContent>
    </Dialog>
  );
}
