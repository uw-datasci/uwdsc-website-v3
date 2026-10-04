"use client";

import { useState } from "react";
import { Button } from "@uwdsc/ui";
import { updateEvent } from "@/lib/api";
import type { Event } from "@uwdsc/common/types";
import { toast } from "sonner";

interface PublishEventButtonProps {
  readonly event: Event;
  readonly onSuccess?: () => void;
}

/** Publishes a draft event through the regular PATCH /api/events/[id] path. Hidden once published. */
export function PublishEventButton({ event, onSuccess }: Readonly<PublishEventButtonProps>) {
  const [isPublishing, setIsPublishing] = useState(false);

  if (event.is_published) return null;

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await updateEvent(event.id, { is_published: true });
      toast.success("Event published");
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to publish event";
      toast.error(message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handlePublish} disabled={isPublishing}>
      {isPublishing ? "Publishing..." : "Publish"}
    </Button>
  );
}
