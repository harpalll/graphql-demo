import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useState, type ReactEventHandler } from "react";
import { useNavigate } from "react-router-dom";

// interface Book {
//   title: string;
//   author: string;
//   isPublished: boolean;
// }

const GET_BOOKS = gql`
  query GetBooks {
    books {
      id
      title
      author
      isPublished
    }
  }
`;

const ADD_BOOK = gql`
  mutation AddBook($title: String!, $author: String!, $isPublished: Boolean!) {
    addBook(title: $title, author: $author, isPublished: $isPublished) {
      success
      message
    }
  }
`;

export default function AddBookForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState(false);
  const navigate = useNavigate();
  const [addBook, { loading, error }] = useMutation(ADD_BOOK);

  const handleSubmit: ReactEventHandler = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      return;
    }

    try {
      await addBook({
        variables: {
          title,
          author,
          isPublished: published,
        },
        refetchQueries: [{ query: GET_BOOKS }],
      });
      navigate(`/`);
    } catch (error) {
      console.error(error);
    }

    setTitle("");
    setAuthor("");
    setPublished(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col gap-8 rounded-xl border border-border-light bg-content-light shadow-sm p-6 sm:p-8 md:p-10">
        <div className="flex flex-wrap justify-between gap-3">
          <h2 className="text-text-light-primary text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
            Add a New Book
          </h2>
        </div>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="book-title"
              className="text-text-light-primary text-base font-medium leading-normal"
            >
              Title
            </label>
            <input
              id="book-title"
              name="title"
              placeholder="Enter book title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300  bg-gray-50  text-gray-900 :outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="author-name"
              className="text-text-light-primary text-base font-medium leading-normal"
            >
              Author
            </label>
            <input
              id="author-name"
              name="author"
              placeholder="e.g., J.R.R. Tolkien"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300  bg-gray-50  text-gray-900 :outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <input
              id="published-status"
              name="published"
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="form-checkbox h-5 w-5 rounded border-border-light border-2 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-2 focus:ring-offset-0 focus:ring-primary/50"
            />
            <label
              htmlFor="published-status"
              className="text-text-light-primary text-base font-normal leading-normal flex-1 truncate"
            >
              Is this book published?
            </label>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background-light disabled:cursor-not-allowed disabled:bg-primary/50"
            >
              {loading ? <span>Adding Book</span> : <span>Add Book</span>}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            <p>Title is required. Please fill out the field.</p>
            <p className="text-red-500">{error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
