import { useMemo, useState } from "react";
import { Button, Container, Row, Col, Badge } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import type { OrderRecord } from "../types";
import { getOrders, orderStatuses, updateOrderStatus } from "../utils/orders";
import "../styles/orders.css";

function OrderTracking() {
  const { orderId } = useParams();
  const [refreshKey, setRefreshKey] = useState(0);
  const order = useMemo(
    () => getOrders().find((item) => item.id === orderId),
    [orderId, refreshKey]
  ) as OrderRecord | undefined;

  const currentIndex = order ? orderStatuses.indexOf(order.status) : -1;
  const advanceDemoStatus = () => {
    if (!order || currentIndex < 0 || currentIndex >= orderStatuses.length - 1) return;
    updateOrderStatus(order.id, orderStatuses[currentIndex + 1]);
    setRefreshKey((value) => value + 1);
  };

  return (
    <section className="orders_section">
      <Container>
        <div className="orders_heading">
          <span className="orders_kicker">MADE FRESH, JUST FOR YOU</span>
          <h2>Order Tracking</h2>
          <p>Check the live progress of your Tasty Burger order.</p>
        </div>
        {!order ? (
          <div className="orders_empty">
            <i className="bi bi-search" aria-hidden="true" />
            <h3>Order not found</h3>
            <p>We could not find this order in this browser.</p>
            <Link to="/order-history" className="btn btn-warning">
              View Order History
            </Link>
          </div>
        ) : (
          <div className="tracking_card">
            <div className="tracking_order_top">
              <div>
                <span className="tracking_label">ORDER NUMBER</span>
                <h3>{order.id}</h3>
              </div>
              <span
                className={`order_status status_${order.status
                  .toLowerCase()
                  .replace(/ /g, "-")}`}
              >
                {order.status}
              </span>
            </div>
            <p className="tracking_date">
              Placed on {new Date(order.createdAt).toLocaleString()}
              {order.estimatedDeliveryMinutes && (
                <span className="ms-3 text-dark fw-bold">
                  ⏱️ Estimated Arrival: ~{order.estimatedDeliveryMinutes} mins
                </span>
              )}
            </p>

            {/* Delivery & Customer Info Card */}
            {order.customer && (
              <div className="p-3 bg-light rounded border mb-4">
                <Row className="g-2 small">
                  <Col md={6}>
                    <div>
                      <strong>Customer:</strong> {order.customer.fullName} ({order.customer.contactNumber})
                    </div>
                    <div>
                      <strong>Address:</strong> {order.customer.address}, Brgy. {order.customer.barangay}, {order.customer.city}, {order.customer.province}
                    </div>
                    {order.customer.landmark && (
                      <div>
                        <strong>Landmark:</strong> {order.customer.landmark}
                      </div>
                    )}
                  </Col>
                  <Col md={6}>
                    <div>
                      <strong>Payment:</strong> {order.paymentMethod || "Cash on Delivery"}
                    </div>
                    {order.contactlessDelivery && (
                      <div className="mt-1">
                        <Badge bg="success">
                          <i className="bi bi-shield-check me-1"></i> Contactless Drop-Off
                        </Badge>
                      </div>
                    )}
                    {order.deliveryInstructions && (
                      <div className="mt-1">
                        <strong>Rider Instructions:</strong> {order.deliveryInstructions}
                      </div>
                    )}
                  </Col>
                </Row>
              </div>
            )}

            {/* Status Steps */}
            <div className="tracking_steps">
              {orderStatuses.map((status, index) => (
                <div
                  className={`tracking_step ${
                    index <= currentIndex ? "is_complete" : ""
                  } ${index === currentIndex ? "is_current" : ""}`}
                  key={status}
                >
                  <span className="tracking_step_icon">
                    <i
                      className={`bi ${
                        index < currentIndex
                          ? "bi-check-lg"
                          : index === currentIndex
                          ? "bi-circle-fill"
                          : "bi-circle"
                      }`}
                    />
                  </span>
                  <span>{status}</span>
                </div>
              ))}
            </div>

            {/* Items Summary */}
            <div className="tracking_items">
              <h4>Order Summary</h4>
              {order.items.map((item, index) => (
                <div className="tracking_item" key={`${item.id}-${index}`}>
                  <img src={item.image} alt={item.title} />
                  <div>
                    <span className="d-block fw-bold">{item.title}</span>
                    <small>
                      Qty: {item.quantity}
                      {item.selectedSize && ` · Size: ${item.selectedSize}`}
                      {item.selectedAddOns && item.selectedAddOns.length > 0 && ` · ${item.selectedAddOns.join(", ")}`}
                    </small>
                    {item.specialInstructions && (
                      <div
                        className="text-primary small mt-1 p-1 bg-white border rounded"
                        style={{ fontSize: "12px" }}
                      >
                        <i className="bi bi-chat-left-dots-fill me-1 text-warning"></i>
                        <strong>Special Request:</strong> {item.specialInstructions}
                      </div>
                    )}
                  </div>
                  <strong className="ms-auto">
                    ₱{(item.price * item.quantity).toFixed(2)}
                  </strong>
                </div>
              ))}

              {/* Price Breakdown */}
              <div className="p-3 bg-light rounded mt-3">
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Subtotal:</span>
                  <span>₱{order.subtotal.toFixed(2)}</span>
                </div>
                {order.discount && (
                  <div className="d-flex justify-content-between small text-success mb-1">
                    <span>Discount ({order.discount.code}):</span>
                    <span>-₱{order.discount.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Delivery:</span>
                  <span>{order.delivery === 0 ? "FREE" : `₱${order.delivery.toFixed(2)}`}</span>
                </div>
                {(order.riderTip || 0) > 0 && (
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Rider Tip:</span>
                    <span>₱{order.riderTip?.toFixed(2)}</span>
                  </div>
                )}
                <hr className="my-2" />
                <div className="d-flex justify-content-between fs-5 fw-bold text-dark">
                  <span>Total paid / due:</span>
                  <span className="text-danger">₱{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {currentIndex < orderStatuses.length - 1 && (
              <div className="tracking_demo_note">
                <p>
                  <i className="bi bi-info-circle" /> Demo mode: use the button to preview the next order status.
                </p>
                <Button variant="warning" onClick={advanceDemoStatus}>
                  Simulate Next Status
                </Button>
              </div>
            )}
            {order.status === "Completed" && (
              <p className="tracking_complete">
                <i className="bi bi-check-circle-fill" /> Your order is marked completed. Enjoy your meal!
              </p>
            )}
            <div className="tracking_links">
              <Link to="/order-history" className="btn btn-outline-dark">
                Back to Order History
              </Link>
              <Link to="/" className="btn btn-danger">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

export default OrderTracking;
