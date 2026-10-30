import { styled } from "@mui/material";

import { Image } from "@/components/common/display/Image";
import { Flex } from "@/components/common/layout/Flex";
import { Modal } from "@/components/common/overlay/Modal";
import { TRANSLATION_KEY } from "@/constants/translation-constant";
import { useTranslate } from "@/hooks/useTranslate";
import { API_URL } from "@/libs/http-instance";
import { FileInfo } from "@/models/file-model";

interface FileImagePreviewModalProps {
  file: FileInfo;
  onClose: () => void;
}

export function FileImagePreviewModal({
  file,
  onClose,
}: FileImagePreviewModalProps) {
  const { translate } = useTranslate();

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      open
      title={file.fileName}
      actions={[
        {
          variant: "outlined",
          label: translate(TRANSLATION_KEY.common.label.CLOSE),
          onClick: handleClose,
        },
      ]}
      onClose={handleClose}
    >
      <StyledFileImagePreviewContainer align="center" justify="center">
        <Image
          src={`${API_URL}/files/${file.fileId}/view`}
          alt={file.fileName}
          fit="contain"
        />
      </StyledFileImagePreviewContainer>
    </Modal>
  );
}

const StyledFileImagePreviewContainer = styled(Flex)(({ theme }) => ({
  padding: theme.spacing(2),

  borderRadius: theme.shape.borderRadiusScale.md,

  backgroundColor: theme.palette.scale[50],

  "& img": {
    maxHeight: "70vh",
  },
}));
