import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import Login from "./pages/Login";
const client = new ApolloClient({
    uri: "http://localhost:4000/",
    cache: new InMemoryCache(),
});
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsx(ApolloProvider, { client: client, children: _jsx(Login, {}) }) }));
