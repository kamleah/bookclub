import React, { FC, useEffect, useState } from "react";
import { Button } from "../../components/Buttons";
import { Modal } from "../../components/Modals";
import BCTable from "../../components/Tables/Table/Table";
import BookForm from "../../forms/AddBookForm";
import { Book, User, Calendar, FileText, Eye, Download, ExternalLink } from "lucide-react";

const Books: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit">("create");
  const [editingBook, setEditingBook] = useState<any>(null);
  const [viewingBook, setViewingBook] = useState<any>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // ✅ Fetch books with pagination
  const fetchBooks = async (currentPage = page, perPage = limit) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/books?page=${currentPage}&limit=${perPage}`
      );
      const data = await res.json();

      setBooks(data.data || []);
      setTotal(data.totalBooks || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(page, limit);
  }, [page, limit]);

  // ✅ Handle form submit (create/update book)
  const handleFormSubmit = async (formData: any) => {
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);

      if (formData.publishedYear) {
        data.append("publishedYear", String(Number(formData.publishedYear)));
      }

      data.append("authorId", String(Number(formData.authorId)));

      // Add cover image if provided
      if (formData.coverImage && formData.coverImage.length > 0) {
        data.append("coverImage", formData.coverImage[0]);
      }

      // Add PDF if provided
      if (formData.pdf && formData.pdf.length > 0) {
        data.append("pdf", formData.pdf[0]);
      }

      const url = modalType === "create" 
        ? "http://localhost:3000/books" 
        : `http://localhost:3000/books/${editingBook.id}`;
      
      const method = modalType === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        body: data,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to ${modalType === "create" ? "create" : "update"} book: ${res.status} - ${errorText}`);
      }

      const result = await res.json();
      console.log(`✅ Book ${modalType === "create" ? "created" : "updated"} successfully:`, result);

      setIsModalOpen(false);
      setEditingBook(null);
      setPage(1);
      fetchBooks(1, limit);
    } catch (err) {
      console.error(`Error ${modalType === "create" ? "creating" : "updating"} book:`, err);
      alert(`Failed to ${modalType === "create" ? "create" : "update"} book. Please check the console for details.`);
    }
  };

  // ✅ Handlers for view, edit, delete
  const handleEdit = (item: any) => {
    setEditingBook(item);
    setModalType("edit");
    setIsModalOpen(true);
  };

  const handleView = (item: any) => {
    setViewingBook(item);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      const res = await fetch(`http://localhost:3000/books/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // If we're on the last page and it's the only item, go to previous page
        if (books.length === 1 && page > 1) {
          setPage(page - 1);
          fetchBooks(page - 1, limit);
        } else {
          fetchBooks(page, limit);
        }
      } else {
        alert("Failed to delete book");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Error deleting book");
    }
  };

  const handleAddBook = () => {
    setModalType("create");
    setEditingBook(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingBook(null);
  };

  const getImageUrl = (image: string) => {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    return `http://localhost:3000${image}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleReadBook = (book: any) => {
    if (book.pdf) {
      const pdfUrl = book.pdf.startsWith('http') ? book.pdf : `http://localhost:3000${book.pdf}`;
      window.open(pdfUrl, '_blank');
    }
  };

  const handleDownloadBook = (book: any) => {
    if (book.pdf) {
      const pdfUrl = book.pdf.startsWith('http') ? book.pdf : `http://localhost:3000${book.pdf}`;
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${book.title}.pdf`;
      link.click();
    }
  };

  // ✅ Table headers
  const headers = [
    { key: "id", label: "ID", className: "w-20" },
    {
      key: "coverImage",
      label: "Cover",
      className: "w-20",
      render: (value: string, row: any) => (
        <div className="flex justify-center">
          {value ? (
            <img
              src={`http://localhost:3000${value}`}
              alt={row.title}
              className="w-12 h-16 object-cover rounded border border-gray-200 shadow-sm"
            />
          ) : (
            <div className="w-12 h-16 rounded bg-gray-100 flex items-center justify-center border border-gray-300">
              <Book className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "title",
      label: "Title",
      className: "font-medium min-w-48",
    },
    {
      key: "description",
      label: "Description",
      className: "min-w-64",
      render: (value: string) => (
        <span className="max-w-xs truncate block" title={value}>
          {value || "No description provided"}
        </span>
      ),
    },
    {
      key: "publishedYear",
      label: "Published Year",
      className: "w-32 text-center",
    },
    {
      key: "author",
      label: "Author",
      className: "min-w-32",
      render: (value: any) => <span>{value?.name || "Unknown Author"}</span>,
    },
    {
      key: "pdf",
      label: "PDF File",
      className: "w-32",
      render: (value: string) =>
        value ? (
          <a
            href={`http://localhost:3000${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View PDF
          </a>
        ) : (
          <span className="text-gray-500 text-sm">No PDF</span>
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

  const modalTitle = modalType === "create" ? "Add New Book" : "Edit Book";
  const submitButtonText = modalType === "create" ? "Create Book" : "Update Book";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Books</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your books and their information
            </p>
          </div>
          <Button
            size="md"
            title="Add Book"
            onClick={handleAddBook}
          />
        </div>

        {/* Table Section */}
        <div>
          <BCTable
            headers={headers}
            data={books}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            showViewIcon={true}
            showEditIcon={true}
            showDeleteIcon={true}
            isLoading={loading}
            emptyMessage="No books found"
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

      {/* Modal for Create/Edit Book */}
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
                ? "All fields marked with * are required" 
                : "Leave file fields empty to keep existing files"
              }
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
                form="bookForm"
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                {submitButtonText}
              </button>
            </div>
          </div>
        }
      >
        <BookForm
          onSubmit={handleFormSubmit}
          initialData={editingBook}
          isEditing={modalType === "edit"}
        />
      </Modal>

      {/* Modal for View Book Details */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        title="Book Details"
        size="xl"
        animation="fade"
        footer={
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Book information and download options
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCloseViewModal}
                className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Close
              </button>
              {viewingBook && (
                <button
                  onClick={() => {
                    handleCloseViewModal();
                    handleEdit(viewingBook);
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  Edit Book
                </button>
              )}
            </div>
          </div>
        }
      >
        {viewingBook && (
          <div className="space-y-6">
            {/* Book Header */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Book Cover */}
              <div className="flex-shrink-0">
                <div className="w-48 h-64 rounded-lg overflow-hidden shadow-lg border border-gray-200">
                  {viewingBook.coverImage ? (
                    <img
                      src={getImageUrl(viewingBook.coverImage)}
                      alt={viewingBook.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <Book className="w-16 h-16 text-gray-500" />
                    </div>
                  )}
                </div>
              </div>

              {/* Book Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {viewingBook.title}
                </h2>
                
                {/* Author Info */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    {viewingBook.author?.image ? (
                      <img
                        src={getImageUrl(viewingBook.author.image)}
                        alt={viewingBook.author.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{viewingBook.author?.name}</p>
                    <p className="text-sm text-gray-600">Author</p>
                  </div>
                </div>

                {/* Book Metadata */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Published: {viewingBook.publishedYear || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span>Format: PDF</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleReadBook(viewingBook)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Read Book</span>
                  </button>
                  <button
                    onClick={() => handleDownloadBook(viewingBook)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Description</span>
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700 leading-relaxed">
                  {viewingBook.description || "No description available for this book."}
                </p>
              </div>
            </div>

            {/* Book Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Book Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Book ID</span>
                    <span className="font-medium text-gray-900">#{viewingBook.id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Title</span>
                    <span className="font-medium text-gray-900">{viewingBook.title}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Author</span>
                    <span className="font-medium text-gray-900">{viewingBook.author?.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Published Year</span>
                    <span className="font-medium text-gray-900">{viewingBook.publishedYear || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Added Date</span>
                    <span className="font-medium text-gray-900">{formatDate(viewingBook.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      handleCloseViewModal();
                      handleEdit(viewingBook);
                    }}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    Edit Book Details
                  </button>
                  <button
                    onClick={() => handleReadBook(viewingBook)}
                    className="w-full px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Read Online</span>
                  </button>
                  <button
                    onClick={() => handleDownloadBook(viewingBook)}
                    className="w-full px-4 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => {
                      handleCloseViewModal();
                      handleDelete(viewingBook.id);
                    }}
                    className="w-full px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                  >
                    Delete Book
                  </button>
                </div>
              </div>
            </div>

            {/* PDF Preview */}
            {viewingBook.pdf && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">PDF Preview</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-red-500" />
                      <div>
                        <p className="font-medium text-gray-900">Book PDF</p>
                        <p className="text-sm text-gray-600">Available for reading and download</p>
                      </div>
                    </div>
                    <a
                      href={getImageUrl(viewingBook.pdf) || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                    >
                      Open PDF
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Books;