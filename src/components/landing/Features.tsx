import { motion } from "framer-motion";
import { 
  Globe, 
  Zap, 
  Palette, 
  BarChart3, 
  Code2, 
  Shield 
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Auto-Learn from Your Website",
    description: "Simply paste your URL and our AI crawls your entire site, learning your content, products, and services automatically.",
  },
  {
    icon: Zap,
    title: "Instant Responses 24/7",
    description: "Your AI assistant never sleeps. Visitors get accurate answers in seconds, reducing wait times and support tickets.",
  },
  {
    icon: Palette,
    title: "Fully Customizable Widget",
    description: "Match your brand with custom colors, avatars, and positioning. Choose from chat panel or floating bubble styles.",
  },
  {
    icon: Code2,
    title: "Easy Integration",
    description: "Add a single line of code to any website. Works with WordPress, Shopify, Webflow, and custom sites.",
  },
  {
    icon: BarChart3,
    title: "Conversation Analytics",
    description: "Understand what your visitors ask most. Use insights to improve your content and product offerings.",
  },
  {
    icon: Shield,
    title: "Enterprise Ready",
    description: "White-label option for agencies. Remove all branding and make it truly yours with our Enterprise plan.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 md:py-32 bg-muted/30">
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
            Everything you need to{" "}
            <span className="gradient-text">delight customers</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features that help you provide instant, accurate support 
            without the overhead of a large support team.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-6 lg:p-8 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
