import { useState } from "react";

import { Button } from "@/components/common/button/Button";
import { Text } from "@/components/common/display/Text";
import { Flex } from "@/components/common/layout/Flex";
import { Modal } from "@/components/common/overlay/Modal";
import { PageLayout } from "@/pages/_components/PageLayout";
import { DevCardGrid } from "@/pages/dev/_components/DevCardGrid";
import { DevComponentCard } from "@/pages/dev/_components/DevComponentCard";
import { useSystemToast } from "@/stores/system-toast-store";

const TOAST_TYPES = ["info", "success", "warning", "error"] as const;

export function DevOverlayPage() {
  const toast = useSystemToast();

  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleToastOpen = (type: (typeof TOAST_TYPES)[number]) => {
    toast({ type, message: `This is the ${type} toast message.` });
  };

  return (
    <PageLayout>
      <DevCardGrid>
        <DevComponentCard title="Modal">
          <Button variant="contained" onClick={handleModalOpen}>
            Open Modal
          </Button>
        </DevComponentCard>

        <DevComponentCard title="Toast">
          <Flex gap={2} wrap>
            {TOAST_TYPES.map((type) => (
              <Button
                key={type}
                variant="outlined"
                onClick={() => handleToastOpen(type)}
              >
                {type}
              </Button>
            ))}
          </Flex>
        </DevComponentCard>
      </DevCardGrid>

      <Modal
        open={modalOpen}
        title="Modal"
        size="medium"
        actions={[
          {
            variant: "outlined",
            label: "Cancel",
            onClick: handleModalClose,
          },
          {
            variant: "contained",
            label: "Confirm",
            onClick: handleModalClose,
          },
        ]}
        onClose={handleModalClose}
      >
        <Text size="sm" color="secondary">
          This is the modal content area.
        </Text>
      </Modal>
    </PageLayout>
  );
}
