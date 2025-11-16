import { AppFormValues } from "@/lib/schemas/application";
import AppSection from "../AppSection";
import { UseFormReturn } from "react-hook-form";
import {
  BookIcon,
  CalendarIcon,
  DiscordLogoIcon,
  EnvelopeSimpleIcon,
  FileTextIcon,
  GenderIntersexIcon,
  GithubLogoIcon,
  GlobeIcon,
  GraduationCapIcon,
  HamburgerIcon,
  IdentificationCardIcon,
  LightbulbIcon,
  LinkedinLogoIcon,
  LinkIcon,
  PhoneIcon,
  SmileyIcon,
  TrophyIcon,
  TShirtIcon,
  UsersIcon,
  XLogoIcon,
} from "@uwdsc/ui/index";
import React from "react";
import {
  APP_Q_FIELDS,
  CONTACT_INFO_FIELDS,
  LINKS_FIELDS,
  OPTIONAL_ABOUT_YOU_FIELDS,
  PRIOR_HACK_EXP_FIELDS,
  UNIVERSITY_INFO_FIELDS,
} from "@/constants/application";

interface ReviewProps {
  readonly form: UseFormReturn<AppFormValues>;
}

interface InfoRowProps {
  form: UseFormReturn<AppFormValues>;
  label: string;
  icon: React.ReactNode;
}

interface SectionReviewCardProps {
  form: UseFormReturn<AppFormValues>;
  iconArr: React.ReactNode[];
  labelArr: string[];
}
const NO_INPUT = "???";

const InfoRow = ({ form, label, icon }: InfoRowProps) => {
  const value = form.getValues(label as keyof AppFormValues);
  const isName = label === "name";
  // Check if this is a link field
  const isLinkField =
    Object.values(LINKS_FIELDS).includes(label as any) &&
    label !== LINKS_FIELDS.resume;

  // Handle different value types
  const displayValue = React.useMemo(() => {
    if (value instanceof File) {
      return value.name;
    }
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(", ") : NO_INPUT;
    }

    // For fields that have an "other" variant
    const otherFieldName = `${label}_other` as keyof AppFormValues;
    const mainValue = String(value || NO_INPUT);

    // If the main field is "Other", use the other field's value
    if (
      mainValue.toLowerCase() === "other" &&
      otherFieldName in form.getValues()
    ) {
      const otherValue = form.getValues(otherFieldName);
      return String(otherValue || NO_INPUT);
    }

    return mainValue || NO_INPUT;
  }, [value, label, form]);

  // Don't render if this is an "_other" field (it's handled by the parent field)
  if (label.endsWith("_other")) {
    return null;
  }

  return (
    <div className="flex flex-row gap-3 items-center min-w-0">
      <div className="flex-shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        {isLinkField && displayValue !== NO_INPUT ? (
          <a
            className="underline decoration-1 break-words"
            href={displayValue}
            target="_blank"
            rel="noopener noreferrer"
          >
            {displayValue}
          </a>
        ) : (
          // TODO: replace name with fetched name from user
          <p className="break-words">{isName ? "John Doe" : displayValue}</p>
        )}
      </div>
    </div>
  );
};

const SectionReviewCard = ({
  form,
  iconArr,
  labelArr,
}: SectionReviewCardProps) => {
  // Filter out "_other" fields from the display
  const filteredLabels = labelArr.filter((label) => !label.endsWith("_other"));

  return (
    <div className="bg-cxc-input-bg p-4 flex flex-col gap-2">
      {filteredLabels.map((label, i) => {
        // Find the original index to get the correct icon
        const originalIndex = labelArr.indexOf(label);
        return (
          <InfoRow
            key={label}
            form={form}
            label={label}
            icon={iconArr[originalIndex]}
          />
        );
      })}
    </div>
  );
};

const ContactIcons = [
  <IdentificationCardIcon size={24} />,
  <EnvelopeSimpleIcon key="email" size={24} />,
  <PhoneIcon key="phone" size={24} />,
  <DiscordLogoIcon key="discord" size={24} />,
];

const OptionalAboutYouIcons = [
  <TShirtIcon key="tshirt" size={24} />,
  <HamburgerIcon key="food" size={24} />,
  null, // placeholder for dietary_restrictions_other (won't be shown)
  <GenderIntersexIcon key="gender" size={24} />,
  <GlobeIcon key="globe" size={24} />,
];

const UniIcons = [
  <GraduationCapIcon key="grad" size={24} />,
  null, // placeholder for university_name_other
  <BookIcon key="book" size={24} />,
  null, // placeholder for program_other
  <CalendarIcon key="cal" size={24} />,
];

const PriorHackExpIcons = [
  <TrophyIcon key="trophy" size={24} />,
  <UsersIcon key="users" size={24} />,
];

const LinksIcons = [
  <GithubLogoIcon key="github" size={24} />,
  <LinkedinLogoIcon key="linkedin" size={24} />,
  <XLogoIcon key="x" size={24} />,
  <LinkIcon key="link" size={24} />,
  <FileTextIcon key="resume" size={24} />,
];

const CxCAppIcons = [
  <LightbulbIcon key="bulb" size={24} />,
  <SmileyIcon key="smiley" size={24} />,
];

export function Review({ form }: ReviewProps) {
  return (
    <div>
      <AppSection
        label="Here's a summary for you to review:"
        description="Everything looks good? Press the button below!"
      >
        <SectionReviewCard
          form={form}
          iconArr={ContactIcons}
          labelArr={["name", ...Object.values(CONTACT_INFO_FIELDS)]}
        />
        <SectionReviewCard
          form={form}
          iconArr={OptionalAboutYouIcons}
          labelArr={Object.values(OPTIONAL_ABOUT_YOU_FIELDS)}
        />
        <SectionReviewCard
          form={form}
          iconArr={UniIcons}
          labelArr={Object.values(UNIVERSITY_INFO_FIELDS)}
        />
        <SectionReviewCard
          form={form}
          iconArr={PriorHackExpIcons}
          labelArr={Object.values(PRIOR_HACK_EXP_FIELDS)}
        />
        <SectionReviewCard
          form={form}
          iconArr={LinksIcons}
          labelArr={Object.values(LINKS_FIELDS)}
        />
        <SectionReviewCard
          form={form}
          iconArr={CxCAppIcons}
          labelArr={Object.values(APP_Q_FIELDS)}
        />
      </AppSection>
    </div>
  );
}
