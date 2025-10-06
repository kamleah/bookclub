import React, { FC, useEffect, useState } from "react";
import { Button } from "../../components/Buttons";
import { Modal } from "../../components/Modals";
import AuthorForm from "../../forms/AuthorForm";
import BCTable from "../../components/Tables/Table/Table";
import AddBookForm from "../../forms/AddBookForm";

const Books: FC = () => {
  const [isBasicOpen, setIsBasicOpen] = useState(false);
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

  // ✅ Handle form submit (create new book)
  const handleFormSubmit = async (formData: any) => {
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);

      if (formData.publishedYear) {
        data.append("publishedYear", String(Number(formData.publishedYear)));
      }

      data.append("authorId", String(Number(formData.authorId)));

      // Add cover image
      if (formData.coverImage && formData.coverImage.length > 0) {
        data.append("coverImage", formData.coverImage[0]);
      }

      if (formData.pdf && formData.pdf.length > 0) {
        data.append("pdf", formData.pdf[0]);
      }

      const res = await fetch("http://localhost:3000/books", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to create book: ${res.status} - ${errorText}`);
      }

      const result = await res.json();
      console.log("✅ Book created successfully:", result);

      setIsBasicOpen(false);
      setPage(1);
      fetchBooks(1, limit);
    } catch (err) {
      console.error("Error creating book:", err);
      alert("Failed to create book. Please check the console for details.");
    }
  };

  // ✅ Handlers for view, edit, delete
  const handleEdit = (item: any) => {
    alert(`Edit Book: ${item.title}`);
    // You can implement edit functionality here
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

  const handleView = (item: any) => {
    alert(
      `Book Details:\n\nTitle: ${item.title}\nDescription: ${item.description}\nPublished Year: ${item.publishedYear}\nAuthor: ${item.author?.name}\nPDF: ${item.pdf}`
    );
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
              <span className="text-gray-400 text-xs">No cover</span>
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
            onClick={() => setIsBasicOpen(true)}
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

      {/* Modal for Create Book */}
      <Modal
        isOpen={isBasicOpen}
        onClose={() => setIsBasicOpen(false)}
        title="Add New Book"
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
                form="bookForm"
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                Create Book
              </button>
            </div>
          </div>
        }
      >
        <AddBookForm onSubmit={handleFormSubmit} />
      </Modal>
    </div>
  );
};

export default Books;
