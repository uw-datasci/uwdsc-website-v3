"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "../lib/utils";
import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  ScrollBar,
} from "@uwdsc/ui";

function parseValue(value: string | Date | null | undefined): Date | undefined {
  if (value == null || value === "") return undefined;
  if (value instanceof Date)
    return Number.isNaN(value.getTime()) ? undefined : value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export interface DateTimePickerProps {
  /** ISO date string, Date, or undefined. Form fields typically use ISO strings. */
  value?: string | Date | null;
  /** Called with ISO date string when value changes, or "" when cleared. */
  onChange?: (value: string) => void;
  /** Placeholder when no value is set. */
  placeholder?: string;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "MM/DD/YYYY hh:mm aa",
}: Readonly<DateTimePickerProps>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const date = parseValue(value);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  const updateDate = React.useCallback(
    (newDate: Date | undefined) => {
      onChange?.(newDate ? newDate.toISOString() : "");
    },
    [onChange],
  );

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      updateDate(selectedDate);
    }
  };

  const handleTimeChange = (
    type: "hour" | "minute" | "ampm",
    value: string,
  ) => {
    const base = date ?? new Date();
    const newDate = new Date(base);
    if (type === "hour") {
      newDate.setHours(
        (Number.parseInt(value, 10) % 12) + (newDate.getHours() >= 12 ? 12 : 0),
      );
    } else if (type === "minute") {
      newDate.setMinutes(Number.parseInt(value, 10));
    } else if (type === "ampm") {
      const currentHours = newDate.getHours();
      newDate.setHours(
        value === "PM" ? (currentHours % 12) + 12 : currentHours % 12,
      );
    }
    updateDate(newDate);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          type="button"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "MM/dd/yyyy hh:mm aa")
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar mode="single" selected={date} onSelect={handleDateSelect} />
          <div
            className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x"
            onWheel={(e) => e.stopPropagation()}
          >
            <ScrollArea className="h-full min-h-0 w-64 sm:w-auto sm:max-h-[300px]">
              <div className="flex sm:flex-col p-2">
                {hours.toReversed().map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={
                      date && date.getHours() % 12 === hour % 12
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="h-full min-h-0 w-64 sm:w-auto sm:max-h-[300px]">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      date?.getMinutes() === minute ? "default" : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() =>
                      handleTimeChange("minute", minute.toString())
                    }
                  >
                    {minute}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="">
              <div className="flex sm:flex-col p-2">
                {["AM", "PM"].map((ampm) => (
                  <Button
                    key={ampm}
                    size="icon"
                    variant={
                      date &&
                      ((ampm === "AM" && date.getHours() < 12) ||
                        (ampm === "PM" && date.getHours() >= 12))
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("ampm", ampm)}
                  >
                    {ampm}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
