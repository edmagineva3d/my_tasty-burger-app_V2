import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import OrderTracking from "./pages/OrderTracking";
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
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/track/:orderId" element={<OrderTracking />} />
          </Routes>
        </Layouts>
      </Router>
    </CartProvider>
  );
}

export default App;

/* keep the remaining project assets together without changing the app */
