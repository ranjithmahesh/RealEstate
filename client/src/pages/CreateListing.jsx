import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import React, { useState, useRef } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    address: "",
    description: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [uploading, setUploading] = useState(false);
  const navigator = useNavigate();
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };
  const [imageUploadError, setImageUploadError] = useState(false);

  console.log(formData);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          console.log(err);
          setUploading(false);
        });
    } else {
      setImageUploadError("you can only upload 6imges per listing");
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const stroage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(stroage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${Math.round(progress)} % done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("you must upload at least one Image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);

      const res = await fetch(`/api/listing/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
      }
      navigator(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({ ...formData, type: e.target.id });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center my-7">Create a Listing</h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1 ">
          <input
            onChange={handleChange}
            type="text"
            value={formData.name}
            placeholder="Name"
            className="border p-3 rounded-lg   "
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            onChange={handleChange}
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg   "
            id="description"
            value={formData.description}
            required
          />
          <input
            onChange={handleChange}
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg   "
            id="address"
            value={formData.address}
            required
          />
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2 ">
              <input
                onChange={handleChange}
                type="checkbox"
                className="w-5"
                id="sale"
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2 ">
              <input
                onChange={handleChange}
                type="checkbox"
                className="w-5"
                id="rent"
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2 ">
              <input
                onChange={handleChange}
                type="checkbox"
                className="w-5"
                id="parking"
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                type="checkbox"
                className="w-5"
                id="furnished"
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2 ">
              <input
                onChange={handleChange}
                type="checkbox"
                className="w-5"
                id="offer"
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                onChange={handleChange}
                type="number"
                id="bedrooms"
                required
                min="1"
                max="10"
                className="p-3 border border-gray-300 rounded-lg"
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                onChange={handleChange}
                type="number"
                id="bathrooms"
                required
                min="1"
                max="10"
                className="p-3 border border-gray-300 rounded-lg"
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                onChange={handleChange}
                type="number"
                id="regularPrice"
                required
                min="50"
                max="10000"
                className="p-3 border border-gray-300 rounded-lg"
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($/month)</span>
              </div>
            </div>

            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  onChange={handleChange}
                  type="number"
                  id="discountPrice"
                  required
                  min="0"
                  max="10000"
                  className="p-3 border border-gray-300 rounded-lg"
                  value={formData.discountPrice}
                />

                <div className="flex flex-col items-center">
                  <p>Discounted price</p>
                  <span className="text-xs">($/month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4 ">
            <input
              onChange={(e) => {
                setFiles(e.target.files);
              }}
              className="p-3 border-gray-300 rounded w-full border"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80  "
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing image "
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className=" p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-85"
            disabled={loading || uploading}
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          <p className="text-red-700 text-sm">{error ? error : ""}</p>
        </div>
      </form>
    </main>
  );
}
