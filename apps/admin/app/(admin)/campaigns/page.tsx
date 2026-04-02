"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import ReactMarkdown, { type Components } from "react-markdown";
import { Send } from "lucide-react";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Spinner,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  renderMultiSelectDropdownField,
  renderTextField,
} from "@uwdsc/ui";
import {
  CAMPAIGN_RECIPIENT_ROLES,
  sendCampaignSchema,
  type CampaignRecipientRole,
  type SendCampaignFormValues,
} from "@/lib/schemas/emails";
import { sendCampaign } from "@/lib/api/emails";

const MARKDOWN_COMPONENTS: Components = {
  h1: ({ children }) => <h1 className="mb-4 text-2xl font-bold">{children}</h1>,
  h2: ({ children }) => <h2 className="mb-3 text-xl font-semibold">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-2 text-lg font-semibold">{children}</h3>,
  p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="mb-4 list-inside list-disc space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 list-inside list-decimal space-y-1">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children }) => (
    <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="mb-4 overflow-x-auto rounded-md bg-muted p-4 font-mono text-sm">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-4 border-l-4 border-muted-foreground/30 pl-4 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a href={href} className="text-primary underline">
      {children}
    </a>
  ),
  hr: () => <hr className="my-4 border-t border-muted" />,
};

export default function CampaignsPage() {
  const [isSending, setIsSending] = useState(false);

  const form = useForm<SendCampaignFormValues>({
    resolver: zodResolver(sendCampaignSchema),
    mode: "onChange",
    defaultValues: {
      subject: "",
      recipientRoles: [] as CampaignRecipientRole[],
      body: "",
    },
  });

  const {
    formState: { isValid },
  } = form;

  const body = useWatch({ control: form.control, name: "body" }) ?? "";

  const onSubmit = async (values: SendCampaignFormValues) => {
    try {
      setIsSending(true);
      await sendCampaign(values);
      toast.success("Campaign sent successfully!");
      form.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send campaign");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4">
        <h1 className="text-3xl font-bold">Email Campaigns</h1>
        <p className="text-muted-foreground">
          Compose and send email campaigns to club members.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl space-y-6">
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="subject"
              render={renderTextField({
                label: "Subject",
                placeholder: "Email subject...",
                required: true,
              })}
            />
            <FormField
              control={form.control}
              name="recipientRoles"
              render={renderMultiSelectDropdownField({
                label: "Recipients",
                required: true,
                emptyPlaceholder: "Select audiences",
                options: CAMPAIGN_RECIPIENT_ROLES,
              })}
            />
          </div>

          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Body</FormLabel>
                <Tabs defaultValue="write" className="w-full gap-0">
                  <TabsList className=" justify-start rounded-b-none border-b-0">
                    <TabsTrigger value="write">Write</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>

                  <TabsContent value="write" className="mt-0">
                    <FormControl>
                      <Textarea
                        placeholder="Write your email body in Markdown..."
                        className="min-h-[420px] resize-y rounded-tl-none font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                  </TabsContent>

                  <TabsContent value="preview" className="mt-0">
                    <div className="min-h-[420px] rounded-md rounded-tl-none border bg-background p-4 text-sm">
                      {body.trim() ? (
                        <ReactMarkdown components={MARKDOWN_COMPONENTS}>{body}</ReactMarkdown>
                      ) : (
                        <p className="italic text-muted-foreground">
                          Nothing to preview yet — write some Markdown in the Write tab.
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSending || !isValid} className="gap-2 rounded-lg">
            {isSending ? (
              <>
                <Spinner className="size-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send Campaign
                <Send className="size-4" />
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
