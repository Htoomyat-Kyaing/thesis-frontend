/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserDetailsForAdmin = () => {
  const [user, setUser] = useState();
  const params = useParams();
  const fetchUser = async () => {
    const res = await fetch(`/api/user/${params.userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({
      //   role: currentUser?.role,
      // }),
    });

    const data = await res.json();
    setUser(data);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // useEffect(() => {
  //   console.log(user?.cart);
  // }, [user]);

  function convertDateFormat(unformattedDate) {
    const dateString = unformattedDate;

    // Convert to Date object
    const date = new Date(dateString);

    // Format the date components
    const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    // Combine to desired format
    const formattedDate = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
  }
  return (
    <main className="w-full">
      <div className="flex flex-col items-center justify-center w-full h-full max-w-5xl gap-2 py-2 mx-auto sm:gap-5 sm:py-6">
        <h1 className="text-xl font-bold sm:text-2xl">User Details</h1>

        <table className="border-separate table-auto border-spacing-2">
          <tbody>
            <tr>
              <td>Profile :</td>
              <td>
                <img
                  className="object-cover w-8 h-8 rounded-full"
                  src={user?.avatar}
                  alt=""
                />
              </td>
            </tr>
            <tr>
              <td>Username :</td>
              <td>{user?.username}</td>
            </tr>
            <tr>
              <td>Email :</td>
              <td>{user?.email}</td>
            </tr>
            <tr>
              <td>Role :</td>
              <td>{user?.role}</td>
            </tr>
            <tr>
              <td>Created At :</td>
              <td>{convertDateFormat(user?.createdAt)}</td>
            </tr>
            <tr>
              <td>Updated At :</td>
              <td>{convertDateFormat(user?.updatedAt)}</td>
            </tr>
            <tr>
              <td>Items In Cart :</td>
              <td>{user?.cart.length}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default UserDetailsForAdmin;
