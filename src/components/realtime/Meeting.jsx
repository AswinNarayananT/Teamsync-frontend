import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createMeeting, fetchUpcomingMeetings } from '../../redux/currentworkspace/currentWorkspaceThunk';
import { toast } from 'react-toastify';

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
    dateTime: '',
    participants: [],
  };

  const validationSchema = Yup.object().shape({
    dateTime: Yup.date()
      .required('Required')
      .test('is-future', 'Meeting must be at least 5 minutes from now', function (value) {
        const diff = (new Date(value) - new Date()) / (1000 * 60);
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
      title: 'Scheduled Meeting', // or from form
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
          // unwrap to get the actual meetings array from the fulfilled thunk
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
    <div className="p-4 sm:p-6 md:p-10 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
        Team Meetings
      </h2>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setActiveTab('your')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            activeTab === 'your'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
          }`}
        >
          Your Meetings
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            activeTab === 'schedule'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
          }`}
        >
          Schedule
        </button>
        {isPrivileged && (
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeTab === 'recent'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            Recent Meetings
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="max-w-3xl mx-auto">
        {activeTab === 'your' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-300">
              Your Meetings
            </h3>
            {userMeetings.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No scheduled meetings.</p>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                {userMeetings.map((m) => (
                  <div
                    key={m.id}
                    className="border rounded-lg p-3 bg-gray-100 dark:bg-gray-700 hover:shadow-md transition"
                  >
                    <div className="text-sm">
                      <strong>Date:</strong>{' '}
                      {m.start_time
                        ? new Date(m.start_time).toLocaleString()
                        : 'Date not available'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
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

        {activeTab === 'schedule' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            {isPrivileged ? (
              <>
                <h3 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-300 text-center">
                  Schedule a Meeting
                </h3>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, values, setFieldValue }) => (
                    <Form className="space-y-4">
                      <div>
                        <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
                          Meeting Time:
                        </label>
                        <Field
                          type="datetime-local"
                          name="dateTime"
                          className="w-full p-2 rounded border bg-white dark:bg-gray-700 dark:text-gray-100"
                        />
                        <ErrorMessage
                          name="dateTime"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
                          Select Members:
                        </label>
                        <div className="border rounded p-2 max-h-32 overflow-y-auto bg-gray-50 dark:bg-gray-700">
                          {members.map((member) => (
                            <div
                              key={member.user_id}
                              className="flex items-center text-sm"
                            >
                              <input
                                type="checkbox"
                                value={member.user_id}
                                checked={values.participants.includes(member.user_id)}
                                onChange={(e) => {
                                  const updated = e.target.checked
                                    ? [...values.participants, member.user_id]
                                    : values.participants.filter((id) => id !== member.user_id);
                                  setFieldValue('participants', updated);
                                }}
                                className="mr-2"
                              />
                              <span className="text-gray-700 dark:text-gray-100">
                                {member.user_name || member.user_email}
                              </span>
                            </div>
                          ))}
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
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
                      >
                        {isSubmitting ? 'Scheduling...' : 'Create Meeting'}
                      </button>
                    </Form>
                  )}
                </Formik>
              </>
            ) : (
              <div className="text-yellow-600 font-medium text-center mt-8">
                Only workspace <strong>owner</strong> or <strong>manager</strong> can schedule meetings.
              </div>
            )}
          </div>
        )}

        {activeTab === 'recent' && isPrivileged && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-purple-700 dark:text-purple-300">
              Recent Meetings
            </h3>
            {recentMeetings.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No recent meetings.</p>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                {recentMeetings.map((m) => (
                  <div
                    key={m.id}
                    className="border rounded-lg p-3 bg-gray-100 dark:bg-gray-700 hover:shadow-md transition"
                  >
                    <div className="text-sm">
                      <strong>Date:</strong>{' '}
                      {m.start_time
                        ? new Date(m.start_time).toLocaleString()
                        : 'Date not available'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
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
