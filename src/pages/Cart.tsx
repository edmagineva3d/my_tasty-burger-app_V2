import { useState } from "react";
import { Container, Row, Col, Table, Modal, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/cart.css";
import BurgerIcon from "../assets/menu/burger-11.jpg";
import { saveOrder } from "../utils/orders";

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const delivery = cartItems.length > 0 ? 2.0 : 0;
  const total = subtotal + delivery;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    const orderId = `TB-${Date.now().toString().slice(-8)}`;
    saveOrder({
      id: orderId,
      items: cartItems.map((item) => ({ ...item })),
      subtotal,
      delivery,
      total,
      status: "Order Received",
      createdAt: new Date().toISOString(),
    });
    setShowModal(true);
    clearCart();
  };

  return (
    <section className="cart_section">
      <Container>
        <Row>
          <Col lg={12} className="text-center mb-5">
            <h2 className="section_title">Your Food Cart</h2>
          </Col>
        </Row>
        <Row>
          <Col lg={8}>
            <div className="table-responsive">
              <Table className="cart_table align-middle">
                <thead>
                  <tr>
                    <th>Product</th><th>Price</th><th>Quantity</th><th>Total</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="cart_product">
                            <img src={item.image} alt={item.title} />
                            <span>{item.title}</span>
                          </div>
                        </td>
                        <td>₱{item.price.toFixed(2)}</td>
                        <td>
                          <div className="qty_box d-flex align-items-center justify-content-center">
                            <button className="qty_btn" onClick={() => updateQuantity(item.id, -1)}>-</button>
                            <span className="mx-3">{item.quantity}</span>
                            <button className="qty_btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                          </div>
                        </td>
                        <td>₱{(item.price * item.quantity).toFixed(2)}</td>
                        <td>
                          <button className="delete_btn" onClick={() => removeFromCart(item.id)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center">
                        <div className="empty_cart_icon" aria-hidden="true">
                          <img src={BurgerIcon} alt="" />
                        </div>
                        <h4>Oops! Your Cart Is Empty</h4>
                        <Link to="/" className="btn btn_red mt-3">Order Now</Link>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Col>
          <Col lg={4}>
            <div className="cart_summary">
              <h4>Order Summary</h4>
              <div className="summary_item"><span>Subtotal</span><span>₱{subtotal.toFixed(2)}</span></div>
              <div className="summary_item"><span>Delivery</span><span>₱{delivery.toFixed(2)}</span></div>
              <hr />
              <div className="summary_item total"><span>Total</span><span>₱{total.toFixed(2)}</span></div>
              <button className="order_btn" disabled={cartItems.length === 0} onClick={handleCheckout}>
                Proceed to Checkout
              </button>
              <Link to="/" className="continue_shop">← Continue Shopping</Link>
            </div>
          </Col>
        </Row>
      </Container>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body className="text-center p-5">
          <div className="mb-4">
            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "4rem" }}></i>
          </div>
          <h3>Order Placed Successfully!</h3>
          <p>Thank you for choosing Tasty Burger. Your delicious meal is on its way!</p>
          <Button variant="danger" className="mt-3 px-4" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </Modal.Body>
      </Modal>
    </section>
  );
}

export default Cart;
