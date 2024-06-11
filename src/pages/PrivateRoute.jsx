import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser ? (
    <Outlet />
  ) : (
    <div className="flex items-center justify-center max-w-5xl mx-auto ">
      You need to sign in to see your profile
    </div>
  );
};

export default PrivateRoute;
