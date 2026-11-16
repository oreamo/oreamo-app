import { Flex } from "@/components/common/layout/Flex";
import { PageLayout } from "@/pages/_components/PageLayout";
import { ProfileCard } from "@/pages/setting/user/profile/_components/ProfileCard";
import { ProfileForm } from "@/pages/setting/user/profile/_components/ProfileForm";
import { useSessionUserInfo } from "@/resources/user/useSessionUserInfo";

export function ProfilePage() {
  const { data: userInfo } = useSessionUserInfo();

  if (!userInfo) return null;

  return (
    <PageLayout>
      <Flex direction="column" gap={3} fullWidth>
        <ProfileCard userInfo={userInfo} />
        <ProfileForm userInfo={userInfo} />
      </Flex>
    </PageLayout>
  );
}
