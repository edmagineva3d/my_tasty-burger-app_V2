import { Container, Table, Button } from "react-bootstrap";
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
              <thead><tr><th>Order</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td><strong>{order.id}</strong></td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td>{order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)</td>
                    <td>₱{order.total.toFixed(2)}</td>
                    <td><span className={`order_status status_${order.status.toLowerCase().replaceAll(" ", "-")}`}>{order.status}</span></td>
                    <td><Button as={Link} to={`/track/${order.id}`} size="sm" variant="warning">Track Order</Button></td>
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
            <Button as={Link} to="/" variant="warning">Explore Menu</Button>
          </div>
        )}
      </Container>
    </section>
  );
}

export default OrderHistory;
