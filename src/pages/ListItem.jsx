import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { app } from "../firebase/app.js";
import { useNavigate } from "react-router-dom";

const ListItem = () => {
  const [loading, setLoading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState();
  const [imageUploadProgress, setImageUploadProgress] = useState(undefined);
  const [image, setImage] = useState();
  const [imageName, setImageName] = useState();
  const fileRef = useRef();
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState();
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.type === "number") {
      setFormData({
        ...formData,
        [e.target.name]: parseInt(e.target.value),
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(
      // `${import.meta.env.VITE_BASE_URL}/user/update/${currentUser._id}`,
      `/api/item/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      }
    );
    setLoading(true);
    try {
      const data = await res.json();
      if (data.success === false) {
        console.log("server error");
        if (
          data.message ===
          "Item validation failed: imageUrl: Path `imageUrl` is required."
        )
          setImageUploadError("Image is required to list the item");
        setLoading(false);
        return;
      }
      console.log(data);
      setLoading(false);
      navigate("/your-items");
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  const handleImageUpload = () => {
    console.log("Image Upload");
    const storage = getStorage(app);
    const imageName = new Date().getTime() + image.name;
    setImageName(imageName);
    const storageRef = ref(storage, imageName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Uploading : " + Math.round(progress) + " %");
        setImageUploadProgress(Math.round(progress));
      },
      (error) => {
        console.log(error);
        setImageUploadError("Must be an image less than 2MB");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log(downloadURL);
          setFormData({ ...formData, imageUrl: downloadURL });
        });
      }
    );
  };

  const handleImageDelete = () => {
    const storage = getStorage(app);
    const imageRef = ref(storage, imageName);
    deleteObject(imageRef)
      .then(() => {
        console.log(imageRef + " has been deleted");
        setImage(undefined);
        setImageName(undefined);
        setImageUploadProgress(undefined);
        setLoading(false);
        setFormData({ ...formData, imageUrl: null });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (image) {
      handleImageUpload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  return (
    <main className="p-3">
      <div className="flex flex-col items-center justify-center max-w-5xl gap-4 mx-auto">
        <h2 className="text-xl font-bold">List Your Item To Market</h2>
        {imageUploadError ? (
          <span className="text-center text-red-600">{imageUploadError}</span>
        ) : imageUploadProgress > 0 && imageUploadProgress < 100 ? (
          <span className="text-center text-emerald-600">
            Uploading : {imageUploadProgress} %
          </span>
        ) : imageUploadProgress === 100 ? (
          <span className="text-center text-emerald-600">
            Image uploaded successfully
          </span>
        ) : (
          ""
        )}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full max-w-sm gap-4 sm:max-w-md"
        >
          <div className="flex flex-wrap items-center justify-between w-full">
            <label htmlFor="item_picture">Item Picture</label>
            <input
              className="sr-only"
              type="file"
              ref={fileRef}
              accept="image/"
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
            />
            {image ? (
              <div className="flex gap-4">
                <img
                  className="w-20 h-full"
                  src={formData?.imageUrl}
                  alt="item_picture.jpg"
                  name="item_picture"
                  onClick={() => {
                    fileRef.current.click();
                  }}
                />
                <button
                  className="text-red-600 hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    handleImageDelete();
                    fileRef.current.value = ""; // NEED TO RESET FILEREF VALUE TO REUPLOAD SAME PICTURE
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <a
                className="hover:underline"
                onClick={() => {
                  fileRef.current.click();
                }}
              >
                Upload Image
              </a>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between w-full">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              // required
              className="p-2 border-2 rounded-lg"
              placeholder="Name"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between w-full">
            <label htmlFor="originalPrice">Original Price</label>
            <input
              type="number"
              // required
              name="originalPrice"
              className="p-2 border-2 rounded-lg"
              placeholder="Original Price"
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between w-full">
            <label htmlFor="sellPrice">Sell Price</label>
            <input
              type="number"
              // required
              name="sellPrice"
              className="p-2 border-2 rounded-lg"
              placeholder="Sell Price"
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between w-full">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              name="category"
              // required
              className="p-2 border-2 rounded-lg"
              placeholder="Category"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between w-full">
            <label htmlFor="category">In Stock</label>
            <input
              type="number"
              name="inStock"
              // required
              className="p-2 border-2 rounded-lg"
              placeholder="In Stock"
              onChange={handleChange}
              defaultValue={formData?.inStock}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between w-full">
            <label htmlFor="description">Description</label>
            <textarea
              cols={30}
              rows={5}
              name="description"
              // required
              className="p-2 border-2 rounded-lg"
              placeholder="Description"
              onChange={handleChange}
            />
          </div>
          <button
            disabled={loading}
            className="w-full p-2 font-semibold uppercase rounded-lg bg-emerald-700 text-slate-100 hover:bg-emerald-600 disabled:bg-gray-700"
            type="submit"
          >
            {loading ? "Loading..." : "List the item"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default ListItem;
