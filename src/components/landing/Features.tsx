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
    title: "Intelligent Content Learning",
    description: "Your AI assistant studies every page, understanding context and nuance to provide accurate, thoughtful responses.",
  },
  {
    icon: Zap,
    title: "Instant, Considered Answers",
    description: "Visitors receive immediate, well-crafted responses that reflect your brand's attention to detail.",
  },
  {
    icon: Palette,
    title: "Seamless Brand Integration",
    description: "Every element can be tailored to your aesthetic—colors, typography, and tone of voice.",
  },
  {
    icon: Code2,
    title: "Effortless Implementation",
    description: "A single, elegant code snippet. Works beautifully with any platform you've chosen.",
  },
  {
    icon: BarChart3,
    title: "Insightful Analytics",
    description: "Understand what your visitors truly need. Turn conversations into opportunities.",
  },
  {
    icon: Shield,
    title: "Enterprise Sophistication",
    description: "White-label capabilities for agencies and brands that demand complete ownership.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 md:py-36 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header - Elegant */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <p className="text-sm text-primary uppercase tracking-widest mb-4">Capabilities</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-6 leading-tight">
            Crafted for excellence
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Every feature designed with intention. Every interaction, an opportunity to impress.
          </p>
        </motion.div>

        {/* Features grid - Premium cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group"
            >
              <div className="h-full p-8 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-premium transition-all duration-500">
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-500">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-medium mb-3">{feature.title}</h3>
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
