import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

type BookFormInputs = {
  title: string;
  description: string;
  publishedYear: number;
  authorId: number;
  pdf: FileList;
  coverImage: FileList; // 👈 Add cover image field
};

type Author = {
  id: number;
  name: string;
};

type BookFormProps = {
  onSubmit: (data: BookFormInputs) => void;
};

const BookForm: React.FC<BookFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<BookFormInputs>();

  const [authors, setAuthors] = useState<Author[]>([]);
  const [loadingAuthors, setLoadingAuthors] = useState(false);
  const pdfFile = watch("pdf");
  const coverImageFile = watch("coverImage"); // 👀 watch cover image for preview

  // Fetch authors for dropdown
  useEffect(() => {
    const fetchAuthors = async () => {
      setLoadingAuthors(true);
      try {
        const res = await fetch("http://localhost:3000/authors/list");
        const data = await res.json();
        setAuthors(data || []);
      } catch (error) {
        console.error("Error fetching authors:", error);
        setAuthors([]);
      } finally {
        setLoadingAuthors(false);
      }
    };

    fetchAuthors();
  }, []);

  const submitHandler = (data: BookFormInputs) => {
    console.log("✅ Submitted Book Data:", data);
    onSubmit(data);
    reset();
  };

  const currentYear = new Date().getFullYear();

  return (
    <form
      id="bookForm"
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-4"
      encType="multipart/form-data"
    >
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("title", { 
            required: "Title is required",
            minLength: {
              value: 2,
              message: "Title must be at least 2 characters long"
            }
          })}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter book title"
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={4}
          {...register("description", { 
            required: "Description is required",
            minLength: {
              value: 10,
              message: "Description must be at least 10 characters long"
            }
          })}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 resize-none ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter book description..."
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Published Year */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Published Year
        </label>
        <input
          type="number"
          {...register("publishedYear", {
            valueAsNumber: true,
            min: {
              value: 1000,
              message: "Please enter a valid year"
            },
            max: {
              value: currentYear,
              message: `Year cannot be in the future (max: ${currentYear})`
            }
          })}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
            errors.publishedYear ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="2024"
          min="1000"
          max={currentYear}
        />
        {errors.publishedYear && (
          <p className="text-sm text-red-500 mt-1">
            {errors.publishedYear.message}
          </p>
        )}
      </div>

      {/* Author Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Author <span className="text-red-500">*</span>
        </label>
        <select
          {...register("authorId", { 
            required: "Please select an author",
            valueAsNumber: true
          })}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
            errors.authorId ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select an author</option>
          {loadingAuthors ? (
            <option value="" disabled>Loading authors...</option>
          ) : (
            authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))
          )}
        </select>
        {errors.authorId && (
          <p className="text-sm text-red-500 mt-1">
            {errors.authorId.message}
          </p>
        )}
        {authors.length === 0 && !loadingAuthors && (
          <p className="text-sm text-yellow-600 mt-1">
            No authors found. Please create an author first.
          </p>
        )}
      </div>

      {/* Cover Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cover Image <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept="image/*"
          {...register("coverImage", {
            required: "Cover image is required",
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
            errors.coverImage ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.coverImage && (
          <p className="text-sm text-red-500 mt-1">{errors.coverImage.message}</p>
        )}

        {/* Cover Image Preview */}
        {coverImageFile && coverImageFile.length > 0 && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-1">Cover Preview:</p>
            <img
              src={URL.createObjectURL(coverImageFile[0])}
              alt="Cover preview"
              className="h-32 w-24 object-cover rounded-lg border shadow-sm"
            />
          </div>
        )}
      </div>

      {/* PDF Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          PDF File <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept=".pdf,application/pdf"
          {...register("pdf", {
            required: "PDF file is required",
            validate: {
              isPDF: (files) => {
                if (!files || files.length === 0) return true;
                const file = files[0];
                return file.type === 'application/pdf' || 
                       file.name.toLowerCase().endsWith('.pdf') || 
                       "Please upload a PDF file";
              },
              fileSize: (files) => {
                if (!files || files.length === 0) return true;
                const file = files[0];
                const maxSize = 10 * 1024 * 1024; // 10MB
                return file.size <= maxSize || "File size must be less than 10MB";
              }
            }
          })}
          className={`w-full border border-gray-300 rounded-lg p-2 file:mr-3 file:py-1 file:px-3 file:border-0 file:rounded-lg file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer ${
            errors.pdf ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.pdf && (
          <p className="text-sm text-red-500 mt-1">{errors.pdf.message}</p>
        )}

        {/* PDF File Info */}
        {pdfFile && pdfFile.length > 0 && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
            <p className="text-sm font-medium text-gray-700 mb-1">Selected PDF:</p>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium">{pdfFile[0].name}</p>
                <p className="text-xs">Size: {(pdfFile[0].size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form Hints */}
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> All fields marked with <span className="text-red-500">*</span> are required.
          Cover images must be under 5MB and PDF files under 10MB.
        </p>
      </div>

      <button type="submit" hidden>
        Submit
      </button>
    </form>
  );
};

export default BookForm;