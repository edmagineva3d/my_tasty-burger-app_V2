import { useEffect, useState, type ReactNode } from "react";
import { Card, Col, Modal, Button, Form, Badge } from "react-bootstrap";
import type { CartItem, Product } from "../../types";

interface CardsProps extends Product {
  renderratingIcons: (rating: number) => ReactNode;
  handleAddToCart: (product: CartItem | Product) => void;
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

const burgerRemovalOptions = [
  "No onions",
  "No pickles",
  "No tomatoes",
  "Less mayonnaise",
  "Sauce on the side",
];

const friesPreparationOptions = [
  "Extra crispy",
  "Less salt",
  "No additional salt",
  "Sauce on the side",
];

const discountCode = "TASTYBURGER67";

function Cards({
  id,
  image,
  rating,
  title,
  paragraph,
  price,
  soldOut = false,
  renderratingIcons,
  handleAddToCart,
  badgeLabel,
}: CardsProps) {
  const [showCustomize, setShowCustomize] = useState(false);
  const isFries = title.toLowerCase().includes("fries");

  // Customization states
  const [selectedSize, setSelectedSize] = useState<"Regular" | "Medium" | "Large">(
    isFries ? "Medium" : "Regular"
  );
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");

  const [isFavorite, setIsFavorite] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tastyBurgerFavorites") || "[]").includes(id);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const syncFavorite = () => {
      try {
        setIsFavorite(
          JSON.parse(localStorage.getItem("tastyBurgerFavorites") || "[]").includes(id)
        );
      } catch {
        setIsFavorite(false);
      }
    };
    window.addEventListener("tasty-favorites-updated", syncFavorite);
    return () => window.removeEventListener("tasty-favorites-updated", syncFavorite);
  }, [id]);

  const toggleFavorite = () => {
    let favorites: string[] = [];
    try {
      favorites = JSON.parse(localStorage.getItem("tastyBurgerFavorites") || "[]");
    } catch {
      favorites = [];
    }
    const next = favorites.includes(id)
      ? favorites.filter((item) => item !== id)
      : [...favorites, id];
    localStorage.setItem("tastyBurgerFavorites", JSON.stringify(next));
    setIsFavorite(next.includes(id));
    window.dispatchEvent(new Event("tasty-favorites-updated"));
  };

  const addOnChoices = isFries ? friesAddOnChoices : burgerAddOnChoices;

  // Size adjustments
  const sizeSurcharge = isFries
    ? selectedSize === "Large"
      ? 25
      : 0 // Medium is base price
    : selectedSize === "Large"
    ? 40 // Double Patty surcharge
    : 0;

  const extrasTotal = addOnChoices
    .filter((addon) => selectedAddOns.includes(addon.name))
    .reduce((sum, addon) => sum + addon.price, 0);

  const subtotalBeforeDiscount = price + sizeSurcharge + extrasTotal;
  const discount =
    coupon.trim().toUpperCase() === discountCode ? subtotalBeforeDiscount * 0.1 : 0;
  const finalPrice = Math.round((subtotalBeforeDiscount - discount) * 100) / 100;

  const toggleRemoval = (option: string) => {
    setRemovedIngredients((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option]
    );
  };

  const confirmAdd = () => {
    if (coupon.trim() && coupon.trim().toUpperCase() !== discountCode) {
      setCouponMessage("That code is not valid. Try TASTYBURGER67.");
      return;
    }

    const uniqueConfigurationId = `${id}-${selectedSize}-${[...selectedAddOns]
      .sort()
      .join("_")}-${[...removedIngredients].sort().join("_")}${
      specialInstructions.trim()
        ? `-${encodeURIComponent(specialInstructions.trim().slice(0, 20))}`
        : ""
    }`;

    handleAddToCart({
      id: uniqueConfigurationId,
      image,
      rating,
      title,
      paragraph,
      price: finalPrice,
      basePrice: price,
      selectedSize,
      selectedAddOns: [...selectedAddOns],
      removedIngredients: [...removedIngredients],
      specialInstructions: specialInstructions.trim() || undefined,
      quantity: 1,
    });

    setShowCustomize(false);
    setSelectedSize(isFries ? "Medium" : "Regular");
    setSelectedAddOns([]);
    setRemovedIngredients([]);
    setSpecialInstructions("");
    setCoupon("");
    setCouponMessage("");
  };

  return (
    <>
      <Col sm={6} lg={4} xl={3} className="mb-4">
        <Card className="overflow-hidden">
          <div
            className={`menu-card-image overflow-hidden ${
              soldOut ? "sold-out-image" : ""
            }`}
          >
            <Card.Img variant="top" src={image} alt={title} />
            {badgeLabel && <span className="menu-item-badge">{badgeLabel}</span>}
            {soldOut && <span className="sold-out-badge">SOLD OUT</span>}
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
                onClick={toggleFavorite}
              >
                <i className={`bi ${isFavorite ? "bi-heart-fill" : "bi-heart"}`}></i>
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
                  disabled={soldOut}
                  onClick={() => setShowCustomize(true)}
                >
                  <i className="bi bi-bag em-2"></i> Customize
                </button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Modal
        show={showCustomize && !soldOut}
        onHide={() => setShowCustomize(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center gap-2">
            <span>{isFries ? "🍟" : "🍔"}</span>
            <span>Customize {title}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 py-3">
          {/* Size Selection */}
          <div className="mb-4">
            <Form.Label className="fw-bold mb-2">
              {isFries ? "Choose Fries Size:" : "Burger Patty Option:"}
            </Form.Label>
            <div className="d-flex gap-2 flex-wrap">
              {isFries ? (
                <>
                  <button
                    type="button"
                    className={`btn btn-sm ${
                      selectedSize === "Medium" ? "btn-warning fw-bold" : "btn-outline-secondary"
                    }`}
                    onClick={() => setSelectedSize("Medium")}
                  >
                    Medium (Base: ₱{price.toFixed(2)})
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${
                      selectedSize === "Large" ? "btn-warning fw-bold" : "btn-outline-secondary"
                    }`}
                    onClick={() => setSelectedSize("Large")}
                  >
                    Large (+₱25.00 · ₱{(price + 25).toFixed(2)})
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className={`btn btn-sm ${
                      selectedSize === "Regular" ? "btn-warning fw-bold" : "btn-outline-secondary"
                    }`}
                    onClick={() => setSelectedSize("Regular")}
                  >
                    Single Patty (Base: ₱{price.toFixed(2)})
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${
                      selectedSize === "Large" ? "btn-warning fw-bold" : "btn-outline-secondary"
                    }`}
                    onClick={() => setSelectedSize("Large")}
                  >
                    Double Patty (+₱40.00 · ₱{(price + 40).toFixed(2)})
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Add-ons Checklist */}
          <div className="mb-4">
            <Form.Label className="fw-bold mb-2">
              {isFries ? "Toppings & Dipping Extras:" : "Delicious Add-Ons:"}
            </Form.Label>
            <div className="row g-2">
              {addOnChoices.map((addon) => (
                <div key={addon.name} className="col-sm-6">
                  <div
                    className={`p-2 border rounded d-flex justify-content-between align-items-center cursor-pointer ${
                      selectedAddOns.includes(addon.name) ? "border-warning bg-light" : ""
                    }`}
                    onClick={() =>
                      setSelectedAddOns((current) =>
                        current.includes(addon.name)
                          ? current.filter((n) => n !== addon.name)
                          : [...current, addon.name]
                      )
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <Form.Check
                      type="checkbox"
                      id={`addon-${addon.name}`}
                      label={addon.name}
                      checked={selectedAddOns.includes(addon.name)}
                      onChange={() => {}}
                    />
                    <Badge bg="light" text="dark" className="border">
                      +₱{addon.price.toFixed(2)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ingredient Removals / Preparation Preferences */}
          <div className="mb-4">
            <Form.Label className="fw-bold mb-1">
              {isFries ? "Preparation Preferences:" : "Ingredient Exclusions:"}
            </Form.Label>
            <p className="text-muted small mb-2">
              Tap to customize standard preparation (no extra charge).
            </p>
            <div className="d-flex flex-wrap gap-2">
              {(isFries ? friesPreparationOptions : burgerRemovalOptions).map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`btn btn-sm rounded-pill ${
                    removedIngredients.includes(option)
                      ? "btn-danger text-white"
                      : "btn-outline-secondary"
                  }`}
                  onClick={() => toggleRemoval(option)}
                >
                  {removedIngredients.includes(option) ? "✓ " : "+ "}
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Special Instructions Note */}
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <Form.Label className="fw-bold mb-0">Special Preparation Request:</Form.Label>
              <small className="text-muted">{specialInstructions.length}/120 characters</small>
            </div>
            <Form.Control
              as="textarea"
              rows={2}
              maxLength={120}
              placeholder="e.g. Less sauce, extra crispy, sauce on the side..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
            />
            <div className="text-muted small mt-1">
              Requests are prepared fresh. Standard kitchen requests (sauce, seasoning, exclusions) are fulfilled with care.
            </div>
          </div>

          <hr />

          {/* Coupon Code */}
          <div className="mb-3">
            <Form.Label className="fw-bold">🎟️ Item Promo Code</Form.Label>
            <div className="input-group">
              <Form.Control
                value={coupon}
                onChange={(event) => {
                  setCoupon(event.target.value);
                  setCouponMessage("");
                }}
                placeholder="Enter TASTYBURGER67"
              />
              <button
                type="button"
                className="btn btn-outline-warning"
                onClick={() => {
                  if (coupon.trim().toUpperCase() === discountCode) {
                    setCouponMessage("");
                  } else {
                    setCouponMessage("Try TASTYBURGER67 for 10% off.");
                  }
                }}
              >
                Apply
              </button>
            </div>
            <div className="small text-muted mt-1">Use TASTYBURGER67 for 10% off this item.</div>
            {couponMessage && <div className="text-danger small mt-2">{couponMessage}</div>}
            {coupon.trim().toUpperCase() === discountCode && (
              <div className="text-success small mt-2">
                Discount code applied! You save ₱{discount.toFixed(2)}.
              </div>
            )}
          </div>

          {/* Summary Box */}
          <div className="p-3 bg-light rounded d-flex justify-content-between align-items-center">
            <div>
              <div className="fw-bold text-dark">{title}</div>
              <small className="text-muted">
                Size: {selectedSize}
                {selectedAddOns.length > 0 ? ` · ${selectedAddOns.join(", ")}` : ""}
                {removedIngredients.length > 0 ? ` · ${removedIngredients.join(", ")}` : ""}
              </small>
            </div>
            <div className="text-end">
              <div className="small text-muted">Item Total</div>
              <h4 className="mb-0 text-danger fw-bold">₱{finalPrice.toFixed(2)}</h4>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowCustomize(false)}>
            Cancel
          </Button>
          <Button variant="warning" className="fw-bold px-4" onClick={confirmAdd}>
            Add to Cart · ₱{finalPrice.toFixed(2)}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Cards;
