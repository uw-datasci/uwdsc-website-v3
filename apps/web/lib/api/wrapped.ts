import type { WrappedSlideData } from "@/components/wrapped/types";
import { createApiError } from "./errors";

export async function getWrappedSlides(): Promise<WrappedSlideData[]> {
  const response = await fetch("/api/wrapped");
  const data = await response.json();

  if (!response.ok) throw createApiError(data, response.status);

  return data.slides;
}
