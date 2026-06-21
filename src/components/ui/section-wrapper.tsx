import { motion, type MotionProps } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionWrapperProps extends MotionProps {
  id?: string;
  className?: string;
  children: ReactNode;
  containerClassName?: string;
}

const SectionWrapper = ({ id, className, children, containerClassName, ...motionProps }: SectionWrapperProps) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn("relative py-20 md:py-28", className)}
      {...motionProps}
    >
      <div className={cn("container relative", containerClassName)}>{children}</div>
    </motion.section>
  );
};

export default SectionWrapper;
