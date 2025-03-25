const UserProfileCard = ({ user, handleLogout }) => {
    return (
      <div className="bg-[#1e1e24] rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {user.profile_picture ? (
              <img src={user.profile_picture} alt="Profile" className="w-16 h-16 rounded-full object-cover mr-4" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white font-bold mr-4">
                {user.first_name ? user.first_name.charAt(0) : "U"}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-semibold text-white">{user.first_name} {user.last_name}</h2>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">
            Logout
          </button>
        </div>
      </div>
    );
  };

  
export default UserProfileCard