import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Book {
  title: string;
  author: string;
  isPublished: boolean;
}

interface GetBookData {
  book: Book;
}

interface EditBookFormProps {
  initialData?: {
    title: string;
    author: string;
    published: boolean;
  };
  onSubmit: (data: {
    title: string;
    author: string;
    published: boolean;
  }) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

const EditBookForm: React.FC<EditBookFormProps> = ({
  initialData = { title: "", author: "", published: false },
  onSubmit,
  onCancel,
  submitLabel = "Save Changes",
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState(initialData.title);
  const [author, setAuthor] = useState(initialData.author);
  const [published, setPublished] = useState(initialData.published);

  const GET_BOOK = gql`
    query GetBook($id: ID!) {
      book(id: $id) {
        title
        author
        isPublished
      }
    }
  `;

  const UPDATE_BOOK = gql`
    mutation UpdateBook(
      $id: ID!
      $title: String!
      $author: String!
      $isPublished: Boolean!
    ) {
      updateBook(
        id: $id
        title: $title
        author: $author
        isPublished: $isPublished
      ) {
        code
        success
        message
        data
      }
    }
  `;

  const [updateBook, { loading: updating, error: updateError }] =
    useMutation(UPDATE_BOOK);

  const { loading, error, data } = useQuery<GetBookData>(GET_BOOK, {
    variables: { id },
    skip: !id,
  });

  useEffect(() => {
    if (data?.book) {
      setTitle(data.book.title);
      setAuthor(data.book.author);
      setPublished(data.book.isPublished);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id) return;

    try {
      await updateBook({
        variables: {
          id,
          title,
          author,
          isPublished: published,
        },
        refetchQueries: [{ query: GET_BOOK, variables: { id } }],
      });

      navigate(`/book/${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error)
    return (
      <p className="text-center text-red-500 font-semibold">
        Error: {error.message}
      </p>
    );

  return (
    <div className="w-full max-w-2xl mx-auto mt-10">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 sm:p-8 md:p-10">
          {/* Heading */}
          <div className="flex justify-between items-center pb-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
              {submitLabel === "Save Changes"
                ? "Edit Book Details"
                : "Add a New Book"}
            </h1>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-6 pt-6" onSubmit={handleSubmit}>
            {/* Title */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-900 dark:text-white font-medium text-base">
                Book Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter book title"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Author */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-900 dark:text-white font-medium text-base">
                Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g., F. Scott Fitzgerald"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Published */}
            <div className="flex items-center gap-3">
              <input
                id="published-status"
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="published-status"
                className="text-gray-900 dark:text-white"
              >
                Published
              </label>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row-reverse gap-3 pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition"
              >
                {updating ? (
                  <p className="text-blue-500">Saving...</p>
                ) : (
                  submitLabel
                )}
              </button>
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 font-bold transition"
                >
                  Cancel
                </button>
              )}

              {updateError && (
                <p className="text-red-500">{updateError.message}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBookForm;
