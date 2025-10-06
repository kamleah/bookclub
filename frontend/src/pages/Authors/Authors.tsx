import React, { FC, useEffect, useState } from "react";
import { Button } from "../../components/Buttons";
import { Modal } from "../../components/Modals";
import AuthorForm from "../../forms/AuthorForm";
import BCTable from "../../components/Tables/Table/Table";

const Authors: FC = () => {
  const [isBasicOpen, setIsBasicOpen] = useState(false);
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // ✅ Fetch authors with pagination
  const fetchAuthors = async (currentPage = page, perPage = limit) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/authors?page=${currentPage}&limit=${perPage}`
      );
      const data = await res.json();

      setAuthors(data.data || []);
      setTotal(data.totalAuthors || 0); // Use totalAuthors from API
      setTotalPages(data.totalPages || 0); // Use totalPages from API
    } catch (error) {
      console.error("Error fetching authors:", error);
      setAuthors([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors(page, limit);
  }, [page, limit]);

  // ✅ Handle form submit (create new author)
  const handleFormSubmit = async (formData: any) => {
    try {
      const data = new FormData();
      data.append("name", formData.fullName);
      data.append("bio", formData.bio);

      if (formData.image && formData.image.length > 0) {
        data.append("image", formData.image[0]);
      }

      const res = await fetch("http://localhost:3000/authors", {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("Failed to create author");
      
      setIsBasicOpen(false);
      // Refresh to first page to show the new author
      setPage(1);
      fetchAuthors(1, limit);
    } catch (err) {
      console.error("Error creating author:", err);
      alert("Failed to create author");
    }
  };

  // ✅ Handlers for view, edit, delete
  const handleEdit = (item: any) => {
    alert(`Edit Author: ${item.name}`);
    // You can implement edit functionality here
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this author?")) return;

    try {
      const res = await fetch(`http://localhost:3000/authors/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // If we're on the last page and it's the only item, go to previous page
        if (authors.length === 1 && page > 1) {
          setPage(page - 1);
          fetchAuthors(page - 1, limit);
        } else {
          fetchAuthors(page, limit);
        }
      } else {
        alert("Failed to delete author");
      }
    } catch (error) {
      console.error("Error deleting author:", error);
      alert("Error deleting author");
    }
  };

  const handleView = (item: any) => {
    alert(`Author Details:\n\nName: ${item.name}\nBio: ${item.bio}`);
  };

  // ✅ Table headers
  const headers = [
  { key: "id", label: "ID", className: "w-20" },
  { 
    key: "image", 
    label: "Image",
    className: "w-24",
    render: (value: string, row: any) => (
      <div className="flex justify-center">
        {value ? (
          <img 
            src={`http://localhost:3000${value}`} 
            alt={row.name}
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300">
            <span className="text-gray-500 text-xs">No image</span>
          </div>
        )}
      </div>
    )
  },
  { 
    key: "name", 
    label: "Name", 
    className: "font-medium min-w-32" 
  },
  { 
    key: "bio", 
    label: "Bio",
    className: "min-w-48",
    render: (value: string) => (
      <span className="max-w-xs truncate block" title={value}>
        {value || "No bio provided"}
      </span>
    )
  },
  {
    key: "createdAt",
    label: "Created Date",
    className: "w-32",
    render: (value: string) => (
      <span className="text-sm text-gray-600">
        {new Date(value).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </span>
    )
  },
];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Authors</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your authors and their information
            </p>
          </div>
          <Button
            size="md"
            title="Add Author"
            onClick={() => setIsBasicOpen(true)}
          />
        </div>

        {/* Table Section */}
        <div>
          <BCTable
            headers={headers}
            data={authors}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            showViewIcon={true}
            showEditIcon={true}
            showDeleteIcon={true}
            isLoading={loading}
            emptyMessage="No authors found"
            
            // External pagination props
            externalPagination={true}
            currentPage={page}
            totalItems={total}
            itemsPerPage={limit}
            onPageChange={setPage}
            onItemsPerPageChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1); // Reset to first page when changing items per page
            }}
            showPagination={true}
            itemsPerPageOptions={[5, 10, 20, 50]}
          />
        </div>
      </div>

      {/* Modal for Create Author */}
      <Modal
        isOpen={isBasicOpen}
        onClose={() => setIsBasicOpen(false)}
        title="Add New Author"
        size="lg"
        animation="fade"
        footer={
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              All fields marked with * are required
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsBasicOpen(false)}
                className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="authorForm"
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                Create Author
              </button>
            </div>
          </div>
        }
      >
        <AuthorForm onSubmit={handleFormSubmit} />
      </Modal>
    </div>
  );
};

export default Authors;