import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the content learning work?",
    answer:
      "Simply provide your website URL. Our intelligent system analyzes every page, understanding context, products, services, and nuances to create a comprehensive knowledge base for your assistant.",
  },
  {
    question: "What's the typical setup time?",
    answer:
      "Most businesses are operational within five minutes. Add your URL, allow a brief moment for analysis, customize your widget's appearance, and implement the provided code.",
  },
  {
    question: "How accurate are the responses?",
    answer:
      "The assistant responds exclusively based on your content. When uncertain, it gracefully acknowledges limitations and offers to connect visitors with your team directly.",
  },
  {
    question: "Can the widget match our brand?",
    answer:
      "Absolutely. Professional and Enterprise plans include complete customization—colors, avatars, positioning, and welcome messages. Enterprise additionally offers full white-labeling.",
  },
  {
    question: "Which platforms are supported?",
    answer:
      "Every platform. A single line of JavaScript integrates seamlessly. We provide detailed guides for WordPress, Shopify, Webflow, Squarespace, and custom implementations.",
  },
  {
    question: "How are conversations measured?",
    answer:
      "A conversation encompasses an entire chat session with a visitor. Multiple messages within one session count as a single conversation. Sessions conclude after 30 minutes of inactivity.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24 md:py-36 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header - Elegant */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-sm text-primary uppercase tracking-widest mb-4">Questions</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-6">
            Common inquiries
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about SiteWise
          </p>
        </motion.div>

        {/* FAQ Accordion - Premium styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-sm transition-shadow"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline py-5 [&[data-state=open]]:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
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
