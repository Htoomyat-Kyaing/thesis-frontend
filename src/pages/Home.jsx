import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [allItems, setAllItems] = useState([]);
  const [formData, setFormData] = useState({
    searchTerm: "",
    category: "",
    sort: "createdAt",
    order: "desc",
    limit: "5", // ITEM-FETCH-LIMIT
    startIndex: "0",
  });
  const urlParams = new URLSearchParams(window.location.search);
  const [startIndex, setStartIndex] = useState(0);

  const handleChange = (e) => {
    // need to restart the startIndex counter everytime a category is chosen
    setStartIndex(0);
    if (e.target.name === "sort_order") {
      const sort = e.target.value.split("_")[0];
      const order = e.target.value.split("_")[1];
      setFormData({ ...formData, sort, order });
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
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/item/get/items?${searchQuery}`);
    try {
      const data = await res.json();
      setAllItems(data);
      navigate(`/search?${searchQuery}`);
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
    const res = await fetch(`/api/item/get/items?${searchQuery}`);
    try {
      const data = await res.json();
      setAllItems(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    nextPageFetch(startIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startIndex]);

  return (
    <div className="flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-center w-full gap-6 p-3 bg-blue-300"
      >
        <div className="flex flex-col w-full max-w-5xl gap-4 mx-auto sm:flex-row">
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
            <label className="w-1/3" htmlFor="category">
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
          <div className="items-center justify-center flex-1 w-full">
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
              <p>Price : {item.sellPrice} Kyats</p>
              <p>Category : {item.category}</p>
            </div>
          ))}
      </div>
      <div className="flex justify-between w-full max-w-5xl p-3">
        <button
          disabled={startIndex === 0}
          className="px-2 py-1 font-semibold border-2 border-black rounded-lg disabled:bg-red-600 disabled:text-white hover:bg-green-300 "
          onClick={async () => {
            setStartIndex((a) => a - 5); // ITEM-FETCH-LIMIT
          }}
        >
          Prev
        </button>
        <button
          disabled={allItems?.length % 5 !== 0} // ITEM-FETCH-LIMIT
          className="px-2 py-1 font-semibold border-2 border-black rounded-lg disabled:bg-red-600 disabled:text-white hover:bg-green-300 "
          onClick={async () => {
            setStartIndex((a) => a + 5); // ITEM-FETCH-LIMIT
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
