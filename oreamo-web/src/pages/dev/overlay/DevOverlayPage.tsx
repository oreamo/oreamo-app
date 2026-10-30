import { useState } from "react";

import { Button } from "@/components/common/button/Button";
import { Text } from "@/components/common/display/Text";
import { Modal } from "@/components/common/overlay/Modal";
import { ToastBar } from "@/components/common/overlay/ToastBar";
import { PageLayout } from "@/pages/_components/PageLayout";
import { DevCardGrid } from "@/pages/dev/_components/DevCardGrid";
import { DevComponentCard } from "@/pages/dev/_components/DevComponentCard";

export function DevOverlayPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleToastOpen = () => {
    setToastOpen(true);
  };

  const handleToastClose = () => {
    setToastOpen(false);
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
          <Button variant="contained" onClick={handleToastOpen}>
            Show Toast
          </Button>
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

      <ToastBar
        open={toastOpen}
        message="This is a toast message."
        onClose={handleToastClose}
      />
    </PageLayout>
  );
}
