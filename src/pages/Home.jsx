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
    limit: "5",
    startIndex: "0",
  });
  const urlParams = new URLSearchParams(window.location.search);
  const [startIndex, setStartIndex] = useState(0);
  // let startIndex = 0;

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
    // const res = await fetch(`/api/item/get/items?limit=5`);
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
  }, []);

  const nextPageFetch = async (SI) => {
    let res = null;
    if (SI <= 0) {
      urlParams.set("startIndex", 0);
      const searchQuery = urlParams.toString();
      res = await fetch(`/api/item/get/items?${searchQuery}`);
    } else {
      urlParams.set("startIndex", SI);
      const searchQuery = urlParams.toString();
      res = await fetch(`/api/item/get/items?${searchQuery}`);
    }

    const data = await res.json();
    // navigate(`/page-${startIndex / 5 + 1}`);
    setAllItems(data);
  };

  useEffect(() => {
    nextPageFetch(startIndex);
  }, [startIndex]);

  // useEffect(() => {
  //   console.log(allItems);
  //   // fetchItems(formData);
  // }, [allItems]);

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const searchTermFromUrl = urlParams.get("searchTerm");
  //   if (searchTermFromUrl) setSearchTerm(searchTermFromUrl);
  // }, [location.search]);

  return (
    <div className="flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-center justify-center w-full gap-6 p-6 px-6 bg-blue-300"
      >
        <div className="flex items-center gap-4">
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
        <div className="flex items-center gap-4">
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
        <div className="flex items-center gap-4">
          <label className="w-1/3" htmlFor="category">
            Sort By
          </label>
          <select
            className="w-full p-2 border-2 border-black rounded-lg focus:outline-none min-w-40"
            onChange={handleChange}
            name="sort_order"
          >
            <option value="createdAt_desc">Latest</option>
            <option value="createdAt_asc">Oldest</option>
            <option value="sellPrice_asc">Cheapest</option>
            <option value="sellPrice_desc">Most Expensive</option>
          </select>
        </div>

        <button
          className="py-2 font-bold text-black border-2 border-black rounded-lg min-w-40"
          type="submit"
        >
          Search
        </button>
      </form>
      <div className="flex flex-wrap justify-center flex-grow w-full gap-6 p-6 hover:cursor-pointer">
        {allItems &&
          allItems.length > 0 &&
          allItems.map((item) => (
            <div
              className="flex flex-col items-center justify-center p-2 border-2 border-black rounded-lg min-w-48 min-h-56"
              key={item._id}
            >
              <img
                className="object-contain w-40 h-32"
                src={item.imageUrl}
                alt=""
                onClick={() => {
                  navigate(`/item/${item._id}`);
                }}
              />
              <p className="text-wrap">Name : {item.name}</p>
              <p>Price : {item.sellPrice} Kyats</p>
              <p>Category : {item.category}</p>

              {/* <div className="flex justify-between w-full">
                <p
                  onClick={() => {
                    navigate(`/edit-item/${item._id}`);
                  }}
                  className="text-emerald-600 hover:underline hover:cursor-pointer"
                >
                  Edit
                </p>
                <p
                  onClick={() => {
                    handleDelete(item._id);
                  }}
                  className="text-red-600 hover:underline hover:cursor-pointer"
                >
                  Delete
                </p>
              </div> */}
            </div>
          ))}
      </div>

      <div className="flex justify-between w-full max-w-5xl py-2">
        <button
          disabled={startIndex === 0}
          className="disabled:text-red-600"
          onClick={async () => {
            setStartIndex((a) => a - 5);
            // console.log(startIndex);
            // setFormData({ ...formData, startIndex });
            // fetchItems(formData);
          }}
        >
          prev
        </button>
        <button
          disabled={allItems.length % 5 !== 0}
          className="disabled:text-red-600"
          onClick={async () => {
            setStartIndex((a) => a + 5);
            // console.log(startIndex);
            // setFormData({ ...formData, startIndex });
            // fetchItems(formData);
          }}
        >
          next
        </button>
      </div>
    </div>
  );
};

export default Home;
