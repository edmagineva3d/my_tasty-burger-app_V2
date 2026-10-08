import { Col, Container, Row } from "react-bootstrap";
import Burger from "../../assets/hero/hero-2.png";
import { Link } from "react-router-dom";

function Section1() {
  return (
    <section className="hero_section" id="home">
      <Container>
        <Row>
          <Col lg={7} className="mb-5 mb-lg-0">
            <div className="position-relative">
              <img src={Burger} alt="Hero" className="img-fluid" />
              <div className="price_badge">
                <div className="badge_text">
                  <h4 className="h4_xs">Only</h4>
                  <h4 className="h3_lg">₱99.67</h4>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={5}>
            <div className="hero_text text-center">
              <h1 className="text-white">New Burger</h1>
              <h2 className="text-white">With Onion</h2>
              <p className="text-white pt-2 pb-4">
                Try our new juicy burger topped with fresh onions, melted cheese, and flavorful ingredients. A delicious combination made for every burger lover.
              </p>
              <Link to={"/"} className="btn order_now">Order Now</Link>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Section1;

/* keep the first hero image in the existing section */

/* keep the second hero image in the existing section */
