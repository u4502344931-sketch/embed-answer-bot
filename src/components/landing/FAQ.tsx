import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does SiteWise.ai learn my website content?",
    answer:
      "Simply paste your website URL, and our AI crawler will automatically scan and index all your pages. We extract text content, product information, FAQs, and more. You can also manually upload documents or paste text for additional context.",
  },
  {
    question: "How long does it take to set up?",
    answer:
      "Most businesses are up and running in under 5 minutes. After signing up, you add your website URL, wait for the crawl to complete (usually 1-2 minutes for most sites), customize your widget, and copy the embed code to your site.",
  },
  {
    question: "What if the AI gives wrong answers?",
    answer:
      "The AI only answers based on your actual website content. If it doesn't know something, it will say so and offer to connect the visitor with a human. You can also view conversation logs to improve your content based on common questions.",
  },
  {
    question: "Can I customize the widget's appearance?",
    answer:
      "Yes! Pro and Enterprise plans include full customization options: choose colors to match your brand, upload a custom avatar, adjust positioning, and set a personalized welcome message. Enterprise plans also include complete white-labeling.",
  },
  {
    question: "Does it work with my website platform?",
    answer:
      "Yes! SiteWise.ai works with any website. Just copy and paste a single line of JavaScript code. We have specific guides for WordPress, Shopify, Webflow, Squarespace, Wix, and custom sites.",
  },
  {
    question: "What counts as a 'conversation'?",
    answer:
      "A conversation is a complete chat session between your widget and a visitor. Multiple messages within the same session count as one conversation. Sessions reset after 30 minutes of inactivity.",
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer:
      "Absolutely! You can change your plan anytime. When upgrading, you get immediate access to new features. When downgrading, changes take effect at the next billing cycle.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes! All plans include a 14-day free trial with full access to features. No credit card required to start. You can cancel anytime during the trial.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Frequently asked questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about SiteWise.ai
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base font-medium hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
