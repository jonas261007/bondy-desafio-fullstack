import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
const LOGIN_MUTATION = gql `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      name
      email
    }
  }
`;
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [login, { data, error }] = useMutation(LOGIN_MUTATION);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login({ variables: { email, password } });
        }
        catch (err) {
            console.error(err);
        }
    };
    if (data) {
        return _jsxs("h1", { children: ["Bem-vindo, ", data.login.name, "!"] });
    }
    return (_jsxs("form", { onSubmit: handleSubmit, children: [_jsx("input", { type: "email", placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value), required: true }), _jsx("input", { type: "password", placeholder: "Senha", value: password, onChange: (e) => setPassword(e.target.value), required: true }), _jsx("button", { type: "submit", children: "Login" }), error && _jsxs("p", { children: ["Erro: ", error.message] })] }));
};
export default Login;
