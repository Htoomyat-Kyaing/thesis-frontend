import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header className="p-3 select-none bg-slate-200">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <Link to={"/"}>
          <h1 className="text-xl font-bold hover:underline">Logo</h1>
        </Link>

        <form>
          <input
            className="p-2 rounded-lg indent-2 focus:outline-none"
            type="text"
            placeholder="Search Items"
          />
        </form>

        <ul className="flex flex-wrap gap-4">
          {currentUser ? (
            <li className="hover:underline">
              <Link to={`/profile`}>Profile</Link>
            </li>
          ) : (
            <li className="hover:underline">
              <Link to={"/sign-in"}>Sign In</Link>
            </li>
          )}
          {/* <li className="hover:underline">
            <Link to={"/sign-up"}>Sign Up</Link>
          </li> */}
        </ul>
      </div>
    </header>
  );
};

export default Header;
