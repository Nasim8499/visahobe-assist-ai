import { motion } from "framer-motion";
import { AIOrb } from "@/components/AIOrb";
import { PromptBox } from "@/components/PromptBox";
import { useApp } from "@/contexts/AppContext";
import { ChatView } from "@/components/ChatView";

export const Assistant = () => {
  const { activeSession } = useApp();
  const hasChat = activeSession && activeSession.messages.length > 0;

  if (hasChat) {
    return (
      <div className="relative mx-auto flex h-full max-w-3xl flex-col gap-4 px-4 py-6">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-40" />
        <ChatView />
        <div className="sticky bottom-4">
          <PromptBox compact />
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-4 pt-16 sm:pt-24">
      {/* Futuristic backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-grid opacity-50" />
      <div className="pointer-events-none absolute inset-x-0 top-6 -z-10 mx-auto h-80 w-80 rounded-full opacity-40 blur-3xl orb" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center"
      >
        <AIOrb size={108} />
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          How can I help <span className="text-gradient">VisaHOBe</span> today?
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-8 w-full"
      >
        <PromptBox />
      </motion.div>
    </div>
  );
};
