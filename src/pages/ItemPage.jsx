import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const ItemPage = () => {
  const params = useParams();
  const [formData, setFormData] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [seller, setSeller] = useState();

  const fetchItem = async () => {
    try {
      const res = await fetch(`/api/item/${params.itemId}`);
      const data = await res.json();
      setFormData(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleBuy = async (sellerId) => {
    const res = await fetch(`/api/user/${sellerId}`);
    const data = await res.json();
    setSeller(data);
  };

  useEffect(() => {
    fetchItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex flex-col items-center justify-center gap-4 p-4">
      <img className="object-contain h-60" src={formData?.imageUrl} alt="" />
      <div className="flex flex-col gap-2 text-center">
        <p className="text-2xl font-bold">{formData?.name}</p>
        <p className="text-xl">
          Category :{" "}
          <span className="px-2 py-1 font-bold text-white bg-purple-600 rounded-lg">
            {formData?.category}
          </span>
        </p>
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
              <button
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
              )}
            </>
          )
        ) : (
          <p className="text-xl font-semibold text-red-600">
            You need to sign in to buy this product
          </p>
        )}
      </div>
    </main>
  );
};

export default ItemPage;
