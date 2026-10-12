import { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Modal, Button, Form, Spinner, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import type { AppliedDiscount, CustomerInfo, OrderRecord, PaymentMethod, CartItem } from "../types";
import { saveOrder } from "../utils/orders";
import { getSmartRecommendations } from "../utils/recommendations";
import "../styles/checkout.css";
import CashGLogo from "../assets/payment/cashg-logo.png";

const CUSTOMER_STORAGE_KEY = "tastyCustomerProfile";

function Checkout() {
  const { cartItems, updateQuantity, removeFromCart, updateSpecialInstructions, addToCart, clearCart } = useCart();
  const navigate = useNavigate();

  // Customer Information State
  const [customer, setCustomer] = useState<CustomerInfo>(() => {
    try {
      const saved = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      fullName: "",
      contactNumber: "",
      email: "",
      address: "",
      barangay: "",
      city: "Sorsogon City",
      province: "Sorsogon",
      landmark: "",
      deliveryInstructions: "",
    };
  });

  const [saveProfile, setSaveProfile] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Delivery & Instructions States
  const [deliveryInstructions, setDeliveryInstructions] = useState(customer.deliveryInstructions || "");
  const [contactless, setContactless] = useState(false);

  // Payment Method States
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash on Delivery");
  const [codChangeFor, setCodChangeFor] = useState("Exact");
  const [customCodBill, setCustomCodBill] = useState("");
  const [gcashRef, setGcashRef] = useState("");

  // Rider Tip State
  const [riderTip, setRiderTip] = useState<number>(20);

  // Promo Code & Student Discount States
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentModalError, setStudentModalError] = useState("");

  // Item Special Instruction Editing in Summary
  const [activeInstructionItem, setActiveInstructionItem] = useState<{ id: string; title: string; note: string } | null>(null);

  // Recommendations Filter State
  const [recFilter, setRecFilter] = useState<"all" | "family" | "student" | "budget" | "under100">("all");

  // Order Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  // Calculate Subtotal
  const subtotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cartItems]
  );

  // Delivery fee: ₱49 standard, free for orders >= ₱500
  const deliveryFee = cartItems.length > 0 ? (subtotal >= 500 ? 0 : 49) : 0;

  // Calculate Discount Amount
  const discountAmount = useMemo(() => {
    if (!appliedDiscount) return 0;
    if (appliedDiscount.type === "percentage" || appliedDiscount.type === "student") {
      // 10% or 15% off food subtotal
      const rate = appliedDiscount.type === "student" ? 0.15 : 0.1;
      return Math.round(subtotal * rate * 100) / 100;
    }
    if (appliedDiscount.type === "fixed") {
      return Math.min(appliedDiscount.discountAmount, subtotal);
    }
    return 0;
  }, [appliedDiscount, subtotal]);

  // Final Total
  const finalTotal = useMemo(() => {
    const calculated = subtotal - discountAmount + deliveryFee + riderTip;
    return Math.max(0, Math.round(calculated * 100) / 100);
  }, [subtotal, discountAmount, deliveryFee, riderTip]);

  // Phone Validation for Philippine Numbers
  // Matches 09xxxxxxxxx, +639xxxxxxxxx, or 9xxxxxxxxx (with optional spaces/hyphens)
  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/[\s-]/g, "");
    const phMobileRegex = /^(09\d{9}|\+639\d{9}|9\d{9})$/;
    return phMobileRegex.test(cleaned);
  };

  const handleApplyCoupon = () => {
    const trimmed = couponCode.trim().toUpperCase();
    setCouponError("");

    if (!trimmed) {
      setCouponError("Please enter a voucher code.");
      return;
    }

    if (trimmed === "TASTYBURGER67") {
      setAppliedDiscount({
        code: "TASTYBURGER67",
        description: "10% Off Tasty Burger Special",
        type: "percentage",
        discountAmount: 0,
      });
      setCouponCode("");
    } else if (trimmed === "WELCOME50") {
      if (subtotal < 300) {
        setCouponError("WELCOME50 requires a minimum subtotal of ₱300.");
        return;
      }
      setAppliedDiscount({
        code: "WELCOME50",
        description: "₱50 Off Welcome Treat",
        type: "fixed",
        discountAmount: 50,
      });
      setCouponCode("");
    } else if (trimmed === "STUDENT15") {
      setShowStudentModal(true);
    } else {
      setCouponError("Invalid promo code. Try TASTYBURGER67 or WELCOME50.");
    }
  };

  const handleApplyStudentDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim() || !studentId.trim()) {
      setStudentModalError("Please provide both your school name and student ID.");
      return;
    }

    setAppliedDiscount({
      code: "STUDENT15",
      description: `15% Student Discount (${schoolName.trim()} · ID ${studentId.trim()})`,
      type: "student",
      discountAmount: 0,
      studentDetails: {
        schoolName: schoolName.trim(),
        studentId: studentId.trim(),
      },
    });

    setShowStudentModal(false);
    setStudentModalError("");
    setCouponCode("");
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!customer.fullName.trim()) {
      newErrors.fullName = "Please enter your full name.";
    }

    if (!customer.contactNumber.trim()) {
      newErrors.contactNumber = "Please enter your contact number.";
    } else if (!validatePhone(customer.contactNumber)) {
      newErrors.contactNumber = "Please enter a valid Philippine mobile number (e.g. 0917-123-4567).";
    }

    if (customer.email && customer.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customer.email.trim())) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    if (!customer.address.trim()) {
      newErrors.address = "Please enter your house number, street, or building name.";
    }

    if (!customer.barangay.trim()) {
      newErrors.barangay = "Please enter your barangay.";
    }

    if (!customer.city.trim()) {
      newErrors.city = "Please enter your city or municipality.";
    }

    if (!customer.province.trim()) {
      newErrors.province = "Please enter your province.";
    }

    if (cartItems.length === 0) {
      newErrors.cart = "Your cart is empty. Please add items from our menu first.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (isSubmitting) return;

    if (!validateForm()) {
      // scroll to first error
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    if (saveProfile) {
      try {
        localStorage.setItem(
          CUSTOMER_STORAGE_KEY,
          JSON.stringify({ ...customer, deliveryInstructions })
        );
      } catch {
        // ignore
      }
    }

    const orderId = `TB-${Date.now().toString().slice(-8)}`;
    const newOrder: OrderRecord = {
      id: orderId,
      items: cartItems.map((item) => ({ ...item })),
      subtotal,
      delivery: deliveryFee,
      riderTip,
      discount: appliedDiscount
        ? {
            ...appliedDiscount,
            discountAmount,
          }
        : null,
      total: finalTotal,
      status: "Order Received",
      createdAt: new Date().toISOString(),
      customer: {
        ...customer,
        deliveryInstructions,
      },
      deliveryInstructions: deliveryInstructions.trim() || undefined,
      contactlessDelivery: contactless,
      paymentMethod,
      paymentDetails: {
        changeFor: paymentMethod === "Cash on Delivery" ? (codChangeFor === "Other" ? customCodBill : codChangeFor) : undefined,
        gcashReference: paymentMethod === "GCash" ? gcashRef.trim() || "SIMULATED-ONLINE" : undefined,
      },
      estimatedDeliveryMinutes: 30,
    };

    setTimeout(() => {
      saveOrder(newOrder);
      setConfirmedOrder(newOrder);
      clearCart();
      setIsSubmitting(false);
    }, 700);
  };

  // Recommendations filtered
  const smartRecommendations = useMemo(() => {
    const list = getSmartRecommendations(cartItems);
    if (recFilter === "family") return list.filter((r) => r.category === "family");
    if (recFilter === "student") return list.filter((r) => r.category === "student");
    if (recFilter === "budget") return list.filter((r) => r.category === "budget" || r.bundlePrice <= 150);
    if (recFilter === "under100") return list.filter((r) => r.bundlePrice <= 100);
    return list;
  }, [cartItems, recFilter]);

  const addRecommendationToCart = (itemPayload: Omit<CartItem, "quantity">) => {
    addToCart(itemPayload, 1);
  };

  return (
    <section className="checkout_section">
      <Container>
        {/* Page Header */}
        <div className="checkout_header">
          <span className="checkout_kicker">FAST & TASTY DELIVERY</span>
          <h1 className="checkout_title">Complete Your Order</h1>
          <p className="checkout_subtitle">
            Review your food items, provide your delivery address, and place your order.
          </p>
        </div>

        {errors.cart && (
          <div className="alert alert-danger text-center mb-4">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {errors.cart} <Link to="/" className="fw-bold text-danger ms-2">Browse Menu →</Link>
          </div>
        )}

        <Row>
          {/* LEFT COLUMN: Customer Info, Delivery, Contactless, Payment, Rider Tip */}
          <Col lg={7}>
            {/* 1. Customer Information Card */}
            <div className="checkout_card">
              <div className="checkout_card_title">
                <i className="bi bi-geo-alt-fill"></i>
                <span>1. Customer & Delivery Address</span>
              </div>

              <Row className="g-3">
                <Col md={6}>
                  <Form.Label className="checkout_form_label">
                    Full Name <span className="required">*</span>
                  </Form.Label>
                  <Form.Control
                    className={`checkout_input ${errors.fullName ? "is-invalid" : ""}`}
                    placeholder="e.g. Maria Santos"
                    value={customer.fullName}
                    onChange={(e) => {
                      setCustomer({ ...customer, fullName: e.target.value });
                      if (errors.fullName) setErrors({ ...errors, fullName: "" });
                    }}
                  />
                  {errors.fullName && <div className="checkout_error">{errors.fullName}</div>}
                </Col>

                <Col md={6}>
                  <Form.Label className="checkout_form_label">
                    Contact Number <span className="required">*</span>
                  </Form.Label>
                  <Form.Control
                    className={`checkout_input ${errors.contactNumber ? "is-invalid" : ""}`}
                    placeholder="0917-123-4567 or +639..."
                    value={customer.contactNumber}
                    onChange={(e) => {
                      setCustomer({ ...customer, contactNumber: e.target.value });
                      if (errors.contactNumber) setErrors({ ...errors, contactNumber: "" });
                    }}
                  />
                  {errors.contactNumber && (
                    <div className="checkout_error">{errors.contactNumber}</div>
                  )}
                </Col>

                <Col md={12}>
                  <Form.Label className="checkout_form_label">
                    Email Address <small className="text-muted">(Optional for order receipts)</small>
                  </Form.Label>
                  <Form.Control
                    className={`checkout_input ${errors.email ? "is-invalid" : ""}`}
                    type="email"
                    placeholder="maria.santos@gmail.com"
                    value={customer.email}
                    onChange={(e) => {
                      setCustomer({ ...customer, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                  />
                  {errors.email && <div className="checkout_error">{errors.email}</div>}
                </Col>

                <Col md={12}>
                  <Form.Label className="checkout_form_label">
                    House / Unit / Street / Subdivision / Building <span className="required">*</span>
                  </Form.Label>
                  <Form.Control
                    className={`checkout_input ${errors.address ? "is-invalid" : ""}`}
                    placeholder="e.g. Blk 4 Lot 12 Dahlia St., San Rafael Subd."
                    value={customer.address}
                    onChange={(e) => {
                      setCustomer({ ...customer, address: e.target.value });
                      if (errors.address) setErrors({ ...errors, address: "" });
                    }}
                  />
                  {errors.address && <div className="checkout_error">{errors.address}</div>}
                </Col>

                <Col md={4}>
                  <Form.Label className="checkout_form_label">
                    Barangay <span className="required">*</span>
                  </Form.Label>
                  <Form.Control
                    className={`checkout_input ${errors.barangay ? "is-invalid" : ""}`}
                    placeholder="e.g. San Juan"
                    value={customer.barangay}
                    onChange={(e) => {
                      setCustomer({ ...customer, barangay: e.target.value });
                      if (errors.barangay) setErrors({ ...errors, barangay: "" });
                    }}
                  />
                  {errors.barangay && <div className="checkout_error">{errors.barangay}</div>}
                </Col>

                <Col md={4}>
                  <Form.Label className="checkout_form_label">
                    City / Municipality <span className="required">*</span>
                  </Form.Label>
                  <Form.Control
                    className={`checkout_input ${errors.city ? "is-invalid" : ""}`}
                    placeholder="e.g. Sorsogon City"
                    value={customer.city}
                    onChange={(e) => {
                      setCustomer({ ...customer, city: e.target.value });
                      if (errors.city) setErrors({ ...errors, city: "" });
                    }}
                  />
                  {errors.city && <div className="checkout_error">{errors.city}</div>}
                </Col>

                <Col md={4}>
                  <Form.Label className="checkout_form_label">
                    Province <span className="required">*</span>
                  </Form.Label>
                  <Form.Control
                    className={`checkout_input ${errors.province ? "is-invalid" : ""}`}
                    placeholder="e.g. Sorsogon"
                    value={customer.province}
                    onChange={(e) => {
                      setCustomer({ ...customer, province: e.target.value });
                      if (errors.province) setErrors({ ...errors, province: "" });
                    }}
                  />
                  {errors.province && <div className="checkout_error">{errors.province}</div>}
                </Col>

                <Col md={12}>
                  <Form.Label className="checkout_form_label">
                    Landmark or Nearby Establishment <small className="text-muted">(Helps our rider find you)</small>
                  </Form.Label>
                  <Form.Control
                    className="checkout_input"
                    placeholder="e.g. Near SM City Sorsogon, yellow gate across elementary school"
                    value={customer.landmark}
                    onChange={(e) => setCustomer({ ...customer, landmark: e.target.value })}
                  />
                </Col>

                <Col md={12}>
                  <Form.Check
                    type="checkbox"
                    id="save-profile"
                    label="Save my delivery details in this browser for quick future orders"
                    checked={saveProfile}
                    onChange={(e) => setSaveProfile(e.target.checked)}
                  />
                </Col>
              </Row>
            </div>

            {/* 2. Delivery Instructions */}
            <div className="checkout_card">
              <div className="checkout_card_title">
                <i className="bi bi-bicycle"></i>
                <span>2. Delivery Instructions</span>
              </div>

              <Form.Label className="checkout_form_label">
                Instructions for Rider <small className="text-muted">(Optional)</small>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                maxLength={150}
                className="checkout_input"
                placeholder="e.g. Please call upon arrival, leave with security guard, etc."
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
              />
              <div className="d-flex justify-content-between text-muted small mt-1">
                <span>Select quick options:</span>
                <span>{deliveryInstructions.length}/150</span>
              </div>

              <div className="quick_chips_wrap">
                {[
                  "Please call upon arrival",
                  "Leave the order with the guard",
                  "Deliver to side entrance",
                  "Ring the doorbell",
                  "Knock gently, baby is sleeping",
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    className={`quick_chip ${deliveryInstructions.includes(chip) ? "active" : ""}`}
                    onClick={() => {
                      if (deliveryInstructions.includes(chip)) {
                        setDeliveryInstructions(deliveryInstructions.replace(chip, "").trim());
                      } else {
                        setDeliveryInstructions((prev) =>
                          prev ? `${prev}, ${chip}`.slice(0, 150) : chip
                        );
                      }
                    }}
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Special Food Instructions per Item */}
            <div className="checkout_card">
              <div className="checkout_card_title">
                <i className="bi bi-egg-fried"></i>
                <span>3. Special Food Instructions</span>
              </div>

              <p className="small text-muted mb-3">
                Specify kitchen preparation requests for individual items in your order (e.g. less sauce, extra crispy, no onions).
              </p>

              {cartItems.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-3 bg-light rounded border">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="fw-bold text-dark">
                          {item.title} {item.selectedSize ? `(${item.selectedSize})` : ""}
                        </div>
                        <Badge bg="secondary">Qty: {item.quantity}</Badge>
                      </div>

                      {item.specialInstructions ? (
                        <div className="d-flex align-items-center justify-content-between bg-white p-2 rounded border">
                          <div className="small text-dark">
                            <i className="bi bi-chat-dots-fill text-warning me-2"></i>
                            <strong>Request:</strong> {item.specialInstructions}
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() =>
                              setActiveInstructionItem({
                                id: item.id,
                                title: item.title,
                                note: item.specialInstructions || "",
                              })
                            }
                          >
                            Change
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-warning w-100"
                          onClick={() =>
                            setActiveInstructionItem({
                              id: item.id,
                              title: item.title,
                              note: "",
                            })
                          }
                        >
                          <i className="bi bi-plus-circle me-1"></i> Add food preparation request
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted small">Add food items to your cart to customize preparation.</div>
              )}

              <div className="alert alert-info py-2 px-3 mt-3 mb-0 small">
                <i className="bi bi-info-circle-fill me-1"></i>
                <strong>Kitchen Note:</strong> We prepare orders fresh. Requests for sauce adjustments, seasoning levels, and ingredient exclusions are fulfilled diligently. Custom off-menu substitutions cannot be guaranteed.
              </div>
            </div>

            {/* 4. Contactless Delivery Toggle */}
            <div className="checkout_card">
              <div className="checkout_card_title">
                <i className="bi bi-shield-check"></i>
                <span>4. Contactless Delivery</span>
              </div>

              <div className={`contactless_box ${contactless ? "is_active" : ""}`}>
                <div className="contactless_info">
                  <h6>{contactless ? "Contactless Delivery Enabled" : "Enable Contactless Drop-Off"}</h6>
                  <p>
                    {contactless
                      ? "Rider will drop your package at your door or gate, notify you by phone or doorbell, and maintain safe physical distance."
                      : "Prefer zero physical contact? Toggle on to have your food placed safely at your doorstep or gate."}
                  </p>
                </div>
                <label className="switch_toggle">
                  <input
                    type="checkbox"
                    checked={contactless}
                    onChange={(e) => setContactless(e.target.checked)}
                  />
                  <span className="switch_slider"></span>
                </label>
              </div>
            </div>

            {/* 5. Payment Method */}
            <div className="checkout_card">
              <div className="checkout_card_title">
                <i className="bi bi-credit-card-fill"></i>
                <span>5. Payment Method</span>
              </div>

              <div className="payment_grid">
                <div
                  className={`payment_option ${paymentMethod === "Cash on Delivery" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("Cash on Delivery")}
                >
                  <div className="payment_option_icon text-success">
                    <i className="bi bi-cash-stack"></i>
                  </div>
                  <div className="payment_option_title">Cash on Delivery</div>
                  <div className="payment_option_sub">Pay cash when food arrives</div>
                </div>

                <div
                  className={`payment_option ${paymentMethod === "GCash" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("GCash")}
                >
                  <div className="payment_option_icon payment_option_gcash_logo">
                    <img src={CashGLogo} alt="GCash payment logo" />
                  </div>
                  <div className="payment_option_title">GCash (Simulated)</div>
                  <div className="payment_option_sub">Fast & cashless mobile wallet</div>
                </div>
              </div>

              {/* COD Change Details */}
              {paymentMethod === "Cash on Delivery" && (
                <div className="p-3 bg-light rounded border mt-2">
                  <Form.Label className="checkout_form_label mb-1">
                    Do you need change for cash payment?
                  </Form.Label>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    {["Exact", "₱500", "₱1,000", "Other"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        className={`btn btn-sm ${codChangeFor === opt ? "btn-warning fw-bold" : "btn-outline-secondary"}`}
                        onClick={() => setCodChangeFor(opt)}
                      >
                        {opt === "Exact" ? "Exact Cash" : opt === "Other" ? "Custom Bill" : `Change for ${opt}`}
                      </button>
                    ))}
                  </div>
                  {codChangeFor === "Other" && (
                    <Form.Control
                      type="number"
                      size="sm"
                      className="mt-2"
                      placeholder="Specify your bill amount (e.g. ₱2000)"
                      value={customCodBill}
                      onChange={(e) => setCustomCodBill(e.target.value)}
                    />
                  )}
                </div>
              )}

              {/* GCash Simulated Payment Info */}
              {paymentMethod === "GCash" && (
                <div className="gcash_box">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="gcash_badge">OFFICIAL GCASH MERCHANT</span>
                    <small className="text-muted">Simulated Sandbox</small>
                  </div>
                  <div className="small text-dark mb-2">
                    <div><strong>Merchant Name:</strong> Tasty Burger Philippines Inc.</div>
                    <div><strong>GCash Mobile No:</strong> 0917-827-8924 (0917-TASTY-BG)</div>
                  </div>
                  <Form.Label className="small fw-bold mb-1">
                    GCash Reference Number <small className="text-muted">(Optional for demo checkout)</small>
                  </Form.Label>
                  <Form.Control
                    size="sm"
                    placeholder="e.g. 902418293041"
                    value={gcashRef}
                    onChange={(e) => setGcashRef(e.target.value)}
                  />
                  <div className="text-danger small mt-2">
                    <i className="bi bi-shield-lock-fill me-1"></i>
                    <strong>Security Notice:</strong> We will never ask for your GCash MPIN or OTP.
                  </div>
                </div>
              )}
            </div>

            {/* 6. Rider Tip */}
            <div className="checkout_card">
              <div className="checkout_card_title">
                <i className="bi bi-heart-fill"></i>
                <span>6. Add Rider Tip</span>
              </div>

              <p className="small text-muted mb-2">
                Show your appreciation for our delivery riders braving traffic and weather. 100% goes directly to the rider.
              </p>

              <div className="tip_chips_wrap mb-3">
                {[0, 20, 50, 100].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className={`tip_chip ${riderTip === amount ? "active" : ""}`}
                    onClick={() => setRiderTip(amount)}
                  >
                    {amount === 0 ? "No Tip" : `₱${amount}`}
                  </button>
                ))}

                {/* Custom Tip +/- buttons */}
                <div className="d-flex align-items-center border rounded-pill px-3 py-1 bg-white">
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0 text-dark text-decoration-none fw-bold"
                    onClick={() => setRiderTip((t) => Math.max(0, t - 10))}
                  >
                    -
                  </button>
                  <span className="mx-2 small fw-bold">Custom: ₱{riderTip}</span>
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0 text-dark text-decoration-none fw-bold"
                    onClick={() => setRiderTip((t) => t + 10)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </Col>

          {/* RIGHT COLUMN: Order Summary & Place Order */}
          <Col lg={5}>
            <div className="checkout_summary_card">
              <div className="summary_header">
                <h4>Order Summary</h4>
                <Badge bg="warning" text="dark" className="px-2 py-1">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)} Items
                </Badge>
              </div>

              {/* Itemized List */}
              <div className="summary_item_list">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item.id} className="summary_product_row">
                      <img src={item.image} alt={item.title} className="summary_product_img" />
                      <div className="summary_product_details">
                        <div className="summary_product_name">{item.title}</div>
                        <div className="summary_product_meta">
                          {item.selectedSize && <span>Size: {item.selectedSize} · </span>}
                          ₱{item.price.toFixed(2)} each
                        </div>

                        {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                          <div className="summary_product_meta">
                            + {item.selectedAddOns.join(", ")}
                          </div>
                        )}

                        {item.removedIngredients && item.removedIngredients.length > 0 && (
                          <div className="text-warning small" style={{ fontSize: "11px" }}>
                            Excl: {item.removedIngredients.join(", ")}
                          </div>
                        )}

                        {item.specialInstructions && (
                          <div className="summary_product_instruction">
                            <i className="bi bi-chat-quote-fill me-1"></i>
                            {item.specialInstructions}
                          </div>
                        )}

                        <div className="summary_qty_controls">
                          <button
                            type="button"
                            className="summary_qty_btn"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            -
                          </button>
                          <span className="small fw-bold px-1">{item.quantity}</span>
                          <button
                            type="button"
                            className="summary_qty_btn"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            +
                          </button>
                          <button
                            type="button"
                            className="summary_remove_btn"
                            onClick={() => removeFromCart(item.id)}
                            title="Remove"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                          <span className="ms-auto small fw-bold text-warning">
                            ₱{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted">
                    <p>Your cart is empty.</p>
                    <Link to="/" className="btn btn-sm btn-outline-warning">
                      Browse Menu
                    </Link>
                  </div>
                )}
              </div>

              {/* Promo Code & Student Discount */}
              <div className="summary_coupon_wrap">
                <input
                  type="text"
                  className="summary_coupon_input"
                  placeholder="Promo Code (TASTYBURGER67)"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    setCouponError("");
                  }}
                />
                <button
                  type="button"
                  className="summary_coupon_btn"
                  onClick={handleApplyCoupon}
                >
                  Apply
                </button>
              </div>

              {couponError && (
                <div className="text-danger small mb-2">{couponError}</div>
              )}

              {/* Student Discount Button */}
              <div className="mb-3">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-light w-100 d-flex justify-content-between align-items-center"
                  onClick={() => setShowStudentModal(true)}
                >
                  <span>🎓 Student Discount (15% Off)</span>
                  <small className="text-warning">Verify ID →</small>
                </button>
              </div>

              {/* Applied Discount Display */}
              {appliedDiscount && (
                <div className="d-flex justify-content-between align-items-center p-2 rounded bg-dark border border-success mb-3">
                  <div>
                    <span className="badge bg-success me-2">{appliedDiscount.code}</span>
                    <small className="text-light">{appliedDiscount.description}</small>
                  </div>
                  <button
                    type="button"
                    className="btn btn-link btn-sm text-danger p-0 ms-2"
                    onClick={() => setAppliedDiscount(null)}
                    title="Remove coupon"
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </button>
                </div>
              )}

              {/* Calculation Breakdown */}
              <div className="calc_row">
                <span>Items Subtotal</span>
                <span>₱{subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="calc_row discount_row">
                  <span>Discount ({appliedDiscount?.code})</span>
                  <span>-₱{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="calc_row">
                <span>
                  Delivery Fee {subtotal >= 500 && subtotal > 0 ? "(Free over ₱500)" : ""}
                </span>
                <span>{deliveryFee === 0 ? "FREE" : `₱${deliveryFee.toFixed(2)}`}</span>
              </div>

              {riderTip > 0 && (
                <div className="calc_row">
                  <span>Rider Tip</span>
                  <span>₱{riderTip.toFixed(2)}</span>
                </div>
              )}

              <div className="calc_row total_row">
                <span>Total Amount</span>
                <span>₱{finalTotal.toFixed(2)}</span>
              </div>

              <div className="text-end small text-muted mt-1">
                Payment: <strong>{paymentMethod}</strong>
              </div>

              {/* Prominent Place Order Button */}
              <button
                type="button"
                className="btn_place_order"
                disabled={isSubmitting || cartItems.length === 0}
                onClick={handlePlaceOrder}
              >
                {isSubmitting ? (
                  <>
                    <Spinner animation="border" size="sm" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-bag-check-fill"></i>
                    <span>Place Order · ₱{finalTotal.toFixed(2)}</span>
                  </>
                )}
              </button>

              <div className="text-center mt-3">
                <Link to="/cart" className="text-decoration-none text-light small">
                  ← Back to Cart
                </Link>
              </div>
            </div>
          </Col>
        </Row>

        {/* 7. Smart Food Recommendations Section */}
        <div className="recommendations_section">
          <div className="recommendations_header_wrap">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-2">
              <div className="recommendations_title_box">
                <div className="rec_heading_kicker_row">
                  <span className="checkout_kicker mb-0">RECOMMENDED FOR YOU</span>
                  {/* Decorative Left-Moving Chevrons beside the kicker */}
                  <div
                    className="rec_chevron_stream_mini"
                    aria-hidden="true"
                    title="Flowing recommendations"
                  >
                    <div className="rec_mini_track">
                      {[...Array(16)].map((_, i) => (
                        <i key={i} className="bi bi-chevron-left rec_chevron_icon" />
                      ))}
                    </div>
                  </div>
                </div>
                <h3 className="checkout_card_title rec_title mb-0 border-0 p-0">
                  Complete Your Feast With Smart Bundles
                </h3>
              </div>

              {/* Filter Buttons */}
              <div className="rec_filter_tabs">
                {[
                  { id: "all", label: "All Specials" },
                  { id: "family", label: "👨‍👩‍👧‍👦 Family Bundles" },
                  { id: "student", label: "🎓 Student Meals" },
                  { id: "under100", label: "🏷️ Under ₱100" },
                  { id: "budget", label: "⚡ Best Value" },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    className={`rec_filter_btn ${recFilter === id ? "active" : ""}`}
                    onClick={() => setRecFilter(id as any)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Continuous Left-Moving Chevron Banner Strip */}
            <div className="rec_chevron_strip" aria-hidden="true">
              <div className="rec_chevron_strip_track">
                {/* Track Group 1 */}
                <div className="rec_strip_group">
                  <span className="rec_strip_label">SPECIAL BUNDLE OFFERS</span>
                  <span className="rec_chevron_sequence">
                    <i className="bi bi-chevron-left" />
                    <i className="bi bi-chevron-left" />
                    <i className="bi bi-chevron-left" />
                    <i className="bi bi-chevron-left" />
                    <i className="bi bi-chevron-left" />
                    <i className="bi bi-chevron-left" />
                  </span>
                  <span className="rec_strip_label">BEST VALUE FEASTS</span>
                  <span className="rec_chevron_sequence">
                    <i className="bi bi-chevron-left" />
                    <i className="bi bi-chevron-left" />
                    <i className="bi bi-chevron-left" />
                    <i className="bi bi-chevron-left" />
                    <i className="bi bi-chevron-left" />
                    <i className="bi bi-chevron-left" />
                  </span>
                  <span className="rec_strip_label">MORE TASTE FOR LESS</span>
                  <span className="rec_chevron_sequence">
                    <i className="bi bi-chevron-left" />
                    <i className="bi bi-chevron-left" />
                    <i className="bi bi-chevron-left" />
                    <i className="bi bi-chevron-left" />
                    <i className="bi bi-chevron-left" />
                    <i className="bi bi-chevron-left" />
                  </span>
                </div>
                {/* Track Group 2 (Exact duplicate for seamless infinite loop) */}
                <div className="rec_strip_group">
                  <span className="rec_strip_label">SPECIAL BUNDLE OFFERS</span>
                  <span className="rec_chevron_sequence">
                    <i className="bi bi-chevron-left" />
                    <i className="bi bi-chevron-left" />
                    <i className="bi bi-chevron-left" />
                    <i className="bi bi-chevron-left" />
                    <i className="bi bi-chevron-left" />
                    <i className="bi bi-chevron-left" />
                  </span>
                  <span className="rec_strip_label">BEST VALUE FEASTS</span>
                  <span className="rec_chevron_sequence">
                    <i className="bi bi-chevron-left" />
                    <i className="bi bi-chevron-left" />
                    <i className="bi bi-chevron-left" />
                    <i className="bi bi-chevron-left" />
                    <i className="bi bi-chevron-left" />
                    <i className="bi bi-chevron-left" />
                  </span>
                  <span className="rec_strip_label">MORE TASTE FOR LESS</span>
                  <span className="rec_chevron_sequence">
                    <i className="bi bi-chevron-left" />
                    <i className="bi bi-chevron-left" />
                    <i className="bi bi-chevron-left" />
                    <i className="bi bi-chevron-left" />
                    <i className="bi bi-chevron-left" />
                    <i className="bi bi-chevron-left" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Row className="g-3">
            {smartRecommendations.map((bundle, idx) => {
              const savings =
                bundle.originalPrice > bundle.bundlePrice
                  ? bundle.originalPrice - bundle.bundlePrice
                  : 0;

              return (
                <Col sm={6} lg={4} key={bundle.id}>
                  <div
                    className="bundle_card"
                    style={{ animationDelay: `${idx * 0.08}s` }}
                  >
                    <div className="bundle_card_img_wrap">
                      <div className="bundle_img_floater">
                        <img
                          src={bundle.image}
                          alt={bundle.title}
                          className="bundle_card_img"
                        />
                      </div>
                      {bundle.badge && <span className="bundle_badge">{bundle.badge}</span>}
                      {bundle.servings && (
                        <span className="bundle_servings">{bundle.servings}</span>
                      )}
                    </div>

                    <div className="bundle_card_body">
                      <div className="bundle_card_title">{bundle.title}</div>
                      <div className="bundle_card_desc">{bundle.description}</div>

                      <div className="bundle_items_list">
                        {bundle.itemsIncluded.map((itemStr, itemIdx) => (
                          <div key={itemIdx}>✓ {itemStr}</div>
                        ))}
                      </div>

                      <div className="bundle_price_row">
                        <div>
                          <span className="bundle_price_current">
                            ₱{bundle.bundlePrice.toFixed(2)}
                          </span>
                          {savings > 0 && (
                            <span className="bundle_price_original">
                              ₱{bundle.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          className="bundle_add_btn"
                          onClick={() => addRecommendationToCart(bundle.cartPayload)}
                        >
                          <i className="bi bi-plus-lg"></i> Add Bundle
                        </button>
                      </div>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </div>
      </Container>

      {/* Special Instruction Modal */}
      <Modal
        show={Boolean(activeInstructionItem)}
        onHide={() => setActiveInstructionItem(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Food Preparation Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="small text-muted mb-2">
            Customize preparation for <strong>{activeInstructionItem?.title}</strong>:
          </p>

          <Form.Control
            as="textarea"
            rows={3}
            maxLength={120}
            value={activeInstructionItem?.note || ""}
            onChange={(e) =>
              setActiveInstructionItem((curr) =>
                curr ? { ...curr, note: e.target.value } : null
              )
            }
            placeholder="e.g. Less sauce, extra crispy, no onions..."
          />

          <div className="d-flex justify-content-between text-muted small mt-1 mb-3">
            <span>Character limit</span>
            <span>{(activeInstructionItem?.note || "").length}/120</span>
          </div>

          <Form.Label className="small fw-bold mb-1">Quick Select Options:</Form.Label>
          <div className="quick_chips_wrap">
            {[
              "Less sauce",
              "No onions",
              "No pickles",
              "Extra cheese",
              "Sauce on the side",
              "Less mayonnaise",
              "No additional salt",
              "Make extra crispy",
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                className="quick_chip"
                onClick={() => {
                  setActiveInstructionItem((curr) => {
                    if (!curr) return null;
                    const updated = curr.note ? `${curr.note}, ${chip}` : chip;
                    return { ...curr, note: updated.slice(0, 120) };
                  });
                }}
              >
                + {chip}
              </button>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setActiveInstructionItem(null)}>
            Cancel
          </Button>
          <Button
            variant="warning"
            className="fw-bold"
            onClick={() => {
              if (activeInstructionItem) {
                updateSpecialInstructions(
                  activeInstructionItem.id,
                  activeInstructionItem.note.trim()
                );
                setActiveInstructionItem(null);
              }
            }}
          >
            Save Instruction
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Student Discount Verification Modal */}
      <Modal
        show={showStudentModal}
        onHide={() => setShowStudentModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center gap-2">
            <span>🎓</span>
            <span>Student Verification (15% Off)</span>
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleApplyStudentDiscount}>
          <Modal.Body>
            <p className="small text-muted mb-3">
              We provide a genuine 15% student discount for students across the Philippines. Enter your educational details below to verify eligibility:
            </p>

            <Form.Group className="mb-3">
              <Form.Label className="checkout_form_label">
                School / University Name <span className="required">*</span>
              </Form.Label>
              <Form.Control
                placeholder="e.g. Sorsogon State University / UST / DLSU"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="checkout_form_label">
                Student ID Number <span className="required">*</span>
              </Form.Label>
              <Form.Control
                placeholder="e.g. 2024-00192-SR"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </Form.Group>

            {studentModalError && (
              <div className="alert alert-danger py-2 small">{studentModalError}</div>
            )}

            <div className="alert alert-success py-2 small mb-0">
              <i className="bi bi-check-circle-fill me-1"></i>
              Verified students receive 15% off food items upon order placement.
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowStudentModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="warning" className="fw-bold">
              Verify & Apply 15% Discount
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Order Confirmation Modal */}
      <Modal
        show={Boolean(confirmedOrder)}
        onHide={() => {}}
        backdrop="static"
        keyboard={false}
        size="lg"
        centered
      >
        <Modal.Header className="confirm_modal_header border-0 pb-0 flex-column">
          <div className="confirm_icon">
            <i className="bi bi-check2"></i>
          </div>
          <h3 className="checkout_card_title mb-1 text-center justify-content-center">
            Order Placed Successfully!
          </h3>
          <p className="text-muted small mb-1 text-center">
            Thank you, {confirmedOrder?.customer?.fullName}! Your meal is being prepared hot and fresh.
          </p>
          <div className="confirm_order_id">
            ORDER ID: {confirmedOrder?.id}
          </div>
        </Modal.Header>

        <Modal.Body className="px-4 py-3">
          <div className="confirm_details_card">
            <Row className="g-2 small">
              <Col sm={6}>
                <div><strong>Estimated Delivery:</strong> 25 - 35 mins</div>
                <div><strong>Delivery Address:</strong> {confirmedOrder?.customer?.address}, Brgy. {confirmedOrder?.customer?.barangay}, {confirmedOrder?.customer?.city}, {confirmedOrder?.customer?.province}</div>
                {confirmedOrder?.customer?.landmark && (
                  <div><strong>Landmark:</strong> {confirmedOrder?.customer?.landmark}</div>
                )}
                <div><strong>Contact:</strong> {confirmedOrder?.customer?.contactNumber}</div>
              </Col>
              <Col sm={6}>
                <div><strong>Payment Method:</strong> {confirmedOrder?.paymentMethod}</div>
                {confirmedOrder?.contactlessDelivery && (
                  <div><span className="badge bg-success">Contactless Delivery Requested</span></div>
                )}
                {confirmedOrder?.deliveryInstructions && (
                  <div><strong>Rider Notes:</strong> {confirmedOrder?.deliveryInstructions}</div>
                )}
              </Col>
            </Row>
          </div>

          {/* Ordered items breakdown with special instructions */}
          <div className="mt-3">
            <h6 className="fw-bold text-dark mb-2">Order Items:</h6>
            <div className="d-flex flex-column gap-2">
              {confirmedOrder?.items.map((item, idx) => (
                <div key={idx} className="p-2 bg-light rounded d-flex justify-content-between align-items-center">
                  <div>
                    <span className="fw-bold">{item.title}</span>
                    <span className="badge bg-warning text-dark ms-2">x{item.quantity}</span>
                    {item.selectedSize && <span className="text-muted small ms-2">({item.selectedSize})</span>}
                    {item.specialInstructions && (
                      <div className="text-primary small mt-1">
                        <i className="bi bi-chat-left-text me-1"></i>
                        <strong>Special Request:</strong> {item.specialInstructions}
                      </div>
                    )}
                  </div>
                  <strong>₱{(item.price * item.quantity).toFixed(2)}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-light rounded mt-3 border">
            <div className="d-flex justify-content-between small">
              <span>Subtotal:</span>
              <span>₱{confirmedOrder?.subtotal.toFixed(2)}</span>
            </div>
            {confirmedOrder?.discount && (
              <div className="d-flex justify-content-between small text-success">
                <span>Discount ({confirmedOrder.discount.code}):</span>
                <span>-₱{confirmedOrder.discount.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="d-flex justify-content-between small">
              <span>Delivery Fee:</span>
              <span>{confirmedOrder?.delivery === 0 ? "FREE" : `₱${confirmedOrder?.delivery.toFixed(2)}`}</span>
            </div>
            {(confirmedOrder?.riderTip || 0) > 0 && (
              <div className="d-flex justify-content-between small">
                <span>Rider Tip:</span>
                <span>₱{confirmedOrder?.riderTip?.toFixed(2)}</span>
              </div>
            )}
            <hr className="my-2" />
            <div className="d-flex justify-content-between fw-bold text-dark fs-5">
              <span>Total Paid/Payable:</span>
              <span className="text-danger">₱{confirmedOrder?.total.toFixed(2)}</span>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0 justify-content-center gap-2">
          <Button
            variant="warning"
            className="fw-bold px-4"
            onClick={() => navigate(`/track/${confirmedOrder?.id}`)}
          >
            Track Order Live →
          </Button>
          <Button
            variant="outline-secondary"
            className="px-3"
            onClick={() => navigate("/order-history")}
          >
            Order History
          </Button>
          <Button
            variant="danger"
            className="px-3"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}

export default Checkout;

