import { Link } from "react-router-dom";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useEffect } from "react";

export const GET_BOOKS = gql`
  query GetBooks {
    books {
      id
      title
      author
      isPublished
    }
  }
`;

interface Book {
  id: string;
  title: string;
  author: string;
  isPublished: boolean;
}

interface GetBooksData {
  books: Book[];
}

export default function Books() {
  const { loading, error, data } = useQuery<GetBooksData>(GET_BOOKS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <p className="text-text-primary-light dark:text-text-primary-dark text-3xl font-black leading-tight tracking-[-0.033em] min-w-72">
          All Books
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border-light dark:border-border-dark">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background-light dark:bg-background-dark">
              <tr>
                <th className="px-4 py-3 text-left text-text-secondary-light dark:text-text-secondary-dark text-xs font-medium uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-text-secondary-light dark:text-text-secondary-dark text-xs font-medium uppercase tracking-wider">
                  Author
                </th>
                <th className="px-4 py-3 text-left text-text-secondary-light dark:text-text-secondary-dark text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-text-secondary-light dark:text-text-secondary-dark text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {data?.books.map((book) => (
                <tr
                  key={book.title}
                  className="hover:bg-background-light dark:hover:bg-background-dark transition-colors"
                >
                  <td className="px-4 py-2 text-text-primary-light dark:text-text-primary-dark text-sm font-medium leading-normal">
                    {book.title}
                  </td>
                  <td className="px-4 py-2 text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal">
                    {book.author}
                  </td>
                  <td className="px-4 py-2 text-sm font-normal leading-normal">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        book.isPublished
                          ? "bg-green-100 dark:bg-green-900/50 text-white dark:text-white"
                          : "bg-orange-100 dark:bg-orange-900/50 text-white dark:text-white"
                      }`}
                    >
                      {book.isPublished ? "Published" : "Unpublished"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm font-medium leading-normal">
                    <Link to={`/book/${book.id}`}>
                      <button className="text-primary hover:underline  cursor-pointer">
                        View Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
