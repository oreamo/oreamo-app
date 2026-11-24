import { MouseEvent, useState } from "react";

import { styled } from "@mui/material";

import { Button } from "@/components/common/button/Button";
import { List } from "@/components/common/display/List";
import { Text } from "@/components/common/display/Text";
import { Flex } from "@/components/common/layout/Flex";
import { Modal } from "@/components/common/overlay/Modal";
import { Popper, PopperPlacement } from "@/components/common/overlay/Popper";
import { PageLayout } from "@/pages/_components/PageLayout";
import { DevCardGrid } from "@/pages/dev/_components/DevCardGrid";
import { DevComponentCard } from "@/pages/dev/_components/DevComponentCard";
import { useSystemToast } from "@/stores/system-toast-store";

const TOAST_TYPES = ["info", "success", "warning", "error"] as const;

const POPPER_PLACEMENTS: PopperPlacement[] = [
  "right-start",
  "left-start",
  "bottom-start",
  "top-start",
];

export function DevOverlayPage() {
  const toast = useSystemToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [popper, setPopper] = useState<{
    anchorEl: HTMLElement;
    placement: PopperPlacement;
  } | null>(null);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handlePopperOpen = (
    event: MouseEvent<HTMLButtonElement>,
    placement: PopperPlacement,
  ) => {
    setPopper({ anchorEl: event.currentTarget, placement });
  };

  const handlePopperClose = () => {
    setPopper(null);
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

        <DevComponentCard title="Popper">
          <Flex gap={2} wrap>
            {POPPER_PLACEMENTS.map((placement) => (
              <Button
                key={placement}
                variant="outlined"
                onClick={(event) => handlePopperOpen(event, placement)}
              >
                {placement}
              </Button>
            ))}
          </Flex>
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

      <Popper
        open={!!popper}
        anchorEl={popper?.anchorEl}
        placement={popper?.placement}
        onClose={handlePopperClose}
      >
        <StyledPopperContent>
          <List>
            <List.Item label="First Item" onClick={handlePopperClose} />
            <List.Item label="Second Item" onClick={handlePopperClose} />
            <List.Item label="Third Item" onClick={handlePopperClose} />
          </List>
        </StyledPopperContent>
      </Popper>

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

const StyledPopperContent = styled("div")(({ theme }) => ({
  border: `1px solid ${theme.palette.scale[200]}`,
  borderRadius: theme.shape.borderRadiusScale.md,

  backgroundColor: theme.palette.surface.overlay,
  boxShadow: theme.shadowScale.md,
}));
