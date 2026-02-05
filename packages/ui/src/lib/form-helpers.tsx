import { ComponentProps } from "react";
import { ControllerRenderProps } from "react-hook-form";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
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

export interface TextFieldOptions {
  placeholder: string;
  label?: string;
  required?: boolean;
  className?: string;
  inputProps?: Partial<ComponentProps<typeof Input>>;
}

export interface SelectFieldOptions {
  placeholder: string;
  options: string[];
  label?: string;
  required?: boolean;
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
}

export interface TextAreaFieldOptions {
  placeholder: string;
  label?: string;
  required?: boolean;
  className?: string;
  textareaProps?: Partial<ComponentProps<typeof Textarea>>;
}

export interface RadioFieldOptions {
  label: string;
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
          <SelectContent className={contentClassName}>
            {options.map((option) => (
              <SelectItem key={option} value={option} className={itemClassName}>
                {option}
              </SelectItem>
            ))}
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
    className,
    textareaProps = {},
  } = opts;

  function TextAreaFieldRender({ field }: StringFieldRenderProps) {
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
