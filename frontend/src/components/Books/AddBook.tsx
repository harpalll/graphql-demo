import { useState, type ReactEventHandler } from "react";

export default function AddBookForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit: ReactEventHandler = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(true);
      setSuccess(false);
      return;
    }
    // Reset form and show success
    setError(false);
    setSuccess(true);
    setTitle("");
    setAuthor("");
    setPublished(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col gap-8 rounded-xl border border-border-light dark:border-border-dark bg-content-light dark:bg-content-dark shadow-sm p-6 sm:p-8 md:p-10">
        <div className="flex flex-wrap justify-between gap-3">
          <h2 className="text-text-light-primary dark:text-text-dark-primary text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
            Add a New Book
          </h2>
        </div>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="book-title"
              className="text-text-light-primary dark:text-text-dark-primary text-base font-medium leading-normal"
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
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light-primary dark:text-text-dark-primary focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-input-bg-light dark:bg-input-bg-dark focus:border-primary h-12 placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary px-4 text-base font-normal leading-normal"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="author-name"
              className="text-text-light-primary dark:text-text-dark-primary text-base font-medium leading-normal"
            >
              Author
            </label>
            <input
              id="author-name"
              name="author"
              placeholder="e.g., J.R.R. Tolkien"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light-primary dark:text-text-dark-primary focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-input-bg-light dark:bg-input-bg-dark focus:border-primary h-12 placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary px-4 text-base font-normal leading-normal"
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <input
              id="published-status"
              name="published"
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="form-checkbox h-5 w-5 rounded border-border-light dark:border-border-dark border-2 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-2 focus:ring-offset-0 focus:ring-primary/50"
            />
            <label
              htmlFor="published-status"
              className="text-text-light-primary dark:text-text-dark-primary text-base font-normal leading-normal flex-1 truncate"
            >
              Is this book published?
            </label>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-bold text-white transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background-light dark:focus-visible:ring-offset-background-dark disabled:cursor-not-allowed disabled:bg-primary/50"
            >
              <span>Add Book</span>
            </button>
          </div>
        </form>

        {/* Success Message */}
        {success && (
          <div className="flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-300">
            <span className="material-symbols-outlined text-lg">
              check_circle
            </span>
            <p>Book added successfully!</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            <span className="material-symbols-outlined text-lg">error</span>
            <p>Title is required. Please fill out the field.</p>
          </div>
        )}
      </div>
    </div>
  );
}
