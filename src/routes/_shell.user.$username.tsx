import { createFileRoute, notFound } from "@tanstack/react-router";
import { ProfileContent } from "@/components/softly/ProfileContent";

export const Route = createFileRoute("/_shell/user/$username")({
  head: ({ params }) => ({
    meta: [{ title: `@${params.username} — Softlynest` }],
  }),
  component: UserProfilePage,
});

function UserProfilePage() {
  const { username } = Route.useParams();
  return (
    <div className="w-full">
      <ProfileContent username={username} />
    </div>
  );
}
