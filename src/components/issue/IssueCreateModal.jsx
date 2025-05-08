import React, { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { createIssue } from '../../redux/currentworkspace/currentWorkspaceThunk';
import { Autocomplete, TextField } from '@mui/material';

export default function IssueCreateModal({ isOpen, onClose, projectId }) {
  const dispatch = useDispatch();
  const epics = useSelector((s) => s.currentWorkspace.epics) || [];
  const members = useSelector((s) => s.currentWorkspace.members) || [];

  const today = new Date().toISOString().split('T')[0];

  const [epicSearch, setEpicSearch] = useState('');
  const [assigneeSearch, setAssigneeSearch] = useState('');

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      status: 'todo',
      type: 'task',
      assignee: '',
      parent: '',
      start_date: '',
      end_date: ''
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string()
        .matches(/^[A-Za-z\s]*$/, 'Description must only contain alphabetic characters')
        .nullable(),
      start_date: Yup.date().nullable(),
      end_date: Yup.date()
        .nullable()
        .when('start_date', (start_date, schema) =>
          start_date
            ? schema.test(
                'is-valid-end-date',
                'End date must be after start date',
                (end_date) => {
                  if (!end_date) return true;
                  return new Date(end_date) > new Date(start_date);
                }
              )
            : schema
        )
    }),
    onSubmit: async (values, { setSubmitting }) => {
      const payload = {
        ...values,
        assignee: values.assignee || null,
        parent: values.type === 'epic' ? null : values.parent || null,
        start_date: values.start_date || null,
        end_date: values.end_date || null
      };
      try {
        await dispatch(createIssue({ issueData: payload, projectId })).unwrap();
        toast.success('Issue created!');
        onClose();
      } catch (err) {
        console.error(err);
        toast.error('Failed to create issue');
      } finally {
        setSubmitting(false);
      }
    }
  });

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
      setEpicSearch('');
      setAssigneeSearch('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredEpics = epics
    .filter((e) => e.title.toLowerCase().includes(epicSearch.toLowerCase()))
    .slice(0, 3);

  const filteredAssignees = members
    .filter((m) => m.user_email.toLowerCase().includes(assigneeSearch.toLowerCase()))
    .slice(0, 3);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-gray-900 text-white rounded-lg shadow-xl w-full max-w-2xl p-6 overflow-auto"
      >
        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
          <h2 className="text-xl font-semibold">Create Issue</h2>
          <button type="button" onClick={onClose} className="hover:bg-gray-700 p-1 rounded">
            <IoMdClose size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title *</label>
            <input
              type="text"
              name="title"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded h-28"
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Issue Type</label>
              <select
                name="type"
                onChange={formik.handleChange}
                value={formik.values.type}
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
              >
                <option value="task">Task</option>
                <option value="bug">Bug</option>
                <option value="story">Story</option>
                <option value="epic">Epic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Status</label>
              <select
                name="status"
                onChange={formik.handleChange}
                value={formik.values.status}
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Start Date</label>
              <input
                type="date"
                name="start_date"
                onChange={formik.handleChange}
                value={formik.values.start_date}
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
                min={today}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">End Date</label>
              <input
                type="date"
                name="end_date"
                onChange={formik.handleChange}
                value={formik.values.end_date}
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
                min={formik.values.start_date || today}
              />
              {formik.touched.end_date && formik.errors.end_date && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.end_date}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formik.values.type !== 'epic' && (
              <div>
                <label className="block text-sm font-medium mb-1">Parent Epic</label>
                <Autocomplete
                  options={filteredEpics}
                  getOptionLabel={(option) => option.title}
                  value={epics.find((e) => e.id === formik.values.parent) || null}
                  onChange={(e, newValue) => {
                    formik.setFieldValue('parent', newValue ? newValue.id : '');
                  }}
                  inputValue={epicSearch}
                  onInputChange={(e, value) => setEpicSearch(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Search epic..."
                      size="small"
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        className: 'bg-gray-800 text-white border border-gray-600 rounded'
                      }}
                    />
                  )}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Assignee</label>
              <Autocomplete
                options={filteredAssignees}
                getOptionLabel={(option) => option.user_email}
                value={members.find((m) => m.user_id === formik.values.assignee) || null}
                onChange={(e, newValue) => {
                  formik.setFieldValue('assignee', newValue ? newValue.user_id : '');
                }}
                inputValue={assigneeSearch}
                onInputChange={(e, value) => setAssigneeSearch(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Search assignee..."
                    size="small"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      className: 'bg-gray-800 text-white border border-gray-600 rounded'
                    }}
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 border-t border-gray-700 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 mr-2 rounded bg-gray-700 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
          >
            {formik.isSubmitting ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}
