"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button, Card } from "@uwdsc/ui";

export interface PassportStampData {
  label: string;
  accent: string;
  mark: string;
}

interface PassportStampsProps {
  stamps: readonly PassportStampData[];
}

const STAMPS_PER_PAGE = 12;

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -40 : 40, opacity: 0 }),
};

export function PassportStamps({ stamps }: Readonly<PassportStampsProps>) {
  const pageCount = Math.max(1, Math.ceil(stamps.length / STAMPS_PER_PAGE));
  const [[page, direction], setPageState] = useState<[number, number]>([0, 0]);
  const currentPage = Math.min(page, pageCount - 1);

  const goTo = (nextPage: number, dir: number) => setPageState([nextPage, dir]);
  const goPrev = () => goTo((currentPage - 1 + pageCount) % pageCount, -1);
  const goNext = () => goTo((currentPage + 1) % pageCount, 1);

  const pageStamps = stamps.slice(
    currentPage * STAMPS_PER_PAGE,
    currentPage * STAMPS_PER_PAGE + STAMPS_PER_PAGE
  );
  const placeholderCount = STAMPS_PER_PAGE - pageStamps.length;

  return (
    <Card className="flex h-full flex-col gap-0 overflow-hidden rounded-2xl border border-white/15 bg-[#121212] py-0 text-white shadow-2xl">
      <div className="flex items-end justify-between gap-3 border-b border-white/10 px-4 pb-3 pt-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
            my stamps
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            {pageCount > 1
              ? "Flip through your stamp book pages."
              : "Collect stamps by attending events."}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            {stamps.length} stamps
          </span>
          {pageCount > 1 ? (
            <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
              Page {currentPage + 1} / {pageCount}
            </span>
          ) : null}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden px-4 py-4">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={currentPage}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="grid h-full min-h-0 grid-cols-2 gap-3 sm:grid-cols-3 lg:auto-rows-fr lg:grid-cols-4 lg:grid-rows-3"
          >
            {pageStamps.map(({ label, accent, mark }, index) => {
              const stampNumber = currentPage * STAMPS_PER_PAGE + index + 1;
              return (
                <div
                  key={`stamp-${currentPage}-${label}`}
                  className="group relative h-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-3 shadow-[0_14px_30px_rgba(0,0,0,0.28)]"
                >
                  <div className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${accent}`} />
                  <div className="flex h-full min-h-32 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                          Stamp {stampNumber}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white">{label}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-1 items-center justify-center rounded-2xl border border-white/8 bg-white/5 px-3 py-4">
                      <div
                        className={`flex size-18 items-center justify-center rounded-full bg-linear-to-br ${accent} text-sm font-black tracking-[0.18em] text-white shadow-[0_12px_24px_rgba(0,0,0,0.28)]`}
                      >
                        {mark}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {Array.from({ length: placeholderCount }).map((_, index) => (
              <div
                key={`placeholder-${currentPage}-${index}`}
                className="flex h-full min-h-32 items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 p-3"
              >
                <span className="font-mono text-lg text-zinc-700">+</span>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {pageCount > 1 ? (
        <div className="flex items-center justify-center gap-3 border-t border-white/10 px-4 py-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={goPrev}
            aria-label="Previous page"
            className="size-8 text-white/70 hover:text-white"
          >
            <ChevronLeft className="size-4" />
          </Button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: pageCount }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goTo(index, index > currentPage ? 1 : -1)}
                aria-label={`Go to page ${index + 1}`}
                className={`size-1.5 rounded-full transition-colors ${
                  index === currentPage ? "bg-white" : "bg-white/25"
                }`}
              />
            ))}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={goNext}
            aria-label="Next page"
            className="size-8 text-white/70 hover:text-white"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
