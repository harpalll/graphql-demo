import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { AddBookForm, Book, EditBookForm, Layout } from "./components";
import App from "./App";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:3000/" }),
  cache: new InMemoryCache(),
});

const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      { index: true, Component: App },
      {
        path: "book/:id",
        Component: Book,
      },
      {
        path: "book/add",
        Component: AddBookForm,
      },
      {
        path: "book/edit/:id",
        Component: () => (
          <EditBookForm
            initialData={{
              title: "Example",
              author: "Author",
              published: true,
            }}
            onSubmit={(data) => console.log("Edit book", data)}
            submitLabel="Save Changes"
          />
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <RouterProvider router={router} />
  </ApolloProvider>
);
