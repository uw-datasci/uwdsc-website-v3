"use client";
import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import echo1 from "@/public/graphics/echo-1.png";
import echo2 from "@/public/graphics/echo-2.png";
import InputFeedback from "../home/InputFeedback";
import { renderTextField, Form, FormField, Button } from "@uwdsc/ui";
import {
  mailingListDefaultValues,
  MailingListFormValues,
  mailingListSchema,
} from "@/lib/schemas/mailing-list";

export default function MailingList() {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const form = useForm<MailingListFormValues>({
    resolver: zodResolver(mailingListSchema),
    defaultValues: mailingListDefaultValues,
  });

  const onSubmit = async (data: MailingListFormValues) => {
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      console.log(data.email);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // TODO: Implement actual API call here
      // await subscribeToMailingList(data.email);

      setSuccess(true);
      form.reset();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please refresh the page and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mb-section relative overflow-hidden w-full">
      <Image
        src={echo1}
        alt="echo 1"
        className="absolute -bottom-[10%] md:-bottom-[20%] -left-[10%] md:-left-[5%] w-[50%] opacity-20"
      />
      <Image
        src={echo2}
        alt="echo 2"
        className="absolute bottom-0 md:-bottom-[5%] -right-[20%] md:-right-[5%] w-[50%] opacity-20 md:w-[35%]"
      />

      <div className="relative">
        <div className="bg-gradient-purple absolute inset-0 opacity-20" />
        <div className="mx-container relative z-10">
          <div className="pb-12 pt-8 sm:pb-18 sm:pt-12 lg:pb-24 lg:pt-18 xl:pb-36 xl:pt-24">
            <h2 className="mx-auto mb-4 max-w-97.5 text-center text-3xl sm:text-5xl md:text-6xl font-bold text-white sm:max-w-120  md:mb-6 md:max-w-135 xl:max-w-160">
              Stay up to date on Data Science Club events
            </h2>
            <p className="mb-8 text-center leading-loose text-white sm:mb-10 sm:text-lg md:mb-12 md:text-xl xl:text-2xl">
              Join our mailing list! No spam, we promise :D
            </p>
            <div className="relative">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className={`mx-auto max-w-170 ${
                    loading ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  <div className="relative flex flex-col gap-2 sm:flex-row sm:gap-0">
                    <div className="flex-1">
                      <FormField
                        control={form.control}
                        name="email"
                        render={renderTextField({
                          placeholder: "Enter your email",
                          className:
                            "w-full rounded-full! border border-grey1! bg-grey4! h-auto! py-3.5 pl-4.5 text-white outline-none placeholder:text-grey1! md:px-6 md:py-4.5 pr-32 md:text-lg",
                          inputProps: { type: "email" },
                        })}
                      />
                    </div>
                    <Button
                      size="lg"
                      type="submit"
                      disabled={loading}
                      className="w-auto! absolute right-2 top-1.75 md:top-2.25 bottom-1 rounded- bg-gradient-purple md:text-lg font-bold p-4 md:p-6"
                    >
                      {loading ? (
                        <Loader2
                          className="w-5 h-5 animate-spin"
                          strokeWidth={3}
                        />
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </div>

                  {error && (
                    <InputFeedback state="error">{error}</InputFeedback>
                  )}
                  {success && (
                    <InputFeedback state="success">
                      Success! Thank you for joining our mailing list.
                    </InputFeedback>
                  )}
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
