import { createFileRoute } from "@tanstack/react-router";
import { NotificationsContent } from "@/components/softly/NotificationsContent";

export const Route = createFileRoute("/_shell/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Softlynest" }] }),
  component: Notifications,
});

function Notifications() {
  return (
    <div className="w-full">
      <NotificationsContent />
    </div>
  );
}
