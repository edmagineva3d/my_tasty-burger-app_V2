import { Container, Table, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getOrders } from "../utils/orders";
import "../styles/orders.css";

function OrderHistory() {
  const orders = getOrders();

  return (
    <section className="orders_section">
      <Container>
        <div className="orders_heading">
          <span className="orders_kicker">YOUR TASTY BURGER ACCOUNT</span>
          <h2>Order History</h2>
          <p>Review your previous orders and check their latest status.</p>
        </div>
        {orders.length ? (
          <div className="orders_table_wrap">
            <Table responsive className="orders_table align-middle">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Destination</th>
                  <th>Items</th>
                  <th>Payment</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.id}</strong>
                      {order.contactlessDelivery && (
                        <div>
                          <Badge bg="success" style={{ fontSize: "10px" }}>
                            Contactless
                          </Badge>
                        </div>
                      )}
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      {order.customer ? (
                        <div style={{ maxWidth: "200px" }}>
                          <span className="d-block fw-bold text-dark small">{order.customer.fullName}</span>
                          <span className="text-muted small" style={{ fontSize: "11.5px" }}>
                            {order.customer.barangay}, {order.customer.city}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted small">Standard Delivery</span>
                      )}
                    </td>
                    <td>
                      <span className="fw-bold">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)
                      </span>
                      <div className="text-muted small text-truncate" style={{ maxWidth: "160px" }}>
                        {order.items.map((it) => it.title).join(", ")}
                      </div>
                    </td>
                    <td>
                      <span className="small fw-semibold">{order.paymentMethod || "Cash on Delivery"}</span>
                    </td>
                    <td>
                      <strong className="text-danger">₱{order.total.toFixed(2)}</strong>
                    </td>
                    <td>
                      <span
                        className={`order_status status_${order.status
                          .toLowerCase()
                          .replace(/ /g, "-")}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/track/${order.id}`}
                        className="btn btn-sm btn-warning fw-bold"
                      >
                        Track Order
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <div className="orders_empty">
            <i className="bi bi-receipt-cutoff" aria-hidden="true" />
            <h3>No orders yet</h3>
            <p>Your completed checkouts will appear here.</p>
            <Link to="/" className="btn btn-warning">
              Explore Menu
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}

export default OrderHistory;
