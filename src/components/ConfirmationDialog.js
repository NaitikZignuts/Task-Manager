import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const ConfirmationDialog = ({ open, onClose, onConfirm, title, message, isLoading }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        className:
          "rounded-2xl shadow-lg p-4 sm:p-6 bg-white w-full sm:w-[400px]",
      }}
    >

      <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-800 text-center mt-2">
        {title}
      </DialogTitle>

      <div className="flex justify-center mt-2">
        <DeleteOutlineIcon
          fontSize="large"
          className="text-red-500 w-12 h-12 sm:w-14 sm:h-14"
        />
      </div>

      <DialogContent className="mt-2">
        <Typography className="text-gray-600 text-sm sm:text-base text-center">
          {message}
        </Typography>
      </DialogContent>

      <DialogActions className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 pb-4 pt-2">
        <Button
          onClick={onClose}
          variant="outlined"
          className="w-full sm:w-auto text-gray-700 hover:bg-gray-200 rounded-xl border-gray-300"
        >
          Cancel
        </Button>

        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isLoading}
          className="w-full sm:w-auto rounded-xl shadow-md"
        >
          {isLoading ? 'Deleting...' : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
