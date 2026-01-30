import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, X, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: 29,
    description: "Perfect for small businesses just getting started",
    popular: false,
    features: [
      { text: "500 conversations/month", included: true },
      { text: "2 widget templates", included: true },
      { text: "10 pages to crawl", included: true },
      { text: "Basic analytics", included: true },
      { text: "SiteWise branding + mascot", included: true },
      { text: "Color customization", included: false },
      { text: "Custom avatar", included: false },
      { text: "White-label option", included: false },
    ],
  },
  {
    name: "Pro",
    price: 79,
    description: "For growing businesses that need more power",
    popular: true,
    features: [
      { text: "2,000 conversations/month", included: true },
      { text: "2 widget templates", included: true },
      { text: "50 pages to crawl", included: true },
      { text: "Advanced analytics", included: true },
      { text: "\"Powered by SiteWise.ai\" only", included: true },
      { text: "Full color customization", included: true },
      { text: "Custom avatar", included: true },
      { text: "White-label option", included: false },
    ],
  },
  {
    name: "Enterprise",
    price: null,
    description: "For agencies and large organizations",
    popular: false,
    features: [
      { text: "Unlimited conversations", included: true },
      { text: "2 widget templates", included: true },
      { text: "Unlimited pages to crawl", included: true },
      { text: "Advanced analytics + export", included: true },
      { text: "Full white-label", included: true },
      { text: "Full color customization", included: true },
      { text: "Custom avatar", included: true },
      { text: "Priority support", included: true },
    ],
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 md:py-32">
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
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free, upgrade when you need more. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl border ${
                plan.popular
                  ? "border-primary bg-card shadow-xl scale-105"
                  : "border-border bg-card"
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center space-x-1 bg-primary text-primary-foreground rounded-full px-4 py-1 text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="p-6 lg:p-8">
                {/* Plan header */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  {plan.price !== null ? (
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground ml-2">/month</span>
                    </div>
                  ) : (
                    <div className="text-4xl font-bold">Custom</div>
                  )}
                </div>

                {/* CTA */}
                <Link to="/signup">
                  <Button
                    className="w-full mb-6"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.price !== null ? "Get Started" : "Contact Sales"}
                  </Button>
                </Link>

                {/* Features list */}
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start space-x-3"
                    >
                      {feature.included ? (
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={
                          feature.included
                            ? "text-foreground"
                            : "text-muted-foreground/50"
                        }
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center text-muted-foreground mt-12"
        >
          All plans include a 14-day free trial. No credit card required.
        </motion.p>
      </div>
    </section>
  );
};

export default Pricing;
