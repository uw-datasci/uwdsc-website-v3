import { ComponentProps } from "react";
import { ControllerRenderProps } from "react-hook-form";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  RadioGroup,
  RadioGroupItem,
  Textarea,
  Input,
} from "@uwdsc/ui";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

// Allow optional field values so helpers work with forms that have optional fields (e.g. member_ideas?: string)
type StringFieldProps = ControllerRenderProps<
  Record<string, string | undefined>,
  string
>;
type BooleanFieldProps = ControllerRenderProps<
  Record<string, boolean | undefined>,
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

// ---------------------------------------------------------------------------
// Helpers: each returns a component that receives { field } for FormField render
// ---------------------------------------------------------------------------

interface StringFieldRenderProps {
  readonly field: StringFieldProps;
}

interface BooleanFieldRenderProps {
  readonly field: BooleanFieldProps;
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
          <Input
            {...field}
            {...inputProps}
            placeholder={placeholder}
            className={className}
          />
        </FormControl>
        {description != null && (
          <FormDescription>{description}</FormDescription>
        )}
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
        <Select onValueChange={field.onChange} value={field.value}>
          <FormControl>
            <SelectTrigger className={triggerClassName}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent
            className={contentClassName}
            position={contentPosition}
          >
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
      typeof description === "function"
        ? description(field.value ?? "")
        : description;
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
              <FormItem
                key={index}
                className="flex flex-col items-center space-y-1 space-x-0"
              >
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
