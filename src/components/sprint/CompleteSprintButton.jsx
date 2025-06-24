import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  useTheme,
  Box,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { MdCheckCircle } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { checkIssueStatus,completeSprint } from "../../redux/currentworkspace/currentWorkspaceThunk";
import { toast } from "react-toastify";

const CompleteSprintButton = ({ sprintId = null, disabled = false }) => {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [issueStatus, setIssueStatus] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);

  const dispatch = useDispatch();
  const theme = useTheme();
  const project =useSelector((state)=>state.currentWorkspace.currentProject);
  const sprints = useSelector((state) => state.currentWorkspace.sprints);
  const activeSprints = sprints.filter((s) => s.is_active);
  const selectedSprint = activeSprints.find((s) => s.id === Number(selectedId));
  const otherSprints = sprints.filter((s) => s.id !== Number(selectedId));

  useEffect(() => {
    if (open) {
      const defaultId = sprintId || activeSprints[0]?.id || "";
      setSelectedId(defaultId);
      setSelectedAction(null);
      fetchIssueStatus(defaultId);
    }
  }, [open]);

  const fetchIssueStatus = (id) => {
    if (!id) {
      setIssueStatus(null);
      return;
    }
    dispatch(checkIssueStatus(id))
      .unwrap()
      .then((data) => setIssueStatus(data))
      .catch(() => setIssueStatus(null));
  };

  const handleSprintChange = (e) => {
    const id = e.target.value;
    setSelectedId(id);
    setSelectedAction(null);
    fetchIssueStatus(id);
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setSelectedAction(null);
    setIssueStatus(null);
  };

  const handleActionSelect = (_, value) => {
    if (value) setSelectedAction(value);
  };

  const handleComplete = () => {
    if (!selectedId || (issueStatus?.incomplete_issues > 0 && !selectedAction)) return;
    dispatch(completeSprint({ projectId:project.id, sprintId: selectedId, action: selectedAction }))
      .unwrap()
      .then((res) => {
        toast.success("Sprint completed successfully!");
        setOpen(false);
      })
      .catch((err) => {
        console.log(err)
        toast.error(err.detail)
      });
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        color="success"
        onClick={handleOpen}
        disabled={disabled}
        startIcon={<MdCheckCircle />}
        size="small"
        sx={{ textTransform: "none", borderRadius: 2 }}
      >
        Complete Sprint
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
            color: theme.palette.mode === "dark" ? "#e0e0e0" : "#000",
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1} fontWeight="bold" fontSize="1.25rem">
            <MdCheckCircle color="#4caf50" size={24} />
            Complete Sprint
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {!sprintId && (
            <FormControl fullWidth margin="dense" size="small" sx={{ mb: 2 }}>
              <InputLabel sx={{ color: theme.palette.mode === "dark" ? "#bbb" : undefined }}>
                Select Sprint
              </InputLabel>
              <Select
                value={selectedId}
                onChange={handleSprintChange}
                label="Select Sprint"
                sx={{
                  color: theme.palette.mode === "dark" ? "#fff" : undefined,
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.mode === "dark" ? "#555" : undefined,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.mode === "dark" ? "#4caf50" : undefined,
                  },
                  ".MuiSvgIcon-root": {
                    color: theme.palette.mode === "dark" ? "#fff" : undefined,
                  },
                }}
              >
                {activeSprints.map((sprint) => (
                  <MenuItem key={sprint.id} value={sprint.id}>
                    {sprint.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {selectedSprint && (
            <>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Sprint: {selectedSprint.name}
              </Typography>

              {issueStatus && (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    backgroundColor: theme.palette.mode === "dark" ? "#232323" : "#f9f9f9",
                    mb: 2,
                  }}
                >
                  <Typography><strong>Total Issues:</strong> {issueStatus.total_issues}</Typography>
                  <Typography><strong>Completed:</strong> {issueStatus.complete_issues}</Typography>
                  <Typography><strong>Incomplete:</strong> {issueStatus.incomplete_issues}</Typography>
                </Box>
              )}

              {issueStatus?.incomplete_issues > 0 && (
                <>
                  <Typography mb={1}>
                    Some issues are incomplete. Choose what to do:
                  </Typography>
                  <ToggleButtonGroup
                    exclusive
                    value={selectedAction}
                    onChange={handleActionSelect}
                    orientation="vertical"
                    fullWidth
                    sx={{
                      "& .MuiToggleButton-root": {
                        justifyContent: "flex-start",
                        borderRadius: 2,
                        mb: 1,
                        color: theme.palette.mode === "dark" ? "#fff" : undefined,
                        borderColor: theme.palette.mode === "dark" ? "#555" : "#ccc",
                      },
                      "& .Mui-selected": {
                        backgroundColor: theme.palette.mode === "dark" ? "#333" : "#e0f2f1",
                        color: "#4caf50",
                        fontWeight: "bold",
                      },
                    }}
                  >
                    <ToggleButton value="create_new">Create New Sprint with Incomplete Issues</ToggleButton>
                    <ToggleButton value="backlog">Add Incomplete Issues to Backlog</ToggleButton>
                    {otherSprints.length > 0 && (
                      <ToggleButton value="move_to_another">
                        Move Incomplete Issues to Another Sprint
                      </ToggleButton>
                    )}
                  </ToggleButtonGroup>
                </>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} startIcon={<IoClose />} sx={{ color: "#bbb" }}>
            Cancel
          </Button>
          <Button
            onClick={handleComplete}
            disabled={!selectedId || (issueStatus?.incomplete_issues > 0 && !selectedAction)}
            variant="contained"
            color="success"
            startIcon={<MdCheckCircle />}
          >
            Complete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CompleteSprintButton;
