import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage ? (
            <Link to="/" className="flex items-center gap-2.5">
              <ShipWheelIcon className="size-9 text-primary" />
              <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                Speekzy
              </span>
            </Link>
          ) : (
            <div />
          )}

          {/* RIGHT SIDE CONTROLS */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Notifications */}
            <Link to="/notifications">
              <button className="btn btn-ghost btn-circle" aria-label="Notifications">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>

            {/* Theme Selector */}
            <ThemeSelector />

            {/* Profile Picture */}
            <Link to="/profile">
              <button className="btn btn-ghost btn-circle" aria-label="Profile">
                {authUser?.profilePic ? (
                  <img
                    src={authUser.profilePic}
                    alt="User Avatar"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-base-300 flex items-center justify-center text-xs text-base-content opacity-50">
                    ?
                  </div>
                )}
              </button>
            </Link>

            {/* Logout Button */}
            <button
              className="btn btn-ghost btn-circle"
              onClick={logoutMutation}
              aria-label="Logout"
            >
              <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
