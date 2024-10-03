import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Props = {};

const faqData = [
  {
    question: "How does Gearyo work?",
    answer:
      "Gearyo connects you with trusted rental providers for adventure sports gear. Simply enter your preferences, and we'll recommend the best gear from local providers. You can compare options and book directly through our platform.",
  },
  {
    question: "What types of gear can I rent on Gearyo?",
    answer:
      "You can rent a wide range of adventure sports equipment, including skis, snowboards, hiking gear, mountain bikes, and more. We're constantly expanding our selection to cover more sports and activities.",
  },
  {
    question: "How do I know the gear is high-quality?",
    answer:
      "Gearyo partners only with trusted rental providers who meet strict quality standards. Each provider is rated by previous customers, so you can see feedback on the gear and service before you book.",
  },
  {
    question: "How long can I rent gear for?",
    answer:
      "You can rent gear for as long as you need, from just a few hours to several days or weeks. We offer flexible rental durations to suit your adventure.",
  },
  {
    question: "Is there a delivery option, or do I need to pick up the gear?",
    answer:
      "Some rental providers offer delivery options, while others may require you to pick up the gear. You can see the available options during the booking process.",
  },
  {
    question: "What happens if the gear gets damaged?",
    answer:
      "Each rental provider has their own policy regarding damages. We recommend reviewing these policies during the booking process. Some providers may offer insurance options to cover potential damage.",
  },
  {
    question: "Can I cancel or modify my booking?",
    answer:
      "Yes, cancellations and modifications are possible, depending on the provider's policy. Check the specific rental terms when booking to understand cancellation windows and fees.",
  },
  {
    question: "How do payments work?",
    answer:
      "Payments are processed securely through our platform. You can pay for your rental gear using a credit card or other available payment options at checkout.",
  },
  {
    question: "Do you offer any insurance for the rented gear?",
    answer:
      "Insurance for rented gear is handled by the individual vendors. Most vendors will indicate whether they offer insurance as part of their service, so be sure to check their policy during the booking process. If you have any questions, you can contact the vendor directly through our platform.",
  },
  {
    question: "How can I contact the rental provider if I have a question?",
    answer:
      "You can message the rental provider directly through our platform if you have any questions or special requests before or after your booking.",
  },
];
const FAQSection = (props: Props) => {
  return (
    <section className="w-full py-8 flex items-center justify-center">
      <Card className="md:w-[50vw]">
        <CardHeader>
          <h1 className="text-4xl">FAQ</h1>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((faq, index) => (
              <AccordionItem value={`item-${index + 1}`} key={index}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );
};

export default FAQSection;
