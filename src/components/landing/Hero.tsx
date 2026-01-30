import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import ChatWidgetDemo from "./ChatWidgetDemo";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-36 overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/30 via-background to-background" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center lg:text-left"
          >
            {/* Refined badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center space-x-2 border border-border bg-card/50 backdrop-blur-sm rounded-full px-4 py-2 text-sm mb-8"
            >
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-muted-foreground">Intelligent customer support</span>
            </motion.div>

            {/* Elegant headline with serif */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight mb-8 leading-[1.1]">
              <span className="text-shadow">Your content,</span>
              <br />
              <span className="gradient-text">answering questions</span>
              <br />
              <span className="text-shadow">beautifully</span>
            </h1>

            {/* Refined subheadline */}
            <p className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Create an AI assistant that understands your website completely. 
              Elegant, intelligent support—around the clock.
            </p>

            {/* Premium CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto group text-base px-8 h-12 shadow-premium">
                  Start free trial
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto text-base h-12 text-muted-foreground hover:text-foreground">
                  Discover more
                </Button>
              </a>
            </div>

            {/* Elegant social proof */}
            <div className="mt-14 pt-10 border-t border-border/50">
              <p className="text-sm text-muted-foreground mb-6 tracking-wide uppercase">
                Trusted by discerning brands
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-10 opacity-40 hover:opacity-60 transition-opacity">
                <span className="font-serif text-xl tracking-tight">Maison</span>
                <span className="font-serif text-xl tracking-tight">Atelier Co.</span>
                <span className="font-serif text-xl tracking-tight">Sterling</span>
              </div>
            </div>
          </motion.div>

          {/* Right content - Widget Demo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
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
