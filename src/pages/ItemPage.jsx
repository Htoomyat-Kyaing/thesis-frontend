import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  addToCart,
  // deleteWholeCart,
  addMore,
  removeFromCart,
} from "../redux/user/userSlice";

const ItemPage = () => {
  const params = useParams();
  const [formData, setFormData] = useState({});
  const { currentUser, cart } = useSelector((state) => state.user);
  // const [seller, setSeller] = useState();
  const found1 = cart.find((item) => item.name === formData?.name);
  console.log(cart);
  // console.log(found1);
  // console.log(formData);

  const dispatch = useDispatch();

  const fetchItem = async () => {
    try {
      const res = await fetch(`/api/item/${params.itemId}`);
      const data = await res.json();
      setFormData(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  // const handleBuy = async (sellerId) => {
  //   const res = await fetch(`/api/user/${sellerId}`);
  //   const data = await res.json();
  //   setSeller(data);
  // };

  useEffect(() => {
    fetchItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex flex-col items-center justify-center gap-4 p-4 sm:flex-row sm:items-center">
      <div className="flex flex-col w-full max-w-5xl gap-4 mx-auto sm:flex-row">
        <img
          className="object-contain h-60 sm:h-96 sm:w-80"
          src={formData?.imageUrl}
          alt=""
        />
        <div className="flex flex-col gap-2 text-center">
          <p className="text-2xl font-bold">{formData?.name}</p>
          <div className="flex flex-col justify-center w-full gap-5 sm:justify-between sm:flex-row">
            <p className="flex items-center gap-2 text-xl">
              Category :{" "}
              <span className="px-2 py-1 font-bold text-white bg-purple-600 rounded-lg">
                {formData?.category}
              </span>
            </p>
            <p className="flex items-center gap-2 text-xl">
              Items Left :{" "}
              {formData?.inStock === 0 ? (
                <span className="px-2 py-1 font-bold text-white bg-red-600 rounded-lg">
                  Out of stock
                </span>
              ) : (
                <div className="w-8 h-8 font-bold text-white rounded-full bg-sky-600">
                  {formData.inStock}
                </div>
              )}
            </p>
            <p className="flex items-center gap-2 text-xl">
              Items In Cart :{" "}
              {found1?.amount === undefined ? (
                <span className="px-2 py-1 font-bold text-white bg-red-600 rounded-lg">
                  0
                </span>
              ) : (
                <div className="w-8 h-8 font-bold text-white rounded-full bg-emerald-600">
                  {found1?.amount}
                </div>
              )}
            </p>
          </div>
          {formData?.description ? (
            <p>{formData.description}</p>
          ) : (
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda
              tempore voluptatibus recusandae hic quis ducimus obcaecati magnam
              quas incidunt vero, quam, commodi illum odio! Voluptatum a ut sunt
              facere ab!
            </p>
          )}
          <div className="flex justify-center w-full gap-8 text-xl font-semibold">
            <p className="text-orange-600">
              Original Price :{" "}
              {formData?.originalPrice
                ? formData.originalPrice + " Kyats"
                : "UNKNOWN"}
            </p>
            <p className="text-lime-600">
              Sell Price : {formData?.sellPrice} Kyats
            </p>
          </div>
          {currentUser ? (
            currentUser?._id !== formData?.userRef && (
              <>
                {/* <button
                  onClick={() => {
                    handleBuy(formData?.userRef);
                  }}
                  className="self-center px-2 py-1 font-bold border-2 border-green-600 rounded-lg hover:bg-green-600 hover:text-white hover:border-black w-fit"
                >
                  Contact To Buy
                </button>
                {seller ? (
                  <div>
                    <p>Seller Name : {seller.username}</p>
                    <p>Seller Email : {seller.email}</p>
                  </div>
                ) : (
                  ""
                )} */}
                <div className="flex justify-between gap-5">
                  <button
                    disabled={
                      formData.inStock === 0 ||
                      formData?.inStock === found1?.amount
                    }
                    className="self-center px-2 py-1 font-bold capitalize border-2 border-green-600 rounded-lg hover:bg-green-600 hover:text-white w-fit disabled:border-gray-600 disabled:hover:bg-white disabled:text-gray-700 disabled:opacity-75"
                    onClick={() => {
                      if (found1 === undefined) {
                        dispatch(
                          addToCart({
                            id: formData?._id,
                            imageUrl: formData?.imageUrl,
                            name: formData?.name,
                            amount: 1,
                            inStock: formData?.inStock,
                            sellPrice: formData?.sellPrice,
                          })
                        );
                      } else {
                        dispatch(addMore(found1?.name));
                      }
                    }}
                  >
                    Add To Cart
                  </button>
                  <button
                    disabled={
                      formData.inStock === 0 ||
                      found1?.amount === undefined ||
                      cart.length === 0
                    }
                    className="self-center px-2 py-1 font-bold capitalize border-2 border-red-600 rounded-lg hover:bg-red-600 hover:text-white w-fit disabled:border-gray-600 disabled:hover:bg-white disabled:text-gray-700 disabled:opacity-75"
                    onClick={() => {
                      dispatch(removeFromCart(found1.name));
                    }}
                  >
                    Remove From Cart
                  </button>
                </div>
              </>
            )
          ) : (
            <p className="text-xl font-semibold text-red-600">
              You need to sign in to buy this product
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

export default ItemPage;
