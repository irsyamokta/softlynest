import { createFileRoute } from "@tanstack/react-router";
import { SettingsContent } from "@/components/softly/SettingsContent";

export const Route = createFileRoute("/_shell/settings")({
  head: () => ({ meta: [{ title: "Settings — Softlynest" }] }),
  component: Settings,
});

function Settings() {
  return (
    <div className="w-full">
      <SettingsContent />
    </div>
  );
}
