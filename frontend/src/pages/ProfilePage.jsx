import useAuthUser from "../hooks/useAuthUser";
import { MapPinIcon, ShipWheelIcon, ArrowLeftIcon } from "lucide-react";
import { LANGUAGES } from "../constants";
import { Link, useNavigate } from "react-router";
const ProfilePage = () => {
  const { authUser } = useAuthUser();
  const navigate = useNavigate();

  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          {/* Back Button */}
          <div className="flex items-center mb-4">
            <button 
              onClick={() => navigate(-1)}
              className="btn btn-ghost btn-sm"
              title="Go back"
            >
              <ArrowLeftIcon className="size-4 mr-2" />
              Back
            </button>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Your Profile</h1>

          {/* PROFILE PIC */}
          <div className="flex flex-col items-center space-y-4 mb-6">
            <div className="size-32 rounded-full bg-base-300 overflow-hidden">
              {authUser.profilePic ? (
                <img
                  src={authUser.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-base-content opacity-40">
                  No Image
                </div>
              )}
            </div>
            <p className="text-xl font-semibold">{authUser.fullName}</p>
          </div>

          {/* INFO */}
          <div className="space-y-4 text-base-content">
            <div>
              <h2 className="font-bold text-lg">Bio</h2>
              <p>{authUser.bio || "No bio provided."}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 className="font-bold">Native Language</h2>
                <p>
                  {LANGUAGES.find(
                    (lang) => lang.toLowerCase() === authUser.nativeLanguage
                  ) || "Not specified"}
                </p>
              </div>
              <div>
                <h2 className="font-bold">Learning Language</h2>
                <p>
                  {LANGUAGES.find(
                    (lang) => lang.toLowerCase() === authUser.learningLanguage
                  ) || "Not specified"}
                </p>
              </div>
            </div>

            <div className="flex items-center mt-4">
              <MapPinIcon className="mr-2 size-5 opacity-70" />
              <p>{authUser.location || "No location provided"}</p>
            </div>
          </div>
                
        <Link to="/edit-profile" className="mt-6 text-center">
          <div className="mt-8 text-center">
            <button className="btn btn-primary">
              <ShipWheelIcon className="size-4 mr-2" />
              Edit Profile
            </button>
          </div>
        </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
