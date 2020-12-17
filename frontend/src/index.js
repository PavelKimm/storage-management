import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
// import "@fontsource-roboto";
// import "@babel/polyfill";

import store from "./redux/store";
import App from "./App";
import theme from "./theme";
// import "../public/style.css";

const Root = () => {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  );
};

ReactDOM.render(<Root />, document.getElementById("react-root"));
