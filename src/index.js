// Source: https://claremburu.medium.com/how-to-visualize-data-from-a-csv-file-in-react-full-code-on-github-258897516be2
// related: https://stackoverflow.com/questions/44769051/how-to-upload-and-read-csv-files-in-react-js
import { StrictMode } from "react";
import ReactDOM from "react-dom";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);
