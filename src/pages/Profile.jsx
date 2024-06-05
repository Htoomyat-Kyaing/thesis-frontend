import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signOutStart,
  signOutSuccess,
  signOutFail,
  updateStart,
  updateSuccess,
  updateFail,
} from "../redux/user/userSlice";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [success, setSuccess] = useState();
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: currentUser?.username,
    email: currentUser?.email,
    password: currentUser?.password,
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(currentUser._id);
    // console.log();
    console.log(getCookie("access_token"));
    dispatch(updateStart());
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/user/update/${currentUser._id}`,
      // `/api/user/update/${currentUser._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );
    try {
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateFail(data.message));
        setSuccess(null);
        return;
      }
      console.log(data);
      dispatch(updateSuccess(data));
      setSuccess("User updated successfully");
    } catch (error) {
      dispatch(updateFail(error.message));
      setSuccess(null);
    }
  };
  const handleSignout = async () => {
    dispatch(signOutStart());
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/sign-out`);
    // const res = await fetch(`/api/auth/sign-out`);
    try {
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFail(data.message));
        return;
      }
      dispatch(signOutSuccess());

      navigate("/");
    } catch (error) {
      dispatch(signOutFail(error.message));
    }
  };

  return currentUser ? (
    <main className="p-3">
      <div className="flex flex-col items-center justify-center max-w-5xl gap-4 mx-auto">
        <h2 className="text-xl font-bold">Profile</h2>

        <span className="text-center text-red-600">{error && error}</span>
        <span className="text-center text-emerald-600">
          {success && success}
        </span>

        <form onSubmit={handleSubmit} className="flex flex-col w-1/2 gap-4">
          <div className="flex flex-wrap items-center justify-between">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              // required
              className="p-2 border-2 rounded-lg"
              placeholder="Username"
              onChange={handleChange}
              defaultValue={formData.username}
            />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              // required
              name="email"
              className="p-2 border-2 rounded-lg"
              placeholder="Email"
              onChange={handleChange}
              defaultValue={formData.email}
              autoComplete="off"
            />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              // required
              name="password"
              className="p-2 border-2 rounded-lg"
              placeholder="Password"
              onChange={handleChange}
              defaultValue={formData.password}
              autoComplete="off"
            />
          </div>
          <button
            disabled={loading}
            className="p-2 font-semibold uppercase rounded-lg bg-emerald-700 text-slate-100 hover:bg-emerald-600 disabled:bg-gray-700"
            type="submit"
          >
            {loading ? "Loading..." : "Update account info"}
          </button>
          <button
            disabled={loading}
            className="p-2 font-semibold uppercase rounded-lg bg-sky-700 text-slate-100 hover:bg-sky-600 disabled:bg-gray-700"
            onClick={handleSignout}
          >
            {loading ? "Loading..." : "Log out the account"}
          </button>
        </form>
      </div>
    </main>
  ) : (
    <div className="flex items-center justify-center max-w-5xl mx-auto ">
      You need to sign in to see your profile
    </div>
  );
};

// eslint-disable-next-line no-unused-vars
function getCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  } else {
    begin += 2;
    var end = document.cookie.indexOf(";", begin);
    if (end == -1) {
      end = dc.length;
    }
  }
  // because unescape has been deprecated, replaced with decodeURI
  //return unescape(dc.substring(begin + prefix.length, end));
  return decodeURI(dc.substring(begin + prefix.length, end));
}

export default Profile;
