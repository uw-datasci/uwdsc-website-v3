import { GENERAL_FAQ } from "@/constants/home";
import { MEMBERSHIP_PAYMENT_URL } from "@/constants/membership";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@uwdsc/ui";

export default function Faq() {
  return (
    // emulate mx-container with padding instead bc of w-full
    <section className="px-7 sm:px-9 md:px-12 xl:max-w-300 mb-section gap-8 md:gap-14 grid lg:grid-cols-[4fr_5fr] w-full">
      <h2 className="text-4xl font-bold text-white md:text-5xl">
        Frequently Asked Questions
      </h2>
      <Accordion type="multiple" className="w-full!">
        {GENERAL_FAQ.map((faq, i) => {
          const lines = faq.answer.split("\n").map((line, i) => (
            <p
              className={`leading-[1.75] text-grey1 text-sm md:text-base`}
              key={i}
            >
              {line}
            </p>
          ));
          return (
            <AccordionItem
              value={`item-${i}`}
              key={faq.id}
              className="border-grey3!"
            >
              <AccordionTrigger
                className={`hover:no-underline hover:cursor-pointer font-bold text-lg ${i === 0 ? "pb-5 pt-0 lg:pb-7" : "py-5 lg:py-7"} `}
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4">
                {lines}
                {faq.showMembershipPayLink ? (
                  <p className="leading-[1.75] text-grey1 text-sm md:text-base">
                    <a
                      href={MEMBERSHIP_PAYMENT_URL}
                      className="font-semibold text-white underline underline-offset-2 hover:opacity-90"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Pay DSC membership online
                    </a>
                  </p>
                ) : null}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </section>
  );
}
