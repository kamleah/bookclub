import React from "react";
import { useForm } from "react-hook-form";

type AuthorFormInputs = {
  fullName: string;
  bio: string;
  image: FileList; // 👈 Image field (FileList because input type="file")
};

type AuthorFormProps = {
  onSubmit: (data: AuthorFormInputs) => void;
};

const AuthorForm: React.FC<AuthorFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<AuthorFormInputs>();

  const imageFile = watch("image"); // 👀 watch file to show preview

  const submitHandler = (data: AuthorFormInputs) => {
    // convert FileList to File (only first image)
    const file = data.image?.[0];
    const formData = new FormData();

    formData.append("fullName", data.fullName);
    formData.append("bio", data.bio);
    if (file) {
      formData.append("image", file);
    }

    console.log("✅ Submitted Data:", data);
    console.log("📦 FormData preview:", Object.fromEntries(formData));

    onSubmit(data); // You can send 'formData' to API here instead
    reset();
  };

  return (
    <form
      id="authorForm"
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-4"
      encType="multipart/form-data"
    >
      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          {...register("fullName", { required: "Full name is required" })}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
            errors.fullName ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="John Doe"
        />
        {errors.fullName && (
          <p className="text-sm text-red-500 mt-1">
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio
        </label>
        <textarea
          rows={3}
          {...register("bio", { required: "Bio is required" })}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 resize-none ${
            errors.bio ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Tell us about yourself..."
        />
        {errors.bio && (
          <p className="text-sm text-red-500 mt-1">{errors.bio.message}</p>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Profile Image
        </label>
        <input
          type="file"
          accept="image/*"
          {...register("image", {
            required: "Profile image is required",
          })}
          className={`w-full border border-gray-300 rounded-lg p-2 file:mr-3 file:py-1 file:px-3 file:border-0 file:rounded-lg file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer`}
        />
        {errors.image && (
          <p className="text-sm text-red-500 mt-1">{errors.image.message}</p>
        )}

        {/* Image Preview */}
        {imageFile && imageFile.length > 0 && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-1">Preview:</p>
            <img
              src={URL.createObjectURL(imageFile[0])}
              alt="Preview"
              className="h-24 w-24 rounded-lg object-cover border"
            />
          </div>
        )}
      </div>

      {/* Hidden submit (for external trigger) */}
      <button type="submit" hidden>
        Submit
      </button>
    </form>
  );
};

export default AuthorForm;
