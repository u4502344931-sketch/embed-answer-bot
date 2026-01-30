import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 md:py-36">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-foreground px-8 py-20 md:px-16 md:py-28 text-center"
        >
          {/* Subtle background texture */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_white_0%,_transparent_50%)]" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,_white_0%,_transparent_50%)]" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-card mb-6 leading-tight">
              Ready to elevate your customer experience?
            </h2>
            <p className="text-lg md:text-xl text-card/70 mb-10 max-w-lg mx-auto leading-relaxed">
              Join discerning brands using SiteWise to provide exceptional, 
              intelligent support—every hour of every day.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="w-full sm:w-auto group bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12"
                >
                  Start your trial
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <a href="#pricing">
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full sm:w-auto text-card/80 hover:text-card hover:bg-card/10 h-12"
                >
                  View pricing
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
