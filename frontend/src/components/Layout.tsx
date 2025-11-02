import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  // Theme state: 'light' | 'dark'
  // const [theme, setTheme] = useState<"light" | "dark">("light");

  // // Load theme from localStorage or system preference
  // useEffect(() => {
  //   const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
  //   if (savedTheme) {
  //     setTheme(savedTheme);
  //     document.documentElement.classList.toggle("dark", savedTheme === "dark");
  //   } else {
  //     // Default to system preference
  //     const prefersDark = window.matchMedia(
  //       "(prefers-color-scheme: dark)"
  //     ).matches;
  //     setTheme(prefersDark ? "dark" : "light");
  //     document.documentElement.classList.toggle("dark", prefersDark);
  //   }
  // }, []);

  // Toggle theme function
  // const toggleTheme = () => {
  //   const newTheme = theme === "light" ? "dark" : "light";
  //   setTheme(newTheme);
  //   localStorage.setItem("theme", newTheme);
  //   document.documentElement.classList.toggle("dark", newTheme === "dark");
  // };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col">
      <div className="layout-container flex flex-1 flex-col">
        <div className="flex flex-1 justify-center py-5 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40">
          <div className="layout-content-container flex w-full max-w-6xl flex-1 flex-col">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-border-light dark:border-border-dark px-6 py-4 bg-surface-light dark:bg-surface-dark rounded-t-lg">
              <Link to={"/"}>
                <div className="flex items-center gap-4 text-text-primary-light dark:text-text-primary-dark">
                  <div className="text-primary text-2xl">
                    <svg
                      className="h-8 w-8"
                      fill="currentColor"
                      viewBox="0 0 48 48"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" />
                    </svg>
                  </div>
                  <h1 className="text-xl font-bold leading-tight tracking-[-0.015em]">
                    GraphQL Book Manager
                  </h1>
                </div>
              </Link>

              <div className="flex flex-1 items-center justify-end gap-4">
                {/* Search */}
                {/* <input
                  type="text"
                  placeholder="Search by title..."
                  className="hidden md:flex form-input max-w-[256px] h-10 px-3 text-sm font-normal rounded-r-lg text-text-primary-light dark:text-text-primary-dark border border-border-light dark:border-border-dark focus:outline-0 focus:ring-2 focus:ring-primary focus:ring-inset placeholder:text-text-secondary-light placeholder:dark:text-text-secondary-dark bg-background-light dark:bg-background-dark"
                /> */}

                {/* Add Book Button */}
                <Link to={"/book/add"}>
                  <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-blue-700 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
                    Add New Book
                  </button>
                </Link>
                {/* Theme Toggle */}
                {/* <button
                  onClick={toggleTheme}
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-border-light dark:border-border-dark text-sm text-text-primary-light dark:text-text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === "light" ? "🌞" : "🌙"}
                </button> */}
              </div>
            </header>

            {/* Main */}
            <main className="bg-surface-light dark:bg-surface-dark p-4 sm:p-6 rounded-b-lg">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
