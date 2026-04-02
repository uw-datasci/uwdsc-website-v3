"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@uwdsc/ui";
import {
  sendCampaignSchema,
  type SendCampaignFormValues,
} from "@/lib/schemas/emails";
import { sendCampaign } from "@/lib/api/emails";

const markdownComponents: Components = {
  h1: ({ children }) => <h1 className="mb-4 text-2xl font-bold">{children}</h1>,
  h2: ({ children }) => (
    <h2 className="mb-3 text-xl font-semibold">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 text-lg font-semibold">{children}</h3>
  ),
  p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
  ul: ({ children }) => (
    <ul className="mb-4 list-inside list-disc space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 list-inside list-decimal space-y-1">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children }) => (
    <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">
      {children}
    </code>
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
    defaultValues: { subject: "", recipients: "", body: "" },
  });

  const body = form.watch("body");

  const onSubmit = async (values: SendCampaignFormValues) => {
    try {
      setIsSending(true);
      await sendCampaign(values);
      toast.success("Campaign sent successfully!");
      form.reset();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to send campaign",
      );
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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-4xl space-y-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Email subject..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recipients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipients</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email1@example.com, email2@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Body</FormLabel>
                <Tabs defaultValue="write" className="w-full">
                  <TabsList className="mb-0 rounded-b-none border-b-0">
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
                    <div className="min-h-[420px] rounded-md border bg-background p-4 text-sm">
                      {body.trim() ? (
                        <ReactMarkdown components={markdownComponents}>
                          {body}
                        </ReactMarkdown>
                      ) : (
                        <p className="italic text-muted-foreground">
                          Nothing to preview yet — write some Markdown in the
                          Write tab.
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSending} className="gap-2">
            <Send className="size-4" />
            {isSending ? "Sending..." : "Send Campaign"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
