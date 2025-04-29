import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';

// Helper function to get formatted future date
const getFutureDate = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

const formatDate = (date) => new Date(date).toISOString().split('T')[0];

const SprintEditModal = ({ sprint, onClose, onSubmit }) => {
  const [dateRangeType, setDateRangeType] = useState('1_week');

  const today = formatDate(new Date());
  const nextWeek = getFutureDate(7);

  const formik = useFormik({
    initialValues: {
      name: sprint?.name || '',
      start_date: sprint?.start_date || today,
      end_date: sprint?.end_date || nextWeek,
      goal: sprint?.goal || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Sprint name is required'),
      start_date: Yup.date().required('Start date is required'),
      end_date: Yup.date()
        .min(Yup.ref('start_date'), "End date can't be before start date")
        .required('End date is required'),
      goal: Yup.string(),
    }),
    onSubmit: (values) => {
      onSubmit(values);
      onClose();
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (dateRangeType === '1_week') {
      const newEnd = getFutureDate(7);
      formik.setFieldValue('end_date', newEnd);
    } else if (dateRangeType === '2_weeks') {
      const newEnd = getFutureDate(14);
      formik.setFieldValue('end_date', newEnd);
    }
  }, [dateRangeType, formik.values.start_date]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-semibold text-white mb-4">Edit Sprint</h2>

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

          {/* Sprint Duration Dropdown */}
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SprintEditModal;
