import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Pizza from "../../assets/about/pizza.png";
import Salad from "../../assets/about/salad.png";
import Delivery from "../../assets/about/delivery-bike.png";

function Section2() {
  // Tasty Burger Feature Cards
  const mockData = [
    {
      image: Pizza,
      title: "Fresh & Delicious",
      paragraph:
        "Enjoy juicy burgers made with fresh ingredients, flavorful toppings, and delicious sauces for a satisfying meal.",
    },
    {
      image: Salad,
      title: "Quality Food",
      paragraph:
        "We prepare every burger, fries, and drink with quality ingredients to give you a tasty and enjoyable experience.",
    },
    {
      image: Delivery,
      title: "Fast Delivery",
      paragraph:
        "Get your favorite Tasty Burger meals delivered quickly and enjoy delicious food wherever you are.",
    },
  ];

  return (
    <>
      <section className="about_section" id="about">
        <Container>
          <Row>
            <Col lg={{ span: 8, offset: 2 }} className="text-center">
              <h2>
                The burger tastes better when you eat it with your family
              </h2>

              <p>
                Enjoy delicious burgers, crispy fries, and refreshing drinks
                made for sharing with the people you love. Tasty Burger is
                here to make every meal more enjoyable.
              </p>

              <Link to={"/"} className="btn order_now">
                Explore Full Menu
              </Link>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="about_wrapper">
        <Container>
          <Row className="justify-content-md-center">
            {mockData.map((cardData, index) => (
              <Col md={6} lg={4} className="mb-4 mb-md-0" key={index}>
                <div className="about_box text-center">
                  <div className="about_icon">
                    <img
                      src={cardData.image}
                      alt={cardData.title}
                      className="img-fluid"
                    />
                  </div>

                  <h4>{cardData.title}</h4>
                  <p>{cardData.paragraph}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Section2;
/* keep the about section image assets unchanged */
