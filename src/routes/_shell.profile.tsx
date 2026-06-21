import { createFileRoute } from "@tanstack/react-router";
import { ProfileContent } from "@/components/softly/ProfileContent";

export const Route = createFileRoute("/_shell/profile")({
  head: () => ({ meta: [{ title: "Profile — Softlynest" }] }),
  component: Profile,
});

function Profile() {
  return (
    <div className="w-full">
      <ProfileContent />
    </div>
  );
}
