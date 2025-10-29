import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";

interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  type: "success" | "error";
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
}

const AlertDialog = ({
  open,
  onClose,
  type,
  title,
  message,
  onConfirm,
  confirmText = "OK",
}: AlertDialogProps) => {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          {type === "success" ? (
            <CheckCircle color="success" sx={{ fontSize: 32 }} />
          ) : (
            <Error color="error" sx={{ fontSize: 32 }} />
          )}
          <Typography variant="h6" component="span">
            {title}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={type === "success" ? "primary" : "error"}
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
