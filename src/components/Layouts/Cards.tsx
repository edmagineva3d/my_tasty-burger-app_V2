import { useState, type ReactNode } from "react";
import { Card, Col } from "react-bootstrap";
import type { Product } from "../../types";

interface CardsProps extends Product {
  renderratingIcons: (rating: number) => ReactNode;
  handleAddToCart: () => void;
}

function Cards({
  image,
  rating,
  title,
  paragraph,
  price,
  renderratingIcons,
  handleAddToCart,
}: CardsProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Col sm={6} lg={4} xl={3} className="mb-4">
      <Card className="overflow-hidden">
        <div className="overflow-hidden">
          <Card.Img variant="top" src={image} />
        </div>
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between">
            <div className="item_rating">{renderratingIcons(rating)}</div>
            <button
              type="button"
              className={`wishlist ${isFavorite ? "active" : ""}`}
              aria-label={
                isFavorite
                  ? `Remove ${title} from favorites`
                  : `Add ${title} to favorites`
              }
              aria-pressed={isFavorite}
              onClick={() => setIsFavorite((favorite) => !favorite)}
            >
              <i
                className={`bi ${
                  isFavorite ? "bi-heart-fill" : "bi-heart"
                }`}
              ></i>
            </button>
          </div>
          <Card.Title>{title}</Card.Title>
          <Card.Text>{paragraph}</Card.Text>
          <div className="d-flex align-items-center justify-content-between">
            <div className="menu_price">
              <h5 className="mb-0">₱{Number(price).toFixed(2)}</h5>
            </div>
            <div className="add_to_cart">
              <button
                type="button"
                className="btn_cart"
                onClick={handleAddToCart}
              >
                <i className="bi bi-bag em-2"></i>
                Add To Cart
              </button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default Cards;
