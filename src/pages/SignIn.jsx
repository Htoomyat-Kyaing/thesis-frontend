import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  signInFail,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "hmk@gmail.com",
    password: "1234",
  });
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/sign-in`, {
      // const res = await fetch(`/api/auth/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    try {
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFail(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFail(error.message));
    }
  };

  return (
    <main className="p-3">
      <div className="flex flex-col items-center justify-center max-w-5xl gap-4 mx-auto">
        <h2 className="text-xl font-bold">Sign In</h2>

        <span className="text-center text-red-600">{error && error}</span>

        <form onSubmit={handleSubmit} className="flex flex-col w-1/2 gap-4">
          {/* <input
            type="text"
            name="username"
            required
            className="p-2 border-2 rounded-lg"
            placeholder="Username"
            onChange={handleChange}
            value={formData.username}
          /> */}
          <input
            type="email"
            required
            name="email"
            className="p-2 border-2 rounded-lg"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
            autoComplete="off"
          />
          <input
            type="password"
            required
            name="password"
            className="p-2 border-2 rounded-lg"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
            autoComplete="off"
          />
          <button
            disabled={loading}
            className="p-2 font-semibold uppercase rounded-lg bg-emerald-700 text-slate-100 hover:bg-emerald-600 disabled:bg-gray-700"
            type="submit"
          >
            {loading ? "Loading..." : "Log into account"}
          </button>
        </form>

        <span className="text-center">
          Don&apos;t have an account?{" "}
          <Link className="text-sky-700 hover:underline" to={"/sign-up"}>
            Sign Up
          </Link>
        </span>
      </div>
    </main>
  );
};

export default SignIn;
