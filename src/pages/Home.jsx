/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [allItems, setAllItems] = useState([]);
  const [formData, setFormData] = useState({
    searchTerm: "",
    category: "",
    sort: "createdAt",
    // excludeUserRef: "",
    order: "desc",
    limit: "5", // ITEM-FETCH-LIMIT
    startIndex: "0",
  });
  const urlParams = new URLSearchParams(window.location.search);
  const [startIndex, setStartIndex] = useState(0);
  const [nextPageExist, setNextPageExist] = useState(false);

  const handleChange = (e) => {
    // need to restart the startIndex counter everytime a category is chosen
    setStartIndex(0);
    if (e.target.name === "sort_order") {
      const sort = e.target.value.split("_")[0];
      const order = e.target.value.split("_")[1];
      setFormData({ ...formData, sort, order });
    } else if (e.target.name === "excludeUserRef") {
      if (e.target.checked) {
        setFormData({ ...formData, excludeUserRef: currentUser._id });
      } else setFormData({ ...formData, excludeUserRef: "" });
    } else setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    urlParams.set("searchTerm", formData.searchTerm);
    urlParams.set("category", formData.category);
    urlParams.set("sort", formData.sort);
    urlParams.set("order", formData.order);
    urlParams.set("limit", formData.limit);
    urlParams.set("startIndex", formData.startIndex);
    urlParams.set("excludeUserRef", formData.excludeUserRef);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/item/get/items?${searchQuery}`);
    try {
      const data = await res.json();
      setAllItems(data);
      navigate(`/search?${searchQuery}`);
      checkNextPageExists(formData.startIndex);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchItems = async () => {
    urlParams.set("searchTerm", formData.searchTerm);
    urlParams.set("category", formData.category);
    urlParams.set("sort", formData.sort);
    urlParams.set("order", formData.order);
    urlParams.set("limit", formData.limit);
    urlParams.set("startIndex", formData.startIndex);
    const searchQuery = urlParams.toString();
    // DIRECT API TEST
    // const res = await fetch(
    //   `${import.meta.env.VITE_BASE_URL}/item/get/items?${searchQuery}`
    // );
    const res = await fetch(`/api/item/get/items?${searchQuery}`);
    try {
      const data = await res.json();
      setAllItems(data);
    } catch (error) {
      console.log(error);
    }
  };

  const checkNextPageExists = async (startIndex) => {
    const SI = startIndex + 5;
    const res = await fetch(
      `api/item/get/items?startIndex=${SI}&excludeUserRef=${formData?.excludeUserRef}`
    );
    try {
      const data = await res.json();
      // console.log(data.length);
      if (data.length === 0) {
        setNextPageExist(false);
        return;
      }
      setNextPageExist(true);
    } catch (error) {
      console.log(error);
    }
  };

  const nextPageFetch = async (SI) => {
    let res = null;
    if (SI <= 0) {
      urlParams.set("startIndex", 0);
      urlParams.set("limit", 5); // ITEM-FETCH-LIMIT
      const searchQuery = urlParams.toString();
      res = await fetch(`/api/item/get/items?${searchQuery}`);
    } else {
      urlParams.set("startIndex", SI);
      urlParams.set("limit", 5); // ITEM-FETCH-LIMIT
      const searchQuery = urlParams.toString();
      res = await fetch(`/api/item/get/items?${searchQuery}`);
    }
    const data = await res.json();
    setAllItems(data);
  };

  useEffect(() => {
    fetchItems();
    checkNextPageExists(formData?.startIndex);
  }, []);

  useEffect(() => {
    nextPageFetch(startIndex);
    checkNextPageExists(startIndex);
  }, [startIndex]);

  useEffect(() => {
    if (currentUser?.role === "admin") navigate("/admin");
  }, []);

  return (
    <div className="flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-center w-full gap-6 p-3 bg-blue-300 sm:flex-col"
      >
        <div className="flex flex-col justify-between w-full max-w-5xl gap-4 mx-auto sm:flex-row">
          <div className="flex items-center justify-between w-full gap-4 sm:w-fit">
            <label htmlFor="searchTerm">Item Name</label>
            <input
              className="w-full p-2 border-2 border-black rounded-lg indent-2 focus:outline-none max-w-40"
              type="text"
              placeholder="Item Name"
              name="searchTerm"
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>
          <div className="flex items-center justify-between w-full gap-4 sm:justify-start sm:w-fit">
            <label htmlFor="category">Item Category</label>
            <input
              className="w-full p-2 border-2 border-black rounded-lg indent-2 focus:outline-none max-w-40"
              type="text"
              placeholder="Item Category"
              name="category"
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>

          <div className="flex items-center justify-between w-full gap-4 sm:justify-start sm:w-fit">
            <label className="w-1/3" htmlFor="sort_order">
              Sort By
            </label>
            <select
              className="p-2 border-2 border-black rounded-lg focus:outline-none min-w-40"
              onChange={handleChange}
              name="sort_order"
            >
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
              <option value="sellPrice_asc">Cheapest</option>
              <option value="sellPrice_desc">Most Expensive</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between w-full max-w-5xl">
          <div className="flex gap-2 sm:gap-5">
            <label htmlFor="category">Exclude My Items</label>
            <input
              type="checkbox"
              name="excludeUserRef"
              onChange={handleChange}
              className="w-8 accent-red-300"
            />
          </div>

          {/* <div className="items-center justify-center flex-1 w-full"> */}
          <div className="w-40 sm:w-80">
            <button
              className="flex-grow w-full py-2 font-bold text-black border-2 border-black rounded-lg hover:text-blue-300 hover:bg-black hover:cursor-pointer"
              type="submit"
            >
              Search
            </button>
          </div>
        </div>
      </form>
      <div className="flex flex-wrap items-center justify-center flex-grow w-full max-w-5xl gap-3 p-3 sm:flex-nowrap hover:cursor-pointer">
        {allItems &&
          allItems?.length > 0 &&
          allItems.map((item) => (
            <div
              className="flex flex-col justify-center w-48 gap-4 p-2 overflow-hidden transition-all border-2 border-black rounded-lg group/item hover:scale-105 h-fit"
              key={item._id}
              onClick={() => {
                navigate(`/item/${item._id}`);
              }}
            >
              <img
                className="object-contain w-40 h-32"
                src={item.imageUrl}
                alt=""
              />
              <p className="truncate ">Name : {item.name}</p>
              <p>
                Price : $<span className="font-semibold">{item.sellPrice}</span>{" "}
              </p>
              <p>Category : {item.category}</p>
            </div>
          ))}
      </div>
      <div className="flex justify-between w-full max-w-5xl p-3">
        <button
          disabled={startIndex === 0}
          className="self-center px-2 py-1 font-bold capitalize border-2 border-red-600 rounded-lg hover:bg-red-600 hover:text-white w-fit disabled:border-gray-600 disabled:hover:bg-white disabled:text-gray-700 disabled:opacity-75"
          onClick={async () => {
            setStartIndex((a) => a - 5); // ITEM-FETCH-LIMIT
          }}
        >
          Prev
        </button>
        <button
          disabled={!nextPageExist} // ITEM-FETCH-LIMIT
          className="self-center px-2 py-1 font-bold capitalize border-2 border-green-600 rounded-lg hover:bg-green-600 hover:text-white w-fit disabled:border-gray-600 disabled:hover:bg-white disabled:text-gray-700 disabled:opacity-75"
          onClick={async () => {
            setStartIndex((a) => a + 5); // ITEM-FETCH-LIMIT
            checkNextPageExists();
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
