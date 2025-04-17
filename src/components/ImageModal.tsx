"use client";

import { Modal, Fade, Box, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";

type ImageModalProps = {
  open: boolean;
  onClose: () => void;
  selectedImage: string | null;
  onDeleteClick: () => void;
};

export default function ImageModal({
  open,
  onClose,
  selectedImage,
  onDeleteClick,
}: ImageModalProps) {
  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
            maxWidth: "90vw",
            maxHeight: "90vh",
            textAlign: "center",
            outline: "none",
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(0,0,0,0.4)",
              color: "white",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
            }}
          >
            <CloseIcon />
          </IconButton>

          {selectedImage && (
            <>
              <Image
                src={selectedImage}
                alt="Preview"
                width={800}
                height={600}
                style={{
                  maxWidth: "100%",
                  maxHeight: "70vh",
                  borderRadius: "12px",
                  marginBottom: "20px",
                }}
              />
              <Button
                variant="outlined"
                color="error"
                onClick={onDeleteClick}
                sx={{ mt: 1 }}
              >
                Delete
              </Button>
            </>
          )}
        </Box>
      </Fade>
    </Modal>
  );
}
