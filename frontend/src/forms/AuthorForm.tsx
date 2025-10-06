import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

type AuthorFormInputs = {
  fullName: string;
  bio: string;
  image: FileList;
};

type AuthorFormProps = {
  onSubmit: (data: AuthorFormInputs) => void;
  initialData?: {
    id: number;
    name: string;
    bio: string;
    image?: string;
  };
  isEditing?: boolean;
};

const AuthorForm: React.FC<AuthorFormProps> = ({ 
  onSubmit, 
  initialData, 
  isEditing = false 
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<AuthorFormInputs>();

  const [existingImage, setExistingImage] = useState<string | null>(null);
  const imageFile = watch("image");

  // Set initial data when editing
  useEffect(() => {
    if (initialData && isEditing) {
      setValue("fullName", initialData.name);
      setValue("bio", initialData.bio);
      setExistingImage(initialData.image || null);
    }
  }, [initialData, isEditing, setValue]);

  const submitHandler = (data: AuthorFormInputs) => {
    // convert FileList to File (only first image)
    const file = data.image?.[0];
    const formData = new FormData();

    formData.append("name", data.fullName);
    formData.append("bio", data.bio);
    if (file) {
      formData.append("image", file);
    }

    console.log("✅ Submitted Data:", data);
    console.log("📦 FormData preview:", Object.fromEntries(formData));

    onSubmit(data);
    if (!isEditing) {
      reset();
    }
  };

  const getImageUrl = (image: string) => {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    return `http://localhost:3000${image}`;
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
          Profile Image {!isEditing && <span className="text-red-500">*</span>}
        </label>

        {/* Existing Image Display */}
        {isEditing && existingImage && (
          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-1">Current Image:</p>
            <div className="flex items-center space-x-3">
              <img
                src={getImageUrl(existingImage) || ''}
                alt="Current profile"
                className="h-24 w-24 rounded-lg object-cover border"
              />
              <div className="text-sm text-gray-500">
                <p>Current profile image</p>
                <p className="text-xs">Upload new image to replace</p>
              </div>
            </div>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          {...register("image", {
            required: isEditing ? false : "Profile image is required",
            validate: {
              isImage: (files) => {
                if (!files || files.length === 0) return true;
                const file = files[0];
                return file.type.startsWith('image/') || "Please upload an image file";
              },
              fileSize: (files) => {
                if (!files || files.length === 0) return true;
                const file = files[0];
                const maxSize = 5 * 1024 * 1024; // 5MB
                return file.size <= maxSize || "Image size must be less than 5MB";
              }
            }
          })}
          className={`w-full border border-gray-300 rounded-lg p-2 file:mr-3 file:py-1 file:px-3 file:border-0 file:rounded-lg file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer ${
            errors.image ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.image && (
          <p className="text-sm text-red-500 mt-1">{errors.image.message}</p>
        )}

        {/* New Image Preview */}
        {imageFile && imageFile.length > 0 && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-1">New Image Preview:</p>
            <img
              src={URL.createObjectURL(imageFile[0])}
              alt="Preview"
              className="h-24 w-24 rounded-lg object-cover border"
            />
          </div>
        )}
      </div>

      {/* Form Hints */}
      <div className={`p-3 rounded-lg border ${
        isEditing ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'
      }`}>
        <p className={`text-sm ${isEditing ? 'text-yellow-700' : 'text-blue-700'}`}>
          <strong>Note:</strong> {isEditing ? 'Editing author details. ' : 'Creating new author. '}
          {!isEditing && 'All fields are required. '}
          {isEditing && 'Leave image field empty to keep existing image. '}
          Image files must be under 5MB.
        </p>
      </div>

      {/* Hidden submit (for external trigger) */}
      <button type="submit" hidden>
        Submit
      </button>
    </form>
  );
};

export default AuthorForm;