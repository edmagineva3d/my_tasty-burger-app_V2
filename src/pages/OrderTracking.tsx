import { useMemo, useState } from "react";
import { Button, Container } from "react-bootstrap";
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
          <p>Check the progress of your Tasty Burger order.</p>
        </div>
        {!order ? (
          <div className="orders_empty">
            <i className="bi bi-search" aria-hidden="true" />
            <h3>Order not found</h3>
            <p>We could not find this order in this browser.</p>
            <Button as={Link} to="/order-history" variant="warning">View Order History</Button>
          </div>
        ) : (
          <div className="tracking_card">
            <div className="tracking_order_top">
              <div><span className="tracking_label">ORDER NUMBER</span><h3>{order.id}</h3></div>
              <span className={`order_status status_${order.status.toLowerCase().replace(/ /g, "-")}`}>{order.status}</span>
            </div>
            <p className="tracking_date">Placed on {new Date(order.createdAt).toLocaleString()}</p>
            <div className="tracking_steps">
              {orderStatuses.map((status, index) => (
                <div className={`tracking_step ${index <= currentIndex ? "is_complete" : ""} ${index === currentIndex ? "is_current" : ""}`} key={status}>
                  <span className="tracking_step_icon"><i className={`bi ${index < currentIndex ? "bi-check-lg" : index === currentIndex ? "bi-circle-fill" : "bi-circle"}`} /></span>
                  <span>{status}</span>
                </div>
              ))}
            </div>
            <div className="tracking_items">
              <h4>Order Summary</h4>
              {order.items.map((item, index) => (
                <div className="tracking_item" key={`${item.id}-${index}`}>
                  <img src={item.image} alt={item.title} />
                  <span>{item.title}<small>Qty: {item.quantity}</small></span>
                  <strong>₱{(item.price * item.quantity).toFixed(2)}</strong>
                </div>
              ))}
              <div className="tracking_total"><span>Total paid / due</span><strong>₱{order.total.toFixed(2)}</strong></div>
            </div>
            {currentIndex < orderStatuses.length - 1 && (
              <div className="tracking_demo_note">
                <p><i className="bi bi-info-circle" /> Demo mode: use the button to preview the next order status.</p>
                <Button variant="warning" onClick={advanceDemoStatus}>Simulate Next Status</Button>
              </div>
            )}
            {order.status === "Completed" && <p className="tracking_complete"><i className="bi bi-check-circle-fill" /> Your order is marked completed. Enjoy your meal!</p>}
            <div className="tracking_links"><Button as={Link} to="/order-history" variant="outline-dark">Back to Order History</Button><Button as={Link} to="/" variant="danger">Continue Shopping</Button></div>
          </div>
        )}
      </Container>
    </section>
  );
}

export default OrderTracking;
