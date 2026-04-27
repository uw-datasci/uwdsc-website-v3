import { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";
import {
  Button,
  Checkbox,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@uwdsc/ui";
import { cn } from "./utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

// Allow optional field values so helpers work with forms that have optional fields (e.g. member_ideas?: string)
type StringFieldProps = ControllerRenderProps<Record<string, string | undefined>, string>;
type BooleanFieldProps = ControllerRenderProps<Record<string, boolean | undefined>, string>;

type StringArrayFieldProps = ControllerRenderProps<
  Record<string, string[] | undefined>,
  string
>;

interface TextFieldOptions {
  placeholder: string;
  label?: string;
  required?: boolean;
  description?: string;
  className?: string;
  inputProps?: Partial<ComponentProps<typeof Input>>;
}

type SelectOption = string | { value: string; label: string };

interface SelectFieldOptions {
  placeholder: string;
  options: SelectOption[];
  label?: string;
  required?: boolean;
  disabled?: boolean;
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  /** Use "popper" for stable dropdown positioning (avoids content shifting on hover). */
  contentPosition?: "item-aligned" | "popper";
}

interface TextAreaFieldOptions {
  placeholder: string;
  label?: string;
  required?: boolean;
  description?: string | ((value: string) => React.ReactNode);
  className?: string;
  textareaProps?: Partial<ComponentProps<typeof Textarea>>;
}

interface RadioFieldOptions {
  label: string;
  required?: boolean;
}

interface ScaleFieldOptions {
  label: string;
  labels: string[]; // length determines the scale, e.g. ["None", "Beginner", "Intermediate", "Advanced", "Expert"]
  required?: boolean;
}

interface CheckboxFieldOptions {
  label?: string;
  required?: boolean;
  description?: string | ((checked: boolean) => React.ReactNode);
  containerClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  checkboxClassName?: string;
}

interface MultiSelectDropdownFieldOptions {
  label?: string;
  required?: boolean;
  /** Shown on the trigger when nothing is selected */
  emptyPlaceholder: string;
  options: readonly string[];
  formatOption?: (value: string) => string;
  triggerClassName?: string;
  contentClassName?: string;
}

// ---------------------------------------------------------------------------
// Helpers: each returns a component that receives { field } for FormField render
// ---------------------------------------------------------------------------

interface StringFieldRenderProps {
  readonly field: StringFieldProps;
}

interface BooleanFieldRenderProps {
  readonly field: BooleanFieldProps;
}

interface StringArrayFieldRenderProps {
  readonly field: StringArrayFieldProps;
}

function toggleStringInArray(list: string[], item: string, selected: boolean): string[] {
  if (selected) {
    return list.includes(item) ? list : [...list, item];
  }
  return list.filter((v) => v !== item);
}

export function renderTextField(opts: TextFieldOptions) {
  const {
    placeholder,
    label,
    required = false,
    description,
    className,
    inputProps = {},
  } = opts;

  function TextFieldRender({ field }: StringFieldRenderProps) {
    return (
      <FormItem>
        {label != null && (
          <FormLabel className="mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
        )}
        <FormControl>
          <Input {...field} {...inputProps} placeholder={placeholder} className={className} />
        </FormControl>
        {description != null && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    );
  }
  TextFieldRender.displayName = `TextField(${placeholder})`;
  return TextFieldRender;
}

export function renderSelectField(opts: SelectFieldOptions) {
  const {
    placeholder,
    options,
    label,
    required = false,
    disabled = false,
    triggerClassName,
    contentClassName,
    itemClassName,
    contentPosition,
  } = opts;

  function SelectFieldRender({ field }: StringFieldRenderProps) {
    return (
      <FormItem>
        {label != null && (
          <FormLabel className="mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
        )}
        <Select
          onValueChange={field.onChange}
          value={field.value === "" ? undefined : field.value}
          disabled={disabled}
        >
          <FormControl>
            <SelectTrigger className={triggerClassName}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent className={contentClassName} position={contentPosition}>
            {options.map((option) => {
              const value = typeof option === "string" ? option : option.value;
              const label = typeof option === "string" ? option : option.label;
              return (
                <SelectItem key={value} value={value} className={itemClassName}>
                  {label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    );
  }
  SelectFieldRender.displayName = `SelectField(${placeholder})`;
  return SelectFieldRender;
}

export function renderTextAreaField(opts: TextAreaFieldOptions) {
  const {
    placeholder,
    label,
    required = false,
    description,
    className,
    textareaProps = {},
  } = opts;

  function TextAreaFieldRender({ field }: StringFieldRenderProps) {
    const desc =
      typeof description === "function" ? description(field.value ?? "") : description;
    return (
      <FormItem>
        {label != null && (
          <FormLabel className="mb-1 leading-relaxed">
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
        )}
        <FormControl>
          <Textarea
            {...field}
            {...textareaProps}
            placeholder={placeholder}
            className={className}
          />
        </FormControl>
        {desc != null && <FormDescription>{desc}</FormDescription>}
        <FormMessage />
      </FormItem>
    );
  }
  TextAreaFieldRender.displayName = `TextAreaField(${placeholder})`;
  return TextAreaFieldRender;
}

export function renderRadioField(opts: RadioFieldOptions) {
  const { label, required = true } = opts;

  function RadioFieldRender({ field }: BooleanFieldRenderProps) {
    let value: string | undefined;
    if (field.value === undefined) {
      value = undefined;
    } else if (field.value) {
      value = "true";
    } else {
      value = "false";
    }
    return (
      <FormItem className="space-y-3">
        <FormLabel>
          {label} {required && <span className="text-red-500">*</span>}
        </FormLabel>
        <FormControl>
          <RadioGroup
            onValueChange={(v) => field.onChange(v === "true")}
            value={value}
            className="flex flex-col space-y-1"
          >
            <FormItem className="flex items-center space-x-3 space-y-0">
              <FormControl>
                <RadioGroupItem value="true" />
              </FormControl>
              <FormLabel className="font-normal cursor-pointer">Yes</FormLabel>
            </FormItem>
            <FormItem className="flex items-center space-x-3 space-y-0">
              <FormControl>
                <RadioGroupItem value="false" />
              </FormControl>
              <FormLabel className="font-normal cursor-pointer">No</FormLabel>
            </FormItem>
          </RadioGroup>
        </FormControl>
        <FormMessage />
      </FormItem>
    );
  }
  RadioFieldRender.displayName = `RadioField(${label})`;
  return RadioFieldRender;
}

export function renderScaleField(opts: ScaleFieldOptions) {
  const { label, labels, required = true } = opts;

  function ScaleFieldRender({ field }: StringFieldRenderProps) {
    return (
      <FormItem className="space-y-3">
        <FormLabel>
          {label} {required && <span className="text-red-500">*</span>}
        </FormLabel>
        <FormControl>
          <RadioGroup
            onValueChange={(v) => field.onChange(v)}
            value={field.value === undefined ? undefined : String(field.value)}
            className="flex items-center gap-4"
          >
            {labels.map((scaleLabel, index) => (
              <FormItem key={index} className="flex flex-col items-center space-y-1 space-x-0">
                <FormControl>
                  <RadioGroupItem value={String(index)} />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer text-center text-sm">
                  {scaleLabel}
                </FormLabel>
              </FormItem>
            ))}
          </RadioGroup>
        </FormControl>
        <FormMessage />
      </FormItem>
    );
  }
  ScaleFieldRender.displayName = `ScaleField(${label})`;
  return ScaleFieldRender;
}

export function renderCheckboxField(opts: CheckboxFieldOptions) {
  const {
    label,
    required = false,
    description,
    containerClassName = "flex items-start gap-3",
    labelClassName = "cursor-pointer",
    descriptionClassName,
    checkboxClassName = "mt-0.5",
  } = opts;

  function CheckboxFieldRender({ field }: BooleanFieldRenderProps) {
    const checked = field.value ?? false;
    const desc = typeof description === "function" ? description(checked) : description;

    return (
      <FormItem className={containerClassName}>
        <FormControl>
          <Checkbox
            checked={checked}
            onCheckedChange={(v) => field.onChange(v === true)}
            className={checkboxClassName}
          />
        </FormControl>

        <div className="flex flex-col gap-0.5">
          {label != null && (
            <FormLabel className={labelClassName}>
              {label} {required && <span className="text-red-500">*</span>}
            </FormLabel>
          )}
          {desc != null && (
            <FormDescription className={descriptionClassName}>{desc}</FormDescription>
          )}
        </div>
        <FormMessage />
      </FormItem>
    );
  }
  CheckboxFieldRender.displayName = `CheckboxField(${label ?? "unknown"})`;
  return CheckboxFieldRender;
}

export function renderMultiSelectDropdownField(opts: MultiSelectDropdownFieldOptions) {
  const {
    label,
    required = false,
    emptyPlaceholder,
    options,
    formatOption = (v) => v.charAt(0).toUpperCase() + v.slice(1),
    triggerClassName,
    contentClassName,
  } = opts;

  function MultiSelectDropdownFieldRender({ field }: StringArrayFieldRenderProps) {
    const value = field.value ?? [];
    return (
      <FormItem>
        {label != null && (
          <FormLabel className="mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
        )}
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                className={cn(
                  // Align with SelectTrigger + Input: rounded-md, full width, input-like padding
                  "border-input data-placeholder:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex h-9 w-full min-w-0 items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-left text-sm font-normal shadow-xs transition-[color,box-shadow] outline-none",
                  "hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:hover:bg-input/50",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                  !value.length && "text-muted-foreground",
                  triggerClassName,
                )}
              >
                <span className="min-w-0 flex-1 truncate">
                  {value.length ? value.map(formatOption).join(", ") : emptyPlaceholder}
                </span>
                <ChevronDown className="size-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent
            className={cn(
              "w-(--radix-popover-trigger-width) p-1 text-popover-foreground",
              contentClassName,
            )}
            align="start"
          >
            <div className="flex flex-col">
              {options.map((option) => (
                <label
                  key={option}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-2 pl-2 text-sm outline-none select-none",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus-within:bg-accent focus-within:text-accent-foreground",
                  )}
                >
                  <Checkbox
                    checked={value.includes(option)}
                    onCheckedChange={(v) =>
                      field.onChange(toggleStringInArray(value, option, v === true))
                    }
                    className="shrink-0"
                  />
                  <span className="min-w-0 flex-1">{formatOption(option)}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <FormMessage />
      </FormItem>
    );
  }

  MultiSelectDropdownFieldRender.displayName = `MultiSelectDropdownField(${emptyPlaceholder})`;
  return MultiSelectDropdownFieldRender;
}
