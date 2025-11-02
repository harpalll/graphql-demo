import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

import { Link, useParams } from "react-router-dom";

type Review = {
  id: string;
  body: string;
};

interface Book {
  title: string;
  author: string;
  isPublished: boolean;
  reviews: Review[];
}

interface GetBookData {
  book: Book;
}

export default function Book() {
  const { id } = useParams<{ id: string }>();

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

  const { loading, error, data } = useQuery<GetBookData>(GET_BOOK, {
    variables: { id },
    skip: !id,
  });

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error)
    return (
      <p className="text-center text-red-500 font-semibold">
        Error: {error.message}
      </p>
    );

  const bookData = data?.book;

  return (
    <div className="flex justify-center mt-10">
      <div className="bg-white  shadow-lg rounded-xl p-8 w-full max-w-3xl">
        {/* Book Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900 ">
            {bookData?.title}
          </h1>
          <p className="text-gray-600  mt-2 text-lg">by {bookData?.author}</p>
        </div>

        {/* Published Status */}
        <div
          className={`inline-block px-4 py-1 rounded-full text-sm font-medium mb-6 ${
            bookData?.isPublished
              ? "bg-green-100 text-green-800 /40 "
              : "bg-red-100 text-red-800 /40 "
          }`}
        >
          {bookData?.isPublished ? "Published" : "Unpublished"}
        </div>

        {/* Reviews Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 -4">Reviews</h2>
          {bookData?.reviews.length ? (
            <ul className="space-y-3">
              {bookData?.reviews.map((review: { id: string; body: string }) => (
                <li key={review.id} className="bg-gray-100  p-4 rounded-lg">
                  <p className="font-medium text-gray-800 ">
                    Review #{review.id}
                  </p>
                  <p className="text-gray-700 ">{review.body}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 ">No reviews yet.</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link to={`/book/edit/${id}`} className="flex-1">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 font-medium transition">
              Edit
            </button>
          </Link>
          <button className="flex-1 border border-red-500 text-red-600  hover:bg-red-500/10 rounded-lg px-6 py-2 font-medium transition">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
