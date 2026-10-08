import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart";
import { CartProvider } from "./context/CartContext";
import Layouts from "./components/Layouts/Layouts";

function App() {
  return (
    <CartProvider>
      <Router>
        <Layouts>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </Layouts>
      </Router>
    </CartProvider>
  );
}

export default App;
