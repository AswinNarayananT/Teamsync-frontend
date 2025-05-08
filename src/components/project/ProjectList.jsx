import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  IconButton,
  Tooltip,
  Typography,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import { MdEdit, MdDelete } from "react-icons/md";
import { updateProject, deleteProject } from "../../redux/currentworkspace/currentWorkspaceThunk";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const ProjectList = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.currentWorkspace.projects);
  const currentWorkspace = useSelector((state) => state.currentWorkspace.currentWorkspace);
  const isWorkspaceOwner = currentWorkspace?.role === "owner";

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const ProjectSchema = Yup.object().shape({
    name: Yup.string().required("Project name is required"),
    description: Yup.string()
      .matches(/^[a-zA-Z0-9\s.,'"!?()-]*$/, "Only alphanumeric and punctuation allowed")
      .nullable(),
  });

  const handleEdit = (project) => {
    setProjectToEdit(project);
    setEditModalOpen(true);
  };

  const handleDelete = (project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleEditSubmit = async (values) => {
    try {
      await dispatch(updateProject({ projectId: projectToEdit.id, updatedData: values })).unwrap();
      setEditModalOpen(false);
      toast.success("Project updated successfully!");
    } catch (err) {
      toast.error(err?.message || "Failed to update project.");
    }
  };

  const handleDeleteConfirm = () => {
    dispatch(deleteProject(projectToDelete.id));
    setDeleteDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white px-8 py-10">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-extrabold">
              {currentWorkspace?.name || "Workspace"} Projects
            </h1>
            <p className="text-gray-400 mt-1">
              Role: <span className="text-blue-400 font-medium">{currentWorkspace?.role || "Member"}</span>
            </p>
          </div>
        </div>

        <Divider className="bg-gray-700" />

        <div className="space-y-6 mt-4">
          {projects.length === 0 ? (
            <p className="text-center text-gray-500 text-lg mt-20">No projects available in this workspace.</p>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="bg-[#1a1a1d] border border-[#2a2a2d] rounded-xl p-6 hover:shadow-xl hover:border-blue-500 transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <Typography variant="h6" className="text-white font-semibold">
                      {project.name}
                    </Typography>
                    <Typography variant="body2" className="text-gray-400">
                      {project.description}
                    </Typography>
                    <Typography variant="body2" className="text-gray-400">
                      Project created:{" "}
                      {new Date(project.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  </div>

                  {isWorkspaceOwner && (
                    <div className="flex gap-2">
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEdit(project)} className="text-blue-400 hover:text-blue-300">
                          <MdEdit size={22} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(project)} className="text-red-400 hover:text-red-300">
                          <MdDelete size={22} />
                        </IconButton>
                      </Tooltip>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 🔹 Edit Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Project</DialogTitle>
        <Formik
          initialValues={{
            name: projectToEdit?.name || "",
            description: projectToEdit?.description || "",
          }}
          enableReinitialize
          validationSchema={ProjectSchema}
          onSubmit={handleEditSubmit}
        >
          {({ errors, touched, handleChange, values }) => (
            <Form>
              <DialogContent>
                <TextField
                  label="Project Name"
                  name="name"
                  fullWidth
                  margin="dense"
                  value={values.name}
                  onChange={handleChange}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
                <TextField
                  label="Description"
                  name="description"
                  fullWidth
                  margin="dense"
                  multiline
                  value={values.description}
                  onChange={handleChange}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="contained" color="primary">
                  Save
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      {/* 🔹 Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the project <strong>{projectToDelete?.name}</strong>? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProjectList;
