  import React, { useEffect, useState } from "react";
  import {  useSelector, useDispatch } from "react-redux";
  import { FaPlus, FaCamera,FaLock, FaPencilAlt, FaRegCalendarTimes, FaChevronRight, FaBell , FaUserShield ,FaCog, FaUser, FaClipboardList, FaCrown, FaEllipsisV , FaStar, FaUsers,
    FaCalendar, FaUserFriends, FaSearch, FaFilter, FaHistory, FaFileAlt, FaUserPlus, FaCommentAlt, FaShieldAlt, FaTimes , FaKey, FaCheckCircle, FaRegStar } from "react-icons/fa";
  import { uploadMultipleImagesToCloudinary } from "../utils/cloudinary";
  import { updateProfilePicture,updateUserDetails,changePassword } from "../redux/auth/authThunks";
  import { cancelSubscription } from "../redux/workspace/workspaceThunks";
  import api from "../api";
  import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
  } from "@mui/material";
  import { toast } from "react-toastify";
  import { useNavigate } from "react-router-dom";




  const UserSettings = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const { workspaces } = useSelector((state) => state.workspace);
    const [isUploading, setIsUploading] = useState(false);
    const [tempImage, setTempImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [subscription, setSubscription] = useState(null);
    const [openConfirm, setOpenConfirm] = useState(false);

    const handleOpen = () => setOpenConfirm(true);
    const handleClose = () => setOpenConfirm(false);

    const confirmCancel = () => {
      handleCancelSubscription();
      handleClose();
    };

    const ownedWorkspace = workspaces.find((ws) => ws.role === "owner");

    useEffect(() => {
      if (ownedWorkspace?.stripe_subscription_id) {
        api.get(`/api/v1/workspace/subscription/${ownedWorkspace.stripe_subscription_id}`)
          .then((res) => {setSubscription(res.data)})
          .catch((err) => console.error("Failed to load subscription", err));
      }
    }, [ownedWorkspace]);

    const handleCancelSubscription = () => {
      if (!ownedWorkspace?.stripe_subscription_id) {
        toast("No subscription found to cancel.");
        return;
      }
    
      dispatch(cancelSubscription(ownedWorkspace.stripe_subscription_id))
        .unwrap()
        .then(() => {
          toast("Subscription canceled successfully. You can use your workspace until the end of the billing period.");
        })
        .catch((err) => {
          console.error(err);
          alert("Failed to cancel the subscription. Please try again.");
        });
    };
    

    const handleProfilePictureChange = async (event) => {
      console.log(workspaces);

      const files = event.target.files;
      if (!files.length) return;

      setIsUploading(true);

      try {
        const imageUrls = await uploadMultipleImagesToCloudinary(files, "user-profile-pictures");
        console.log("Uploaded Image URLs:", imageUrls);

        if (imageUrls.length > 0) {
          setTempImage(imageUrls[0]); 
          console.log("Dispatching updateProfilePicture");
          dispatch(updateProfilePicture(imageUrls[0]));
        }
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      } finally {
        setIsUploading(false);
      }
    };

    const [passwordData, setPasswordData] = useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });

    const [formData, setFormData] = useState({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      phone_number: user?.phone_number || ""
    });
  
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await dispatch(updateUserDetails(formData)).unwrap();
        toast.success("Details updated successfully!");
      } catch (error) {
        console.error("Update error:", error);
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update details";
        toast.error(errorMessage);
      }
    };

    const handlePasswordChange = (e) => {
      setPasswordData({
        ...passwordData,
        [e.target.name]: e.target.value
      });
    };

    const submitPasswordChange = async (e) => {
      e.preventDefault();
      try {
        await dispatch(changePassword(passwordData)).unwrap();
        toast.success("Password changed successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        setIsChangingPassword(false);
      } catch (error) {
        console.log(error)
        toast.error( error?.response?.data?.error ||
          error?.message ||
          "Failed to change password");
      }
    };

    return (
      <div className="min-h-screen bg-gray-950 text-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">My Account</h1>
          <p className="text-gray-400 mt-1">Manage your profile and workspace settings</p>
        </div>
      </div>
    
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Account */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800">
              {/* Cover Photo */}
              <div className="h-32 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 relative">
                <button className="absolute right-3 bottom-3 bg-gray-800 bg-opacity-70 p-1.5 rounded-md text-gray-300 hover:bg-opacity-90">
                  <FaCamera className="w-4 h-4" />
                </button>
              </div>
              
              {/* Profile Info */}
              <div className="px-6 pb-6 relative">
                <div className="flex justify-between -mt-12">
                  <div className="relative">
                    {isUploading ? (
                      <div className="w-24 h-24 rounded-xl border-4 border-gray-900 bg-gray-800 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                      </div>
                    ) : tempImage || user?.profile_picture ? (
                      <img
                        src={tempImage || user?.profile_picture}
                        alt="Profile"
                        className="w-24 h-24 rounded-xl border-4 border-gray-900 object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-xl border-4 border-gray-900 flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-3xl">
                        {user?.first_name ? user.first_name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                    
                    <label className="absolute bottom-0 right-0 bg-blue-600 p-1.5 rounded-lg cursor-pointer hover:bg-blue-500 transition-colors shadow-lg">
                      <FaPencilAlt className="w-3 h-3 text-white" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                      />
                    </label>
                  </div>
                  
                  <div className="mt-14 flex space-x-1">
                    <span className="inline-flex h-6 items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200">
                      <span className="w-2 h-2 rounded-full bg-blue-400 mr-1.5"></span>
                      Online
                    </span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h2 className="text-xl font-bold text-white">
                    {user?.first_name} {user?.last_name}
                  </h2>
                  <p className="text-gray-400 text-sm">{user?.email}</p>
                  <p className="text-gray-500 text-xs mt-1">{user?.created_at}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="text-center p-3 bg-gray-800 rounded-lg">
                    <p className="text-2xl font-bold text-white">{workspaces.length}</p>
                    <p className="text-xs text-gray-400 mt-1">Workspaces</p>
                  </div>
                  <div className="text-center p-3 bg-gray-800 rounded-lg">
                    <p className="text-2xl font-bold text-white">{ownedWorkspace ? 1 : 0}</p>
                    <p className="text-xs text-gray-400 mt-1">Owned</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Account Options */}
            <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800">
              <div className="px-6 py-4 border-b border-gray-800">
                <h3 className="font-semibold flex items-center">
                  <FaCog className="mr-2 text-blue-500" />
                  Account Settings
                </h3>
              </div>
              
              <div className="divide-y divide-gray-800">
                <button 
                  onClick={() => setIsChangingPassword(true)}
                  className="flex items-center justify-between w-full px-6 py-4 text-left hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center">
                    <FaLock className="w-4 h-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium">Security</p>
                      <p className="text-xs text-gray-500">Change password and security settings</p>
                    </div>
                  </div>
                  <FaChevronRight className="w-3 h-3 text-gray-500" />
                </button>

                <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-between w-full px-6 py-4 text-left hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center">
                  <FaUser className="w-4 h-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Edit Profile</p>
                    <p className="text-xs text-gray-500">Update your personal information</p>
                  </div>
                </div>
                <FaChevronRight className="w-3 h-3 text-gray-500" />
              </button>

                <button className="flex items-center justify-between w-full px-6 py-4 text-left hover:bg-gray-800 transition-colors">
                  <div className="flex items-center">
                    <FaUserShield  className="w-4 h-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium">Permissions</p>
                      <p className="text-xs text-gray-500">Manage role preferences</p>
                    </div>
                  </div>
                  <FaChevronRight className="w-3 h-3 text-gray-500" />
                </button>
                
              </div>
            </div>
          </div>
          
          {/* Right Column - Workspaces & Subscriptions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Owned Workspace Section */}
            <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800">
              <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                <h3 className="font-semibold flex items-center">
                  <FaCrown className="mr-2 text-yellow-500" />
                  Workspace You Own
                </h3>
                {!ownedWorkspace && (
                  <button 
                    onClick={() => navigate("/create-workspace")}
                    className="text-xs flex items-center bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <FaPlus className="mr-1.5 w-3 h-3" />
                    Create Workspace
                  </button>
                )}
              </div>
              
              <div className="p-6">
                {ownedWorkspace ? (
                  <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                    <div className="px-5 py-4 flex items-center justify-between border-b border-gray-700">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl mr-3">
                          {ownedWorkspace.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-semibold">{ownedWorkspace.name}</h4>
                          <p className="text-xs text-gray-500">
                            Created on {new Date(ownedWorkspace.created_at).toLocaleDateString()}
                          </p>
                          {subscription && (
                            <p className="text-xs text-gray-400 mt-1">
                              Status: <span className="capitalize">{subscription.status}</span>
                            </p>
                          )}
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-white">
                        <FaEllipsisV className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="px-5 py-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                        <div className="bg-gray-700 rounded-lg p-3">
                          <p className="text-xs text-gray-400">Plan</p>
                          <p className="text-sm font-semibold mt-1 flex items-center">
                            {subscription ? (
                              <>
                                <FaStar className="w-3 h-3 text-yellow-500 mr-1.5" />
                                {subscription.product.name} (
                                every {subscription.price.interval_count} {subscription.price.interval}
                                {subscription.price.interval_count > 1 ? "s" : ""}
                                )
                              </>
                            ) : (
                              <>
                                <FaRegStar className="w-3 h-3 text-gray-400 mr-1.5" />
                                Free
                              </>
                            )}
                        </p>
                        </div>
                        
                        
                        <div className="bg-gray-700 rounded-lg p-3">
                          <p className="text-xs text-gray-400">Expires</p>
                          <p className="text-sm font-semibold mt-1 flex items-center">
                            <FaCalendar className="w-3 h-3 text-gray-400 mr-1.5" />
                            {subscription
                              ? new Date(subscription.current_period_end * 1000).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                      {ownedWorkspace.is_active ? (
                          subscription?.cancel_at_period_end ? (
                            <div className="text-xs text-red-500 flex items-center font-medium">
                              <FaRegCalendarTimes className="mr-1.5 w-3 h-3" />
                              Plan will be canceled on {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                            </div>
                          ) : (
                            <button 
                              onClick={handleOpen}
                              className="flex items-center text-xs px-3 py-1.5 rounded-lg transition-colors bg-red-600 hover:bg-red-700"
                            >
                              <FaRegCalendarTimes className="mr-1.5 w-3 h-3" />
                              Cancel Plan
                            </button>
                          )
                        ) : (
                          <div className="text-xs text-gray-400 flex items-center font-medium">
                            <FaRegCalendarTimes className="mr-1.5 w-3 h-3" />
                            Plan canceled
                          </div>
                        )}

                        {/* Material UI Confirmation Modal */}
                        <Dialog open={openConfirm} onClose={handleClose}>
                          <DialogTitle>Cancel Subscription</DialogTitle>
                          <DialogContent>
                            <DialogContentText>
                              Are you sure you want to cancel your plan? Your access will remain until the end of the current billing period.
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleClose} color="primary">
                              No, Keep Plan
                            </Button>
                            <Button onClick={confirmCancel} color="error">
                              Yes, Cancel It
                            </Button>
                          </DialogActions>
                        </Dialog>
                        {/* <button className="flex items-center text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors">
                          <FaCog className="mr-1.5 w-3 h-3" />
                          Manage
                        </button>
                        <button className="flex items-center text-xs bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg transition-colors">
                          <FaArrowUp className="mr-1.5 w-3 h-3" />
                          Upgrade
                        </button>  */}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto rounded-full bg-blue-900 bg-opacity-20 flex items-center justify-center mb-3">
                      <FaClipboardList className="w-7 h-7 text-blue-500" />
                    </div>
                    <h4 className="text-lg font-medium mb-2">No Owned Workspaces</h4>
                    <p className="text-sm text-gray-400 mb-4 max-w-md mx-auto">
                      Create your own workspace to invite team members and manage projects together.
                    </p>
                    <button 
                      onClick={() => navigate("/create-workspace")}
                      className="bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-lg text-sm"
                    >
                      Create Your First Workspace
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Member Workspaces */}
            <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800">
              <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                <h3 className="font-semibold flex items-center">
                  <FaUserFriends className="mr-2 text-blue-500" />
                  Workspaces You're A Member Of
                </h3>
                <div className="flex space-x-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search workspaces..."
                      className="text-xs bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500 w-40"
                    />
                    <FaSearch className="absolute right-3 top-2 text-gray-500 w-3 h-3" />
                  </div>
                  <button className="text-xs flex items-center bg-gray-800 hover:bg-gray-700 px-2 py-1.5 rounded-lg transition-colors">
                    <FaFilter className="mr-1.5 w-3 h-3" />
                    Filter
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {workspaces.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-1 xl:grid-cols-2">
                    {workspaces.map((ws) => (
                      <div key={ws.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-700 transition-all group">
                        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-700">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm mr-3">
                              {ws.name.charAt(0).toUpperCase()}
                            </div>
                            <h4 className="font-semibold text-sm">{ws.name}</h4>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">{ws.role}</span>
                        </div>
                        
                        <div className="px-4 py-3">
                          <p className="text-xs text-gray-400 line-clamp-2 h-8">{ws.description}</p>
                          
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex -space-x-2">
                              <div className="w-6 h-6 rounded-full bg-gray-700 border-2 border-gray-800 flex items-center justify-center text-xs">J</div>
                              <div className="w-6 h-6 rounded-full bg-gray-700 border-2 border-gray-800 flex items-center justify-center text-xs">K</div>
                              <div className="w-6 h-6 rounded-full bg-gray-700 border-2 border-gray-800 flex items-center justify-center text-xs">+3</div>
                            </div>
                            
                            <button className="text-xs text-blue-400 hover:text-blue-300 invisible group-hover:visible transition-all">
                              Open Workspace →
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto rounded-full bg-blue-900 bg-opacity-20 flex items-center justify-center mb-3">
                      <FaUsers className="w-7 h-7 text-blue-500" />
                    </div>
                    <h4 className="text-lg font-medium mb-2">No Member Workspaces</h4>
                    <p className="text-sm text-gray-400 mb-4 max-w-md mx-auto">
                      You are not a member of any workspaces yet. Ask workspace owners to invite you.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800">
              <div className="px-6 py-4 border-b border-gray-800">
                <h3 className="font-semibold flex items-center">
                  <FaHistory className="mr-2 text-blue-500" />
                  Recent Activity
                </h3>
              </div>
              
              <div className="divide-y divide-gray-800">
                <div className="px-6 py-4 flex items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-900 bg-opacity-30 flex items-center justify-center mr-3 mt-0.5">
                    <FaFileAlt className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm">You updated the <span className="text-blue-400">Marketing Plan</span> document</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>
                
                <div className="px-6 py-4 flex items-start">
                  <div className="w-8 h-8 rounded-full bg-green-900 bg-opacity-30 flex items-center justify-center mr-3 mt-0.5">
                    <FaUserPlus className="w-3.5 h-3.5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm">You joined <span className="text-blue-400">Design Team</span> workspace</p>
                    <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                  </div>
                </div>
                
                <div className="px-6 py-4 flex items-start">
                  <div className="w-8 h-8 rounded-full bg-purple-900 bg-opacity-30 flex items-center justify-center mr-3 mt-0.5">
                    <FaCommentAlt className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm">You commented on <span className="text-blue-400">Project Timeline</span></p>
                    <p className="text-xs text-gray-500 mt-1">3 days ago</p>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-3 border-t border-gray-800">
                <button className="text-xs text-blue-400 hover:text-blue-300">
                  View All Activity →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    
      {/* Change Password Modal */}
      {isChangingPassword && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-md border border-gray-800 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <FaShieldAlt className="mr-2 text-blue-500" />
                Change Password
              </h3>
              <button 
                onClick={() => setIsChangingPassword(false)}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={submitPasswordChange} className="space-y-5">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-white"
                    required
                  />
                  <FaLock className="absolute left-3 top-3.5 text-gray-500 w-4 h-4" />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-white"
                    required
                  />
                  <FaKey className="absolute left-3 top-3.5 text-gray-500 w-4 h-4" />
                </div>
                
                {/* Password Strength Indicator */}
                {passwordData.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center gap-1 mb-1">
                      <div className="h-1 flex-1 rounded-full bg-gray-700 overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                      <span className="text-xs text-green-500">Strong</span>
                    </div>
                    <p className="text-xs text-gray-500">Password should be at least 8 characters with numbers and symbols</p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 text-white ${
                      passwordData.confirmPassword && 
                      passwordData.newPassword !== passwordData.confirmPassword
                        ? "border-red-500 focus:ring-red-600"
                        : "border-gray-700 focus:ring-blue-600"
                    }`}
                    required
                  />
                  <FaCheckCircle className={`absolute left-3 top-3.5 w-4 h-4 ${
                    passwordData.confirmPassword && 
                    passwordData.newPassword === passwordData.confirmPassword
                      ? "text-green-500"
                      : "text-gray-500"
                  }`} />
                </div>
                {passwordData.confirmPassword && 
                passwordData.newPassword !== passwordData.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="px-4 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword}
                  className={`px-4 py-2.5 rounded-lg transition-colors flex items-center ${
                    passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  <FaShieldAlt className="mr-2 w-4 h-4" />
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


        {isEditing && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-md border border-gray-800 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <FaUser className="mr-2 text-blue-500" />
                Edit Profile
              </h3>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Email address cannot be changed</p>
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-white"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    );
  };

  export default UserSettings;
