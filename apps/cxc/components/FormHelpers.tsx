import {
  Input,
  Textarea,
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
  Combobox,
  cn,
  Checkbox,
  FileTextIcon,
  UploadSimpleIcon,
} from "@uwdsc/ui";
import type { ComboboxOption } from "@uwdsc/ui";
import { ComponentProps, useEffect, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";

/**
 * Generic Form Helpers
 *
 * These helpers provide flexible, reusable form field renderers that work with any form type.
 * They support different styling variants for different contexts (auth, registration, application forms).
 */

// ============================================================================
// Types
// ============================================================================

type FormFieldVariant = "default" | "auth" | "application";

interface TextFieldOptions {
  label?: string;
  required?: boolean;
  variant?: FormFieldVariant;
  inputProps?: Partial<ComponentProps<typeof Input>>;
}

interface SelectFieldOptions {
  label?: string;
  required?: boolean;
  variant?: FormFieldVariant;
}

interface TextAreaFieldOptions {
  label?: string;
  required?: boolean;
  variant?: FormFieldVariant;
  textareaProps?: Partial<ComponentProps<typeof Textarea>>;
}

interface RadioFieldOptions {
  required?: boolean;
}

interface ComboboxFieldOptions {
  label?: string;
  required?: boolean;
  variant?: FormFieldVariant;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

interface FileUploadFieldOptions {
  label?: string;
  required?: boolean;
}

interface CheckboxGroupFieldOptions {
  label?: string;
  required?: boolean;
}

// ============================================================================
// Styling Variants
// ============================================================================

const inputStyles: Record<FormFieldVariant, string> = {
  default: "",
  auth: "!h-auto !text-base border-gray-100/80 !bg-black px-4.5 py-3.5 placeholder:text-gray-100/80 rounded-lg xl:px-6 xl:py-4.5",
  application:
    "!h-auto !border-0 !px-4.5 !py-4 !text-base !border-b-[2px] !bg-cxc-input-bg !rounded-none !shadow-none transition-colors",
};

const selectTriggerStyles: Record<FormFieldVariant, string> = {
  default: "w-full",
  auth: "w-full !bg-black !h-auto !px-4.5 !py-3.5 !rounded-lg xl:px-6 xl:py-4.5 border border-gray-100/75 text-base",
  application:
    "w-full !h-auto !px-4.5 !py-4 !text-base !border-0 !border-b !bg-cxc-input-bg !rounded-none !shadow-none",
};

const selectContentStyles: Record<FormFieldVariant, string> = {
  default: "bg-slate-700",
  auth: "bg-black !max-h-64 !overflow-y-auto border-gray-100/75",
  application: "!bg-zinc-900 !rounded-none !border-0 !shadow-lg",
};

const selectItemStyles: Record<FormFieldVariant, string> = {
  default:
    "text-slate-200 focus:bg-slate-600 focus:text-white hover:bg-slate-600 hover:text-white transition-colors",
  auth: "text-slate-200 focus:text-white hover:!bg-slate-600/50 hover:text-white rounded-sm px-3 py-3.5 hover:bg-grey4 xl:px-4 xl:py-4 text-base",
  application:
    "!text-gray-200 focus:!bg-zinc-700 focus:!text-white hover:!bg-zinc-700 hover:!text-white transition-colors p-2",
};

const textareaStyles: Record<FormFieldVariant, string> = {
  default: "",
  auth: "min-h-[6rem] max-h-[10rem] border-gray-100/80 bg-black px-4.5 py-3.5 placeholder:text-gray-100/80 rounded-lg xl:px-6 xl:py-4.5 !text-base",
  application:
    "!h-auto min-h-[8rem] !border-0 !border-b !rounded-none !px-3 !shadow-none !bg-white/5 hover:!bg-white/10 focus:!bg-white/10 transition-colors !text-base",
};

const comboboxStyles: Record<FormFieldVariant, string> = {
  default: "",
  auth: "!h-auto !text-base border-gray-100/80 !bg-black px-4.5 py-3.5 rounded-lg xl:px-6 xl:py-4.5",
  application:
    "!h-auto !border-0 !border-b !rounded-none !px-4.5 !py-4 !shadow-none !bg-cxc-input-bg text-base font-normal",
};

const comboboxContentStyles: Record<FormFieldVariant, string> = {
  default: "",
  auth: "",
  application: "!rounded-none !border-0 !shadow-lg",
};

// ============================================================================
// Generic Form Field Renderers
// ============================================================================

/**
 * Render a text input field
 *
 * @example
 * // Auth form (no label, dark styling)
 * renderTextField("Email", { variant: "auth", inputProps: { type: "email" } })
 *
 * // Application form (with label and required indicator)
 * renderTextField("First Name", { label: "First Name", required: true })
 */
export const renderTextField = <T extends Record<string, any>>(
  placeholder: string,
  options: TextFieldOptions = {}
) => {
  const { label, required = false, variant = "default", inputProps } = options;

  return ({
    field,
    fieldState,
  }: {
    field: ControllerRenderProps<T, any>;
    fieldState: { error?: { message?: string } };
  }) => (
    <FormItem>
      {label && (
        <FormLabel className={`font-normal mb-1`}>
          {label} {required && <span className="text-destructive">*</span>}
        </FormLabel>
      )}
      <FormControl>
        <Input
          {...field}
          {...inputProps}
          placeholder={placeholder}
          value={field.value ?? ""}
          className={cn(
            inputStyles[variant],
            variant === "application" &&
              !fieldState.error &&
              "focus-visible:ring-white/30 focus-visible:border-white"
          )}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

/**
 * Render a select dropdown field
 *
 * @example
 * // Auth form
 * renderSelectField("Select your faculty", ["Math", "Engineering"], { variant: "auth" })
 *
 * // Application form with label
 * renderSelectField("Select position", positions, { label: "Position", required: true })
 */
export const renderSelectField = <T extends Record<string, any>>(
  placeholder: string,
  options: string[],
  fieldOptions: SelectFieldOptions = {}
) => {
  const { label, required = false, variant = "default" } = fieldOptions;

  return ({ field }: { field: ControllerRenderProps<T, any> }) => (
    <FormItem>
      {label && (
        <FormLabel className={`font-normal mb-1`}>
          {label} {required && <span className="text-destructive">*</span>}
        </FormLabel>
      )}
      <Select onValueChange={field.onChange} value={field.value}>
        <FormControl>
          <SelectTrigger className={selectTriggerStyles[variant]}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </FormControl>

        <SelectContent className={selectContentStyles[variant]}>
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className={selectItemStyles[variant]}
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
};

/**
 * Render a textarea field
 *
 * @example
 * // Auth form
 * renderTextAreaField("Tell us about yourself", { variant: "auth" })
 *
 * // Application form with label
 * renderTextAreaField("Why do you want to join?", { label: "Motivation", required: true })
 */
export const renderTextAreaField = <T extends Record<string, any>>(
  placeholder: string,
  options: TextAreaFieldOptions = {}
) => {
  const {
    label,
    required = false,
    variant = "default",
    textareaProps,
  } = options;

  return ({ field }: { field: ControllerRenderProps<T, any> }) => (
    <FormItem>
      {label && (
        <FormLabel className={`font-normal mb-1 leading-relaxed`}>
          {label} {required && <span className="text-destructive">*</span>}
        </FormLabel>
      )}
      <FormControl>
        <Textarea
          placeholder={placeholder}
          {...textareaProps}
          {...field}
          className={textareaStyles[variant]}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

/**
 * Render a radio group field for boolean values (Yes/No)
 *
 * @example
 * renderRadioField("Are you a UW student?", { required: true })
 */
export const renderRadioField = <T extends Record<string, any>>(
  label: string,
  options: RadioFieldOptions = {}
) => {
  const { required = true } = options;

  return ({ field }: { field: ControllerRenderProps<T, any> }) => (
    <FormItem className="space-y-3">
      <FormLabel className="font-normal">
        {label} {required && <span className="text-destructive">*</span>}
      </FormLabel>
      <FormControl>
        <RadioGroup
          onValueChange={(value) => field.onChange(value === "true")}
          value={field.value === undefined ? undefined : String(field.value)}
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
};

/**
 * Render a combobox field with searchable dropdown
 *
 * @example
 * // Auth form
 * renderComboboxField("Select your program", programOptions, { variant: "auth" })
 *
 * // Application form with label
 * renderComboboxField("Select position", positionOptions, { label: "Position", required: true })
 */
export const renderComboboxField = <T extends Record<string, any>>(
  placeholder: string,
  options: ComboboxOption[],
  fieldOptions: ComboboxFieldOptions = {}
) => {
  const {
    label,
    required = false,
    variant = "default",
    searchPlaceholder = "Search...",
    emptyMessage = "No option found.",
  } = fieldOptions;

  return ({ field }: { field: ControllerRenderProps<T, any> }) => (
    <FormItem>
      {label && (
        <FormLabel className={`font-normal mb-1`}>
          {label} {required && <span className="text-destructive">*</span>}
        </FormLabel>
      )}
      <FormControl>
        <Combobox
          options={options}
          value={field.value}
          onValueChange={field.onChange}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
          emptyMessage={emptyMessage}
          className={comboboxStyles[variant]}
          contentClassName={comboboxContentStyles[variant]}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

/**
 * Render file upload field (for resumes, etc.)
 *
 * @example
 * renderFileUploadField("Upload your resume")
 */
export const renderFileUploadField = <T extends Record<string, any>>(
  accept: string,
  fieldOptions: FileUploadFieldOptions = {}
) => {
  const { label, required = false } = fieldOptions;

  return ({
    field: { value, onChange, ...fieldProps },
  }: {
    field: ControllerRenderProps<T, any>;
  }) => {
    const [fileName, setFileName] = useState<string>(() => {
      if (value) return value.name;
      if (typeof value === "string") return value;
      return "";
    });

    useEffect(() => {
      if (value) setFileName(value.name);
      else if (typeof value === "string") setFileName(value);
      else setFileName("");
    }, [value]);

    return (
      <FormItem>
        {label && (
          <FormLabel className="font-normal">
            {" "}
            {label}{" "}
            {required && <span className="text-destructive">*</span>}{" "}
          </FormLabel>
        )}

        <FormControl>
          <div className="relative w-fit">
            <Input
              type="file"
              id={`file-upload-${fieldProps.name}`}
              className="hidden"
              accept={accept}
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                if (file) {
                  onChange(file);
                  setFileName(file.name);
                } else {
                  e.target.value = "";
                  onChange(undefined);
                  setFileName("");
                }
              }}
              {...fieldProps}
            />
            <label
              htmlFor={`file-upload-${fieldProps.name}`}
              className="flex items-center gap-4 px-4 py-3 rounded-md cursor-pointer w-fit hover:outline hover:outline-white/50 duration-50"
            >
              {fileName ? (
                <>
                  <FileTextIcon size={24} />
                  <span className="text-white">{fileName}</span>
                </>
              ) : (
                <div className="flex flex-row gap-3">
                  <UploadSimpleIcon size={24} />
                  Resume
                </div>
              )}
            </label>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    );
  };
};

/**
 * Render multi-select checkbox group field
 *
 * @example
 * renderCheckboxGroupField("Prior Hackathon Experience", [
 *   "None", "Hacker", "Judge", "Mentor", "Organizer"
 * ])
 */
export const renderCheckboxGroupField = <T extends Record<string, any>>(
  options: string[],
  fieldOptions: CheckboxGroupFieldOptions = {}
) => {
  const { label, required = false } = fieldOptions;
  return ({ field }: { field: ControllerRenderProps<T, any> }) => (
    <FormItem>
      {label && (
        <FormLabel className="font-normal">
          {label} {required && <span className="text-destructive">*</span>}
        </FormLabel>
      )}

      <fieldset className="flex flex-col gap-3">
        {options.map((option) => (
          <FormItem key={option} className="flex items-center space-x-3 mb-0">
            <FormControl>
              <Checkbox
                checked={field.value?.includes(option)}
                onCheckedChange={(checked) => {
                  const isChecked = checked === true;
                  const newValue = Array.isArray(field.value)
                    ? [...field.value]
                    : [];
                  if (isChecked) {
                    newValue.push(option);
                  } else {
                    const index = newValue.indexOf(option);
                    if (index > -1) {
                      newValue.splice(index, 1);
                    }
                  }
                  field.onChange(newValue);
                }}
                className="!bg-transparent rounded-xs border-white data-[state=checked]:border-white w-4 h-4 hover:cursor-pointer"
              />
            </FormControl>
            <FormLabel className="font-normal text-base hover:cursor-pointer">
              {option}
            </FormLabel>
            <FormMessage />
          </FormItem>
        ))}
      </fieldset>
    </FormItem>
  );
};

// ============================================================================
// Named exports for compatibility with old usage patterns
// These work alongside the generic functions above
// ============================================================================

/**
 * Render text field for application forms (with label)
 */
export function renderTextFieldWithLabel<T extends Record<string, any>>(
  label: string,
  placeholder: string,
  inputProps?: Partial<ComponentProps<typeof Input>>
) {
  return renderTextField<T>(placeholder, {
    label,
    required: true,
    variant: "default",
    inputProps,
  });
}

/**
 * Render select field for application forms (with label)
 */
export function renderSelectFieldWithLabel<T extends Record<string, any>>(
  label: string,
  placeholder: string,
  options: string[],
  required: boolean = true
) {
  return renderSelectField<T>(placeholder, options, {
    label,
    required,
    variant: "application",
  });
}

/**
 * Render textarea field for application forms (with label)
 */
export function renderTextAreaFieldWithLabel<T extends Record<string, any>>(
  label: string,
  placeholder: string,
  textareaProps?: Partial<ComponentProps<typeof Textarea>>,
  required: boolean = true
) {
  return renderTextAreaField<T>(placeholder, {
    label,
    required,
    variant: "default",
    textareaProps,
  });
}

/**
 * Render radio field for application forms
 */
export function renderRadioFieldWithLabel<T extends Record<string, any>>(
  label: string
) {
  return renderRadioField<T>(label, { required: true });
}

/**
 * Render combobox field for application forms (with label)
 */
export function renderComboboxFieldWithLabel<T extends Record<string, any>>(
  label: string,
  placeholder: string,
  options: ComboboxOption[],
  required: boolean = true,
  searchPlaceholder?: string,
  emptyMessage?: string
) {
  return renderComboboxField<T>(placeholder, options, {
    label,
    required,
    variant: "application",
    searchPlaceholder,
    emptyMessage,
  });
}
