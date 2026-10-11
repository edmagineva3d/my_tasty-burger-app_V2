import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

function Section7() {
  return (
    <section className="contact_section" id="contact">
      <Container>
        <Row className="align-items-center g-4">
          <Col lg={5} className="text-center text-lg-start">
            <h4>Visit Tasty Burger</h4>
            <h2>Sorsogon City – Bacon District</h2>
            <p>
              Find us around the SM City Sorsogon area. Order your favorite
              burger and enjoy fresh, delicious food in Sorsogon City.
            </p>
            <p className="location_text">
              <i className="bi bi-geo-alt-fill me-2"></i>
              Sorsogon City, Bacon District, Sorsogon, Philippines
            </p>
            <Link to="/" className="btn btn_red px-4 py-2 rounded-0">
              Call: 0919-988-8777
            </Link>
          </Col>
          <Col lg={7}>
            <div className="location_map">
              <iframe
                title="Tasty Burger location near SM City Sorsogon"
                src="https://www.google.com/maps?q=SM%20City%20Sorsogon%2C%20Sorsogon%20City%2C%20Philippines&z=16&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <div className="map_label">
                <i className="bi bi-geo-alt-fill"></i>
                <span>SM City Sorsogon Area</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Section7;

/* keep the footer banner asset unchanged */
