import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ManageUsers = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState();
  const navigate = useNavigate();

  const handleDelete = async (userId) => {
    console.log(userId);
    try {
      const res = await fetch(`/api/admin/delete-user/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: currentUser?.role }),
      });

      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
    fetchData();
  };

  async function fetchData() {
    const res = await fetch("/api/admin/allusers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: currentUser?.role,
      }),
    });

    const data = await res.json();
    console.log(data);
    setUsers(data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="w-full">
      <div className="flex flex-col items-center justify-center w-full h-full max-w-5xl py-2 mx-auto sm:py-6">
        <h1 className="text-xl font-bold sm:text-2xl">Manage Users</h1>
        {/* 
        {users?.map((user) => (
          <div key={user._id}>
            <p>{user.username}</p>
          </div>
        ))} */}

        <div className="flex flex-wrap items-center justify-center flex-grow w-full max-w-5xl gap-3 p-3 select-none">
          {users &&
            users?.length > 0 &&
            users.map((user) => (
              <div
                className="flex flex-col justify-center w-48 gap-4 p-2 overflow-hidden transition-all border-2 border-black rounded-lg group/item hover:scale-105 h-fit"
                key={user._id}
              >
                <img
                  className="object-cover w-10 h-10 rounded-full"
                  src={user.avatar}
                  alt=""
                />
                <p className="truncate">Name : {user.username}</p>
                <p className="truncate">Email :{user.email}</p>
                <div className="flex justify-between w-full">
                  <p
                    onClick={() => {
                      navigate(`/admin/user-details/${user._id}`);
                    }}
                    className="text-amber-600 hover:underline "
                  >
                    View
                  </p>
                  <p
                    onClick={() => {
                      navigate(`/admin/edit-user/${user._id}`);
                    }}
                    className="text-emerald-600 hover:underline "
                  >
                    Edit
                  </p>
                  <p
                    onClick={() => {
                      handleDelete(user._id);
                    }}
                    className="text-red-600 hover:underline "
                  >
                    Delete
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
};

export default ManageUsers;
