import "./App.css";
import "./Scss/Style.scss";
import Payment from "./Pages/PaymentForm";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    <Router>
      <div className="App">
        <div className="container">
          <Routes>
            <Route path="/" element={<Payment />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
