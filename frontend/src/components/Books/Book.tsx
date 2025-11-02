import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

type Review = { id: string; body: string };

interface Book {
  title: string;
  author: string;
  isPublished: boolean;
  reviews: Review[];
}

interface GetBookData {
  book: Book;
}

const GET_BOOK = gql`
  query GetBook($id: ID!) {
    book(id: $id) {
      title
      author
      isPublished
      reviews {
        id
        body
      }
    }
  }
`;

const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id) {
      success
      message
    }
  }
`;

export default function Book() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  // 🧠 All hooks should be here — not below any conditional return
  const { loading, error, data } = useQuery<GetBookData>(GET_BOOK, {
    variables: { id },
    skip: !id,
  });

  const [deleteBook, { loading: deleting }] = useMutation(DELETE_BOOK, {
    onCompleted: () => {
      navigate("/"); // go back to home/list after delete
    },
    refetchQueries: ["GetBooks"], // optional
  });

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteBook({ variables: { id } });
      setShowModal(false);
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error)
    return (
      <p className="text-center text-red-500 font-semibold">
        Error: {error.message}
      </p>
    );

  const bookData = data?.book;

  return (
    <>
      {/* Book Details Card */}
      <div className="flex justify-center mt-10">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-3xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-4xl font-extrabold text-gray-900">
              {bookData?.title}
            </h1>
            <p className="text-gray-600 mt-2 text-lg">by {bookData?.author}</p>
          </div>

          {/* Status */}
          <div
            className={`inline-block px-4 py-1 rounded-full text-sm font-medium mb-6 ${
              bookData?.isPublished
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {bookData?.isPublished ? "Published" : "Unpublished"}
          </div>

          {/* Reviews */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Reviews
            </h2>
            {bookData?.reviews.length ? (
              <ul className="space-y-3">
                {bookData.reviews.map((r) => (
                  <li key={r.id} className="bg-gray-100 p-4 rounded-lg">
                    <p className="font-medium text-gray-800">Review #{r.id}</p>
                    <p className="text-gray-700">{r.body}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <Link to={`/book/edit/${id}`} className="flex-1">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 font-medium transition">
                Edit
              </button>
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 border border-red-500 text-red-600 hover:bg-red-500/10 rounded-lg px-6 py-2 font-medium transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-96 p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this book? This action cannot be
              undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
