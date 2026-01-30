import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import ChatWidgetDemo from "./ChatWidgetDemo";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/50 to-background -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center space-x-2 bg-accent text-accent-foreground rounded-full px-4 py-1.5 text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI-powered customer support</span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Your website content,{" "}
              <span className="gradient-text">instantly answering</span>{" "}
              visitor questions
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Create an AI chatbot that knows your website inside out. Simply add a widget, 
              and let it handle customer questions 24/7.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto group">
                  Start for free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="#demo">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  See it in action
                </Button>
              </a>
            </div>

            {/* Social proof */}
            <div className="mt-10 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">
                Trusted by 500+ businesses worldwide
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-8 opacity-60">
                <div className="text-xl font-semibold">TechCorp</div>
                <div className="text-xl font-semibold">StartupX</div>
                <div className="text-xl font-semibold">Agency.io</div>
              </div>
            </div>
          </motion.div>

          {/* Right content - Widget Demo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <ChatWidgetDemo />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
