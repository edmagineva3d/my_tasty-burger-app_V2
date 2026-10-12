import { useState } from "react";
import { Container, Row, Col, Table, Modal, Button, Form, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/cart.css";
import BurgerIcon from "../assets/menu/cart-empty.jpg";

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, updateSpecialInstructions } = useCart();
  const navigate = useNavigate();

  // Instruction edit modal state
  const [editingItem, setEditingItem] = useState<{ id: string; title: string; note: string } | null>(null);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  // Standard delivery: ₱49 or free if subtotal > ₱500, or ₱0 when empty
  const delivery = cartItems.length > 0 ? (subtotal >= 500 ? 0 : 49) : 0;
  const total = subtotal + delivery;

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) return;
    navigate("/checkout");
  };

  const handleSaveInstruction = () => {
    if (editingItem) {
      updateSpecialInstructions(editingItem.id, editingItem.note.trim());
      setEditingItem(null);
    }
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
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="cart_product">
                            <img src={item.image} alt={item.title} />
                            <div>
                              <span className="fw-bold d-block">{item.title}</span>
                              <div className="d-flex flex-wrap gap-1 mt-1">
                                {item.selectedSize && (
                                  <Badge bg="warning" text="dark" className="me-1">
                                    Size: {item.selectedSize}
                                  </Badge>
                                )}
                                {item.bundleTag && (
                                  <Badge bg="danger" className="me-1">
                                    {item.bundleTag}
                                  </Badge>
                                )}
                              </div>
                              {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                                <div className="text-muted small">
                                  <strong>Add-ons:</strong> {item.selectedAddOns.join(", ")}
                                </div>
                              )}
                              {item.removedIngredients && item.removedIngredients.length > 0 && (
                                <div className="text-danger small">
                                  <strong>Exclusions:</strong> {item.removedIngredients.join(", ")}
                                </div>
                              )}
                              {item.specialInstructions ? (
                                <div className="d-flex align-items-center gap-2 mt-1">
                                  <span className="badge bg-light text-dark border">
                                    <i className="bi bi-chat-left-text me-1 text-primary"></i>
                                    {item.specialInstructions}
                                  </span>
                                  <button
                                    type="button"
                                    className="btn btn-link btn-sm p-0 text-decoration-none"
                                    onClick={() =>
                                      setEditingItem({
                                        id: item.id,
                                        title: item.title,
                                        note: item.specialInstructions || "",
                                      })
                                    }
                                  >
                                    <small>Edit</small>
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-link btn-sm p-0 text-muted mt-1 text-decoration-none"
                                  onClick={() =>
                                    setEditingItem({
                                      id: item.id,
                                      title: item.title,
                                      note: "",
                                    })
                                  }
                                >
                                  <small>+ Special instruction</small>
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>₱{item.price.toFixed(2)}</td>
                        <td>
                          <div className="qty_box d-flex align-items-center justify-content-center">
                            <button
                              type="button"
                              className="qty_btn"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              -
                            </button>
                            <span className="mx-3">{item.quantity}</span>
                            <button
                              type="button"
                              className="qty_btn"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td>₱{(item.price * item.quantity).toFixed(2)}</td>
                        <td>
                          <button
                            type="button"
                            className="delete_btn"
                            onClick={() => removeFromCart(item.id)}
                            aria-label={`Remove ${item.title}`}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-5">
                        <div className="empty_cart_icon" aria-hidden="true">
                          <img src={BurgerIcon} alt="" />
                        </div>
                        <h4>Oops! Your Cart Is Empty</h4>
                        <Link to="/" className="btn btn_red mt-3">
                          Order Now
                        </Link>
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
              <div className="summary_item">
                <span>Subtotal</span>
                <span>₱{subtotal.toFixed(2)}</span>
              </div>
              <div className="summary_item">
                <span>
                  Delivery {subtotal >= 500 && subtotal > 0 ? "(Free over ₱500)" : ""}
                </span>
                <span>{delivery === 0 ? "FREE" : `₱${delivery.toFixed(2)}`}</span>
              </div>
              <hr />
              <div className="summary_item total">
                <span>Estimated Total</span>
                <span>₱{total.toFixed(2)}</span>
              </div>
              <button
                type="button"
                className="order_btn"
                disabled={cartItems.length === 0}
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout →
              </button>
              <Link to="/" className="continue_shop">
                ← Continue Shopping
              </Link>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Edit Food Instruction Modal */}
      <Modal
        show={Boolean(editingItem)}
        onHide={() => setEditingItem(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Special Food Instruction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="small text-muted mb-2">
            Add kitchen preparation notes for <strong>{editingItem?.title}</strong> (e.g. less sauce, extra crispy, no onions):
          </p>
          <Form.Control
            as="textarea"
            rows={3}
            maxLength={120}
            value={editingItem?.note || ""}
            onChange={(e) =>
              setEditingItem((curr) => curr ? { ...curr, note: e.target.value } : null)
            }
            placeholder="e.g. Less sauce, extra crispy, no onions"
          />
          <div className="d-flex justify-content-between text-muted small mt-1">
            <span>Special preparation is made fresh to order.</span>
            <span>{(editingItem?.note || "").length}/120</span>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setEditingItem(null)}>
            Cancel
          </Button>
          <Button variant="warning" onClick={handleSaveInstruction}>
            Save Instruction
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}

export default Cart;
