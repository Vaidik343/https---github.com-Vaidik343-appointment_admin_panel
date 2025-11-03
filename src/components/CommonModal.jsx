import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

const CommonModal = ({
  title,
  show,
  onClose,
  children,
  className,
  size = "md",
}) => {
  // Define maxWidth for MUI Dialog
  const getDialogWidth = () => {
    switch (size) {
      case "sm":
        return "sm";
      case "lg":
        return "lg";
      case "xl":
        return "xl";
      default:
        return "md";
    }
  };

  return (
    <Dialog
      open={show}
      onClose={onClose}
      fullWidth
      maxWidth={getDialogWidth()}
      className={className}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mt: 1 }}>{children}</Box>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommonModal;
