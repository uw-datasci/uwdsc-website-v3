import { FACULTY_OPTIONS, TERM_OPTIONS } from "@/constants/profile";
import type { PassportProfileEditValues } from "@/lib/schemas/profile";
import { Form, FormField, renderSelectField, renderTextField } from "@uwdsc/ui";
import type { UseFormReturn } from "react-hook-form";

interface ProfileEditFormProps {
  readonly form: UseFormReturn<PassportProfileEditValues>;
  readonly onSubmit: (data: PassportProfileEditValues) => void | Promise<void>;
}

export function ProfileEditForm({ form, onSubmit }: ProfileEditFormProps) {
  return (
    <Form {...form}>
      <form
        id="passport-profile-edit"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="first_name"
          render={renderTextField({
            label: "First Name",
            placeholder: "First name",
          })}
        />

        <FormField
          control={form.control}
          name="last_name"
          render={renderTextField({
            label: "Last Name",
            placeholder: "Last name",
          })}
        />

        <FormField
          control={form.control}
          name="wat_iam"
          render={renderTextField({
            label: "WatIAM Username",
            placeholder: "e.g. j3smith",
          })}
        />

        <FormField
          control={form.control}
          name="faculty"
          render={renderSelectField({
            label: "Faculty",
            placeholder: "Select faculty",
            options: FACULTY_OPTIONS,
            contentPosition: "popper",
            triggerClassName: "w-full",
            contentClassName: "w-full",
          })}
        />

        <FormField
          control={form.control}
          name="term"
          render={renderSelectField({
            label: "Current Term",
            placeholder: "Select term",
            options: TERM_OPTIONS,
            contentPosition: "popper",
            triggerClassName: "w-full",
            contentClassName: "w-full",
          })}
        />
      </form>
    </Form>
  );
}
