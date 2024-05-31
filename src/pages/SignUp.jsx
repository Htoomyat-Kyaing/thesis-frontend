import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "hmk",
    email: "hmk@gmail.com",
    password: "1234",
  });
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    try {
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      navigate("/profile");
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3">
      <div className="flex flex-col items-center justify-center max-w-5xl gap-4 mx-auto">
        <h2 className="text-xl font-bold">Sign Up</h2>

        <span className="text-center text-red-600">{error && error}</span>

        <form onSubmit={handleSubmit} className="flex flex-col w-1/2 gap-4">
          <input
            type="text"
            name="username"
            required
            className="p-2 border-2 rounded-lg"
            placeholder="Username"
            onChange={handleChange}
            value={formData.username}
          />
          <input
            type="email"
            required
            name="email"
            className="p-2 border-2 rounded-lg"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
          />
          <input
            type="password"
            required
            name="password"
            className="p-2 border-2 rounded-lg"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
          />
          <button
            disabled={loading}
            className="p-2 font-semibold uppercase rounded-lg bg-emerald-700 text-slate-100 hover:bg-emerald-600 disabled:bg-gray-700"
            type="submit"
          >
            {loading ? "Loading..." : "Create account"}
          </button>
        </form>

        <span className="text-center">
          Already have an account?{" "}
          <Link className="text-sky-700 hover:underline" to={"/sign-in"}>
            Sign In
          </Link>
        </span>
      </div>
    </main>
  );
};

export default SignUp;
