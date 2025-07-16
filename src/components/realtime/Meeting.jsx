import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createMeeting, fetchUpcomingMeetings } from '../../redux/currentworkspace/currentWorkspaceThunk';
import { toast } from 'react-toastify';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const MeetingPage = () => {
  const dispatch = useDispatch();
  const currentWorkspace = useSelector((state) => state.currentWorkspace.currentWorkspace);
  const workspaceId = currentWorkspace?.id;
  const role = currentWorkspace?.role;
  const members = useSelector((state) => state.currentWorkspace.members);
  const projectId = useSelector(state => state.currentWorkspace.currentProject?.id);
  const [userMeetings, setUserMeetings] = useState([]);
  const recentMeetings = [];

  const isPrivileged = role === 'owner' || role === 'manager';
  const [activeTab, setActiveTab] = useState('your');

  const initialValues = {
    dateTime: null,
    participants: [],
  };

  const validationSchema = Yup.object().shape({
    dateTime: Yup.date()
      .required('Required')
      .test('is-future', 'Meeting must be at least 5 minutes from now', function (value) {
        if (!value) return false;
        const diff = (value - new Date()) / (1000 * 60);
        return diff >= 3;
      }),
    participants: Yup.array().min(1, 'Select at least one participant'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!projectId) {
      toast.error('No active project selected.');
      setSubmitting(false);
      return;
    }

    const payload = {
      title: 'Scheduled Meeting',
      start_time: new Date(values.dateTime).toISOString(),
      participants: values.participants,
    };

    try {
      const resultAction = await dispatch(createMeeting({ projectId, meetingData: payload }));

      if (createMeeting.fulfilled.match(resultAction)) {
        toast.success('Meeting scheduled successfully!');
        resetForm();
      } else {
        toast.error(resultAction.payload?.message || 'Failed to schedule meeting');
      }
    } catch (error) {
      toast.error('Unexpected error scheduling meeting');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    async function loadMeetings() {
      if (activeTab === 'your' && workspaceId) {
        try {
          const meetings = await dispatch(fetchUpcomingMeetings({ workspaceId })).unwrap();
          setUserMeetings(Array.isArray(meetings) ? meetings : []);

        } catch (error) {
          console.error('Failed to fetch meetings:', error);
          setUserMeetings([]);
        }
      }
    }

    loadMeetings();
  }, [activeTab, workspaceId, dispatch]);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h2 className="text-4xl font-extrabold mb-10 text-center text-gray-900 dark:text-gray-100 tracking-tight">
        Team Meetings
      </h2>

      {/* Tabs */}
      <div className="flex justify-center gap-5 mb-8">
        {['your', 'schedule', 'recent'].map((tab) => {
          if (tab === 'recent' && !isPrivileged) return null;
          const labels = { your: 'Your Meetings', schedule: 'Schedule', recent: 'Recent Meetings' };
          const colors = {
            your: 'blue',
            schedule: 'green',
            recent: 'purple',
          };
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition
                ${isActive 
                  ? `bg-${colors[tab]}-600 text-white shadow-lg` 
                  : `bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-${colors[tab]}-500 hover:text-white`
                }
              `}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="max-w-3xl mx-auto">
       {/* Your Meetings */}
  {activeTab === 'your' && (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-7">
      <h3 className="text-2xl font-semibold mb-6 text-blue-700 dark:text-blue-400">
        Your Meetings
      </h3>

      {userMeetings.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-16">
          No scheduled meetings.
        </p>
      ) : (
        <div className="space-y-5 max-h-[420px] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 dark:scrollbar-thumb-blue-700 dark:scrollbar-track-gray-700">
          {userMeetings.map((m) => (
            <div
              key={m.id}
              className="border border-gray-300 dark:border-gray-700 rounded-lg p-5 bg-gray-100 dark:bg-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
              title="Click for details"
            >
              {/* Date */}
              <div className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">
                {m.start_time ? format(new Date(m.start_time), 'PPpp') : 'Date not available'}
              </div>

              {/* Participants */}
              <div className="mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <strong>Participants:</strong>
                </p>

                <div className="flex flex-wrap gap-2">
                  {Array.isArray(m.participants) && m.participants.length > 0 ? (
                    m.participants.map((p, index) => (
                      <div
                        key={index}
                        className="flex items-center px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full text-xs font-medium shadow-sm"
                      >
                        {p.full_name ? p.full_name : "Unknown"}
                        <span className="ml-1 text-gray-500 dark:text-gray-400">({p.email})</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400">No participants</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )}

        {/* Schedule Meeting */}
        {activeTab === 'schedule' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-7">
            {isPrivileged ? (
              <>
                <h3 className="text-2xl font-semibold mb-6 text-green-700 dark:text-green-400 text-center">
                  Schedule a Meeting
                </h3>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, values, setFieldValue, errors, touched }) => (
                    <Form className="space-y-6">
                      <div>
                        <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
                          Meeting Date & Time:
                        </label>
                        <DatePicker
                          selected={values.dateTime}
                          onChange={(date) => setFieldValue('dateTime', date)}
                          showTimeSelect
                          timeIntervals={15}
                          minDate={new Date()}
                          minTime={new Date()}
                          maxTime={new Date().setHours(23, 59)}
                          dateFormat="MMMM d, yyyy h:mm aa"
                          className={`w-full px-4 py-2 rounded-lg border 
                            ${
                              errors.dateTime && touched.dateTime
                                ? 'border-red-500'
                                : 'border-gray-300 dark:border-gray-600'
                            } 
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                            focus:outline-none focus:ring-2 focus:ring-green-500 transition`}
                          placeholderText="Select date and time"
                        />
                        <ErrorMessage
                          name="dateTime"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
                          Select Members:
                        </label>
                        <div className="border rounded-lg p-3 max-h-40 overflow-y-auto bg-gray-50 dark:bg-gray-700 scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-200 dark:scrollbar-thumb-green-700 dark:scrollbar-track-gray-700">
                          {members.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                              No members found
                            </p>
                          ) : (
                            members.map((member) => {
                              const isChecked = values.participants.includes(member.user_id);
                              return (
                                <label
                                  key={member.user_id}
                                  className="flex items-center mb-2 cursor-pointer select-none"
                                  htmlFor={`participant-${member.user_id}`}
                                >
                                  <input
                                    type="checkbox"
                                    id={`participant-${member.user_id}`}
                                    value={member.user_id}
                                    checked={isChecked}
                                    onChange={(e) => {
                                      const updated = e.target.checked
                                        ? [...values.participants, member.user_id]
                                        : values.participants.filter((id) => id !== member.user_id);
                                      setFieldValue('participants', updated);
                                    }}
                                    className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-400 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 transition"
                                  />
                                  <span
                                    className={`ml-3 text-gray-700 dark:text-gray-200 ${
                                      isChecked ? 'font-semibold' : ''
                                    }`}
                                  >
                                    {member.user_name || member.user_email}
                                  </span>
                                </label>
                              );
                            })
                          )}
                        </div>
                        <ErrorMessage
                          name="participants"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 rounded-lg text-white font-semibold
                          bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600
                          shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isSubmitting ? 'Scheduling...' : 'Create Meeting'}
                      </button>
                    </Form>
                  )}
                </Formik>
              </>
            ) : (
              <div className="text-yellow-600 font-semibold text-center mt-12 text-lg">
                Only workspace <strong>owner</strong> or <strong>manager</strong> can schedule meetings.
              </div>
            )}
          </div>
        )}

        {/* Recent Meetings */}
        {activeTab === 'recent' && isPrivileged && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-7">
            <h3 className="text-2xl font-semibold mb-6 text-purple-700 dark:text-purple-400">
              Recent Meetings
            </h3>
            {recentMeetings.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-16">
                No recent meetings.
              </p>
            ) : (
              <div className="space-y-5 max-h-[420px] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-200 dark:scrollbar-thumb-purple-700 dark:scrollbar-track-gray-700">
                {recentMeetings.map((m) => (
                  <div
                    key={m.id}
                    className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-gray-100 dark:bg-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
                    title="Click for details"
                  >
                    <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                      {m.start_time
                        ? format(new Date(m.start_time), 'PPpp')
                        : 'Date not available'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      <strong>With:</strong>{' '}
                      {Array.isArray(m.participants) && m.participants.length > 0
                        ? m.participants.map((p) => p.name || p.email || 'Unknown').join(', ')
                        : 'No participants'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingPage;
