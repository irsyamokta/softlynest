import { createFileRoute, Link } from "@tanstack/react-router";
import { Send } from "lucide-react";

export const Route = createFileRoute("/_shell/messages/")({
  component: MessagesIndex,
});

function MessagesIndex() {
  return (
    <div className="hidden md:flex flex-col items-center justify-center h-full text-center px-4">
      <div className="w-20 h-20 rounded-full border-2 border-foreground flex items-center justify-center mb-4">
        <Send className="w-8 h-8 text-foreground" strokeWidth={2.5} />
      </div>
      <h3 className="text-xl font-bold text-foreground">Your Messages</h3>
      <p className="text-muted-foreground mt-2 mb-6 text-sm max-w-xs">
        Send private messages to a friend and stay connected.
      </p>
      <Link
        to="/search"
        search={{ q: "" }}
        className="inline-block px-6 py-2.5 rounded-full bg-cyan text-white font-bold text-sm hover:bg-cyan/90 transition shadow-sm"
      >
        Find people
      </Link>
    </div>
  );
}
