import { useEffect, useState, type ReactNode } from "react";
import { Card, Col, Modal, Button, Form } from "react-bootstrap";
import type { Product } from "../../types";

interface CardsProps extends Product {
  renderratingIcons: (rating: number) => ReactNode;
  handleAddToCart: (product: Product) => void;
  badgeLabel?: string;
}

const burgerAddOnChoices = [
  { name: "Extra cheese", price: 15 },
  { name: "Bacon", price: 20 },
  { name: "Extra patty", price: 35 },
  { name: "Jalapeños", price: 10 },
  { name: "Special sauce", price: 8 },
];

const friesAddOnChoices = [
  { name: "Cheese sauce", price: 12 },
  { name: "Bacon bits", price: 18 },
  { name: "Sour cream seasoning", price: 10 },
  { name: "Jalapeño slices", price: 10 },
  { name: "Truffle seasoning", price: 8 },
];
const discountCode = "TASTYBURGER67";

function Cards({ id, image, rating, title, paragraph, price, soldOut = false, renderratingIcons, handleAddToCart, badgeLabel }: CardsProps) {
  const [showCustomize, setShowCustomize] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [coupon, setCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [isFavorite, setIsFavorite] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tastyBurgerFavorites") || "[]").includes(id); }
    catch { return false; }
  });
  useEffect(() => {
    const syncFavorite = () => {
      try { setIsFavorite(JSON.parse(localStorage.getItem("tastyBurgerFavorites") || "[]").includes(id)); }
      catch { setIsFavorite(false); }
    };
    window.addEventListener("tasty-favorites-updated", syncFavorite);
    return () => window.removeEventListener("tasty-favorites-updated", syncFavorite);
  }, [id]);

  const toggleFavorite = () => {
    let favorites: string[] = [];
    try { favorites = JSON.parse(localStorage.getItem("tastyBurgerFavorites") || "[]"); } catch { favorites = []; }
    const next = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
    localStorage.setItem("tastyBurgerFavorites", JSON.stringify(next));
    setIsFavorite(next.includes(id));
    window.dispatchEvent(new Event("tasty-favorites-updated"));
  };
  const isFries = title.toLowerCase().includes("fries");
  const addOnChoices = isFries ? friesAddOnChoices : burgerAddOnChoices;
  const extrasTotal = addOnChoices.filter((addon) => selectedAddOns.includes(addon.name)).reduce((sum, addon) => sum + addon.price, 0);
  const discount = coupon.trim().toUpperCase() === discountCode ? (price + extrasTotal) * 0.1 : 0;
  const finalPrice = price + extrasTotal - discount;
  const confirmAdd = () => {
    if (coupon.trim() && coupon.trim().toUpperCase() !== discountCode) {
      setCouponMessage("That code is not valid. Try TASTYBURGER67.");
      return;
    }
    const extras = selectedAddOns.length ? ` + ${selectedAddOns.join(", ")}` : "";
    handleAddToCart({ id: `${id}-${Date.now()}`, image, rating, title: `${title}${extras}${discount ? " (10% off)" : ""}`, paragraph, price: finalPrice });
    setShowCustomize(false);
    setSelectedAddOns([]);
    setCoupon("");
    setCouponMessage("");
  };

  return (
    <>
      <Col sm={6} lg={4} xl={3} className="mb-4">
        <Card className="overflow-hidden">
          <div className={`menu-card-image overflow-hidden ${soldOut ? "sold-out-image" : ""}`}><Card.Img variant="top" src={image} alt={title} />{badgeLabel && <span className="menu-item-badge">{badgeLabel}</span>}{soldOut && <span className="sold-out-badge">SOLD OUT</span>}</div>
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between">
              <div className="item_rating">{renderratingIcons(rating)}</div>
              <button type="button" className={`wishlist ${isFavorite ? "active" : ""}`} aria-label={isFavorite ? `Remove ${title} from favorites` : `Add ${title} to favorites`} aria-pressed={isFavorite} onClick={toggleFavorite}>
                <i className={`bi ${isFavorite ? "bi-heart-fill" : "bi-heart"}`}></i>
              </button>
            </div>
            <Card.Title>{title}</Card.Title><Card.Text>{paragraph}</Card.Text>
            <div className="d-flex align-items-center justify-content-between">
              <div className="menu_price"><h5 className="mb-0">₱{Number(price).toFixed(2)}</h5></div>
              <div className="add_to_cart"><button type="button" className="btn_cart" onClick={() => setShowCustomize(true)}><i className="bi bi-bag em-2"></i> Customize</button></div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Modal show={showCustomize && !soldOut} onHide={() => setShowCustomize(false)} centered>
        <Modal.Header closeButton><Modal.Title>{isFries ? "🍟" : "🍔"} Customize {title}</Modal.Title></Modal.Header>
        <Modal.Body>
          <p className="small text-muted">{isFries ? "Choose your fries toppings. The price updates automatically." : "Choose your add-ons. The price updates automatically."}</p>
          {addOnChoices.map((addon) => <Form.Check key={addon.name} type="checkbox" className="mb-2" label={`${addon.name} (+₱${addon.price.toFixed(2)})`} checked={selectedAddOns.includes(addon.name)} onChange={(event) => setSelectedAddOns((current) => event.target.checked ? [...current, addon.name] : current.filter((name) => name !== addon.name))} />)}
          <hr />
          <Form.Label>🎟️ Discount code</Form.Label>
          <Form.Control value={coupon} onChange={(event) => { setCoupon(event.target.value); setCouponMessage(""); }} placeholder="Enter TASTYBURGER67" />
          <div className="small text-muted mt-1">Use TASTYBURGER67 for 10% off this item.</div>
          {couponMessage && <div className="text-danger small mt-2">{couponMessage}</div>}
          {coupon.trim().toUpperCase() === discountCode && <div className="text-success small mt-2">Discount code applied! You save ₱{((price + extrasTotal) * 0.1).toFixed(2)}.</div>}
          <div className="customize-total mt-3"><span>Item total</span><strong>₱{finalPrice.toFixed(2)}</strong></div>
        </Modal.Body>
        <Modal.Footer><Button variant="outline-secondary" onClick={() => setShowCustomize(false)}>Cancel</Button><Button variant="warning" onClick={confirmAdd}>Add to Cart · ₱{finalPrice.toFixed(2)}</Button></Modal.Footer>
      </Modal>
    </>
  );
}
export default Cards;
