import { useSelector } from "react-redux";

const Admin = () => {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser?.role === "admin" ? (
    <div>Admin Page</div>
  ) : (
    <div className="flex items-center justify-center max-w-5xl mx-auto ">
      Only admin can see this page
    </div>
  );
};

export default Admin;
