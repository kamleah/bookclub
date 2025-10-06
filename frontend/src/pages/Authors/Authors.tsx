import React, { FC, useEffect, useState } from "react";
import { Button } from "../../components/Buttons";
import { Modal } from "../../components/Modals";
import AuthorForm from "../../forms/AuthorForm";
import BCTable from "../../components/Tables/Table/Table";
import { User, Book, Calendar, FileText, Eye, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Authors: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit">("create");
  const [editingAuthor, setEditingAuthor] = useState<any>(null);
  const [viewingAuthor, setViewingAuthor] = useState<any>(null);
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  // ✅ Fetch authors with pagination
  const fetchAuthors = async (currentPage = page, perPage = limit) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/authors?page=${currentPage}&limit=${perPage}`
      );
      const data = await res.json();

      setAuthors(data.data || []);
      setTotal(data.totalAuthors || 0);
      setTotalPages(data.totalPages || 0);
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

  // ✅ Handle form submit (create/update author)
  const handleFormSubmit = async (formData: any) => {
    try {
      const data = new FormData();
      data.append("name", formData.fullName);
      data.append("bio", formData.bio);

      // Add image if provided
      if (formData.image && formData.image.length > 0) {
        data.append("image", formData.image[0]);
      }

      const url =
        modalType === "create"
          ? "http://localhost:3000/authors"
          : `http://localhost:3000/authors/${editingAuthor.id}`;

      const method = modalType === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        body: data,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Failed to ${modalType === "create" ? "create" : "update"} author: ${
            res.status
          } - ${errorText}`
        );
      }

      const result = await res.json();
      console.log(
        `✅ Author ${
          modalType === "create" ? "created" : "updated"
        } successfully:`,
        result
      );

      setIsModalOpen(false);
      setEditingAuthor(null);
      setPage(1);
      fetchAuthors(1, limit);
    } catch (err) {
      console.error(
        `Error ${modalType === "create" ? "creating" : "updating"} author:`,
        err
      );
      alert(
        `Failed to ${
          modalType === "create" ? "create" : "update"
        } author. Please check the console for details.`
      );
    }
  };

  // ✅ Handlers for view, edit, delete
  const handleEdit = (item: any) => {
    setEditingAuthor(item);
    setModalType("edit");
    setIsModalOpen(true);
  };

  const handleView = (item: any) => {
    setViewingAuthor(item);
    setIsViewModalOpen(true);
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

  const handleAddAuthor = () => {
    setModalType("create");
    setEditingAuthor(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAuthor(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingAuthor(null);
  };

  const getImageUrl = (image: string) => {
    if (!image) return null;
    if (image.startsWith("http")) return image;
    return `http://localhost:3000${image}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
              <User className="w-4 h-4 text-gray-500" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      label: "Name",
      className: "font-medium min-w-32",
    },
    {
      key: "bio",
      label: "Bio",
      className: "min-w-48",
      render: (value: string) => (
        <span className="max-w-xs truncate block" title={value}>
          {value || "No bio provided"}
        </span>
      ),
    },
    {
      key: "_count",
      label: "Books",
      className: "w-20 text-center",
      render: (value: any) => (
        <span className="text-sm text-gray-600 font-medium">
          {value?.books || 0}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created Date",
      className: "w-32",
      render: (value: string) => (
        <span className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
  ];

  const modalTitle = modalType === "create" ? "Add New Author" : "Edit Author";
  const submitButtonText =
    modalType === "create" ? "Create Author" : "Update Author";

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
          <Button size="md" title="Add Author" onClick={handleAddAuthor} />
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

      {/* Modal for Create/Edit Author */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalTitle}
        size="lg"
        animation="fade"
        footer={
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {modalType === "create"
                ? "All fields are required"
                : "Leave image field empty to keep existing image"}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="authorForm"
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                {submitButtonText}
              </button>
            </div>
          </div>
        }
      >
        <AuthorForm
          onSubmit={handleFormSubmit}
          initialData={editingAuthor}
          isEditing={modalType === "edit"}
        />
      </Modal>

      {/* Modal for View Author Details */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        title="Author Details"
        size="lg"
        animation="fade"
        footer={
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Author information and statistics
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCloseViewModal}
                className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Close
              </button>
              {viewingAuthor && (
                <button
                  onClick={() => {
                    handleCloseViewModal();
                    handleEdit(viewingAuthor);
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  Edit Author
                </button>
              )}
            </div>
          </div>
        }
      >
        {viewingAuthor && (
          <div className="space-y-6">
            {/* Author Header */}
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  {viewingAuthor.image ? (
                    <img
                      src={getImageUrl(viewingAuthor.image)}
                      alt={viewingAuthor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-500" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {viewingAuthor.name}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Book className="w-4 h-4" />
                    <span>
                      {viewingAuthor._count?.books || 0} Published Books
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {formatDate(viewingAuthor.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Biography</span>
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700 leading-relaxed">
                  {viewingAuthor.bio ||
                    "No biography available for this author."}
                </p>
              </div>
            </div>

            {/* Statistics */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {viewingAuthor._count?.books || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Books</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {Math.ceil(
                      (new Date().getTime() -
                        new Date(viewingAuthor.createdAt).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}
                  </div>
                  <div className="text-sm text-gray-600">Days Active</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {new Date(viewingAuthor.createdAt).getFullYear()}
                  </div>
                  <div className="text-sm text-gray-600">Joined Year</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {viewingAuthor.updatedAt
                      ? formatDate(viewingAuthor.updatedAt).split(" at ")[0]
                      : "Never"}
                  </div>
                  <div className="text-sm text-gray-600">Last Updated</div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Author Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Author ID</span>
                    <span className="font-medium text-gray-900">
                      #{viewingAuthor.id}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-medium text-gray-900">
                      {formatDate(viewingAuthor.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="font-medium text-gray-900">
                      {viewingAuthor.updatedAt
                        ? formatDate(viewingAuthor.updatedAt)
                        : "Never"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      handleCloseViewModal();
                      handleEdit(viewingAuthor);
                    }}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    Edit Author Profile
                  </button>
                  {/* <button
                    onClick={() => {
                      handleCloseViewModal();
                      navigate(`/author/${viewingAuthor.id}`);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    View Author's Books
                  </button> */}
                  <button
                    onClick={() => {
                      handleCloseViewModal();
                      handleDelete(viewingAuthor.id);
                    }}
                    className="w-full px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                  >
                    Delete Author
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Authors;
