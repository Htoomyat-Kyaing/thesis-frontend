import { useSelector } from "react-redux";

const Admin = () => {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser?.role === "admin" ? (
    <main className="w-full">
      <div className="flex flex-col items-center justify-center w-full h-full max-w-5xl py-2 mx-auto sm:py-6">
        <h1 className="text-xl font-bold sm:text-2xl">
          Welcome To Admin Dashboard
        </h1>
      </div>
    </main>
  ) : (
    <div className="flex items-center justify-center max-w-5xl mx-auto ">
      Only admin can see this page
    </div>
  );
};

export default Admin;
