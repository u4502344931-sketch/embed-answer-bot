import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Essentials",
    price: 29,
    description: "For businesses beginning their journey",
    popular: false,
    features: [
      "500 conversations monthly",
      "2 widget styles",
      "10 pages indexed",
      "Core analytics",
      "Standard branding",
    ],
  },
  {
    name: "Professional",
    price: 79,
    description: "For brands that demand more",
    popular: true,
    features: [
      "2,000 conversations monthly",
      "Complete customization",
      "50 pages indexed",
      "Advanced analytics",
      "Custom avatar & colors",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: null,
    description: "Bespoke solutions for distinguished organizations",
    popular: false,
    features: [
      "Unlimited conversations",
      "Unlimited pages",
      "Full white-label",
      "Advanced analytics & export",
      "Dedicated support",
      "Custom integrations",
    ],
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 md:py-36">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header - Elegant */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <p className="text-sm text-primary uppercase tracking-widest mb-4">Investment</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-6">
            Transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Select the plan that aligns with your ambitions. Upgrade anytime.
          </p>
        </motion.div>

        {/* Pricing cards - Premium design */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl ${
                plan.popular
                  ? "bg-foreground text-card border-0 shadow-premium scale-[1.02]"
                  : "bg-card border border-border"
              }`}
            >
              {/* Popular indicator - Subtle */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground rounded-full px-4 py-1 text-xs font-medium tracking-wide">
                    Recommended
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan header */}
                <div className="mb-8">
                  <h3 className="font-serif text-xl font-medium mb-2">{plan.name}</h3>
                  <p className={`text-sm ${plan.popular ? "text-card/70" : "text-muted-foreground"}`}>
                    {plan.description}
                  </p>
                </div>

                {/* Price - Elegant display */}
                <div className="mb-8 pb-8 border-b border-current/10">
                  {plan.price !== null ? (
                    <div className="flex items-baseline">
                      <span className="font-serif text-4xl font-medium">€{plan.price}</span>
                      <span className={`ml-2 text-sm ${plan.popular ? "text-card/60" : "text-muted-foreground"}`}>/month</span>
                    </div>
                  ) : (
                    <div className="font-serif text-4xl font-medium">Custom</div>
                  )}
                </div>

                {/* Features list - Clean */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start space-x-3"
                    >
                      <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.popular ? "text-primary" : "text-primary"}`} />
                      <span className={`text-sm ${plan.popular ? "text-card/90" : "text-foreground"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA - Contextual styling */}
                <Link to="/signup">
                  <Button
                    className={`w-full ${
                      plan.popular 
                        ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                        : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.price !== null ? "Begin today" : "Contact us"}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note - Refined */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-muted-foreground mt-16"
        >
          14-day trial included with every plan. No commitment required.
        </motion.p>
      </div>
    </section>
  );
};

export default Pricing;
