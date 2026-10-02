import { PageHeader } from "../../components/common/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { ProfileCard } from "./ProfileCard";
import { SecurityCard } from "./SecurityCard";
import { AiIntegrationCard } from "./AiIntegrationCard";
import { AccountCard } from "./AccountCard";

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Settings"
        subtitle="Manage your account and integrations."
      />

      <ProfileCard user={user} updateUser={updateUser} />
      <SecurityCard />
      <AiIntegrationCard />
      <AccountCard user={user} logout={logout} />
    </div>
  );
}
