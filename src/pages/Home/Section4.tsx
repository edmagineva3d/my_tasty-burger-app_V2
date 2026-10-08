import { Col, Container, Row } from "react-bootstrap";
import PromotionImage from "../../assets/promotion/pro.png";

function Section4() {
  return (
    <>
      <section className="promotion_section">
        <Container>
          <Row className="align-item-center">
            <Col lg={6} className="text-center mb-5 mb-lg-0">
              <img src={PromotionImage} alt="Promotion" className="img-fluid" />
            </Col>

            <Col lg={6} className="px-5">
              <h2>Nothing brings people together like a good burger</h2>

              <p>
                At Tasty Burger, we serve delicious food made for sharing with
                family and friends. Enjoy juicy burgers, crispy fries, and
                refreshing drinks in every meal.
              </p>

              <ul>
                <li>
                  <p>
                    Fresh and tasty burgers made with quality ingredients
                  </p>
                </li>

                <li>
                  <p>
                    Crispy fries and delicious sides to complete your meal
                  </p>
                </li>

                <li>
                  <p>
                    Great food and a fun place to enjoy with family and friends
                  </p>
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </section>

      {/* BG Parallax Scroll */}
      <section className="bg_parallax_scroll"></section>
    </>
  );
}

export default Section4;
/* keep the parallax background asset unchanged */
