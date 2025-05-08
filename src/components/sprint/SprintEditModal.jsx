import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { editSprint } from '../../redux/currentworkspace/currentWorkspaceThunk';
import { useDispatch } from 'react-redux';

const getFutureDate = (days, fromDate = new Date()) => {
  const date = new Date(fromDate);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

const formatDate = (date) => new Date(date).toISOString().split('T')[0];

const SprintEditModal = ({ sprint, mode = 'edit', onClose }) => {
  const dispatch =useDispatch()
  const navigate = useNavigate();
  const isStartMode = mode === 'start';
  const [dateRangeType, setDateRangeType] = useState('1_week');

  const today = formatDate(new Date());
  const defaultStartDate = isStartMode ? today : formatDate(sprint?.start_date || new Date());
  const defaultEndDate = getFutureDate(7, new Date(defaultStartDate));

  const formik = useFormik({
    initialValues: {
      name: sprint?.name || '',
      start_date: sprint?.start_date || defaultStartDate,
      end_date: sprint?.end_date || defaultEndDate,
      goal: sprint?.goal || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Sprint name is required'),
      start_date: isStartMode
        ? Yup.date()
            .min(today, 'Start date cannot be in the past')
            .required('Start date is required')
        : Yup.date().required('Start date is required'),
      end_date: Yup.date()
        .min(Yup.ref('start_date'), "End date can't be before start date")
        .required('End date is required'),
      goal: Yup.string(),
    }),
    onSubmit: async (values) => {
      const sprintData = {
        ...values,
        ...(mode === 'start' && { is_active: true }),
      };
    
      try {
        console.log('Submitting sprint:', sprintData);
    
        if (mode === 'start') {
          dispatch(editSprint({ sprintId: sprint.id, sprintData }));
          navigate('/dashboard/board');
        } else if (mode === 'edit') {
          dispatch(editSprint({ sprintId: sprint.id, sprintData }));
        }
    
        onClose();
      } catch (error) {
        console.error('Failed to submit sprint:', error);
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (dateRangeType === '1_week') {
      formik.setFieldValue('end_date', getFutureDate(7, new Date(formik.values.start_date)));
    } else if (dateRangeType === '2_weeks') {
      formik.setFieldValue('end_date', getFutureDate(14, new Date(formik.values.start_date)));
    }
  }, [dateRangeType, formik.values.start_date]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-semibold text-white mb-4">
          {isStartMode ? 'Start Sprint' : 'Edit Sprint'}
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <input
              type="text"
              name="name"
              className="w-full border border-gray-700 bg-gray-800 text-white rounded p-2"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Sprint Name"
            />
            {formik.errors.name && formik.touched.name && (
              <div className="text-red-500 text-sm">{formik.errors.name}</div>
            )}
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">Start Date</label>
            <input
              type="date"
              name="start_date"
              className="w-full border border-gray-700 bg-gray-800 text-white rounded p-2"
              value={formik.values.start_date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.start_date && formik.touched.start_date && (
              <div className="text-red-500 text-sm">{formik.errors.start_date}</div>
            )}
          </div>

          {/* Sprint Duration */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">Sprint Duration</label>
            <select
              value={dateRangeType}
              onChange={(e) => setDateRangeType(e.target.value)}
              className="w-full border border-gray-700 bg-gray-800 text-white rounded p-2"
            >
              <option value="1_week">1 Week</option>
              <option value="2_weeks">2 Weeks</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">End Date</label>
            <input
              type="date"
              name="end_date"
              className="w-full border border-gray-700 bg-gray-800 text-white rounded p-2"
              value={formik.values.end_date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={dateRangeType !== 'custom'}
            />
            {formik.errors.end_date && formik.touched.end_date && (
              <div className="text-red-500 text-sm">{formik.errors.end_date}</div>
            )}
          </div>

          {/* Goal */}
          <div>
            <textarea
              name="goal"
              className="w-full border border-gray-700 bg-gray-800 text-white rounded p-2"
              value={formik.values.goal}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Sprint Goal (optional)"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              {isStartMode ? 'Start' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SprintEditModal;
