import { Col, Container, Row } from "react-bootstrap";
import Image1 from "../../assets/menu/burger-11.jpg";
import Image2 from "../../assets/menu/burger-12.jpg";
import Image3 from "../../assets/menu/burger-13.jpg";
import Image4 from "../../assets/menu/burger-14.jpg";
import Image5 from "../../assets/menu/burger-15.jpg";
import Image6 from "../../assets/menu/burger-16.jpg";
import Image7 from "../../assets/menu/burger-17.jpg";
import Image8 from "../../assets/menu/burger-18.jpg";
import Cards from "../../components/Layouts/Cards";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import type { Product } from "../../types";
import type { ReactNode } from "react";

function Section3() {
  const { addToCart } = useCart();
  // Mock Data Cards
  const mockData: Product[] = [
    {
      id: "0001",
      image: Image1,
      title: "Crispy Chicken",
      paragraph: "Chicken breast, chilli sauce, tomatoes, pickles, coleslaw",
      rating: 5,
      price: 99.15,
    },
    {
      id: "0002",
      image: Image2,
      title: "Ultimate Bacon",
      paragraph: "House patty, cheddar cheese, bacon, onion, mustard",
      rating: 4.5,
      price: 99.32,
    },
    {
      id: "0003",
      image: Image3,
      title: "Black Sheep",
      paragraph: "American cheese, tomato relish, avocado, lettuce, red onion",
      rating: 4,
      price: 69.15,
    },
    {
      id: "0004",
      image: Image4,
      title: "Vegan Burger",
      paragraph: "House patty, cheddar cheese, bacon, onion, mustard",
      rating: 3.5,
      price: 99.25,
    },
    {
      id: "0005",
      image: Image5,
      title: "Battered Fries",
      paragraph: "Crispy battered fries served golden and crunchy with a savory flavor",
      rating: 3.0,
      price: 59.25,
    },
    {
      id: "0006",
      image: Image6,
      title: "Crinkle Fries",
      paragraph: "Crispy crinkle-cut fries with a golden texture and delicious salty flavor",
      rating: 3,
      price: 79.18,
    },
    {
      id: "0007",
      image: Image7,
      title: "Waffle Fries",
      paragraph: "Crispy waffle-cut fries with a golden texture and delicious salty flavor",
      rating: 2.5,
      price: 99.19,
    },
    {
      id: "0008",
      image: Image8,
      title: "Smiley Fries",
      paragraph: "Fun-shaped crispy fries with a golden crunch and tasty savory flavor",
      rating: 2.0,
      price: 89.12,
    },
    // Add more mock data objects as needed
  ];

  const renderRatingIcons = (rating: number): ReactNode[] => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (rating > 0.5) {
        stars.push(<i key={i} className="bi bi-star-fill"></i>);
        rating--;
      } else if (rating > 0 && rating < 1) {
        stars.push(<i key={"half"} className="bi bi-star-half"></i>);
        rating--;
      } else {
        stars.push(<i key={`empty${i}`} className="bi bi-star"></i>);
      }
    }
    return stars;
  };

  return (
    <section className="menu_section" id="menu">
      <Container>
        <Row>
          <Col lg={{ span: 8, offset: 2 }} className="text-center mb-5">
            <h2>OUR CRAZY BURGERS</h2>
            <p className="para">
              Juicy, cheesy, and delicious burgers made fresh for every burger lover!
            </p>
          </Col>
        </Row>
        <Row>
          {mockData.map((cardData, index) => (
            <Cards
              key={index}
              id={cardData.id}
              image={cardData.image}
              rating={cardData.rating}
              title={cardData.title}
              paragraph={cardData.paragraph}
              price={cardData.price}
              renderratingIcons={renderRatingIcons}
              handleAddToCart={() => addToCart(cardData)}
            />
          ))}
        </Row>
        <Row className="pt-5">
          <Col sm={6} lg={5}>
            <div className="ads_box ads_img1 mb-5 mb-md-0">
              <h4 className="mb-0">GET YOUR FREE</h4>
              <h5>CHEESE FRIES</h5>
              <Link to={"/"} className="btn btn_red px-4 rounded-0">
                Learn More
              </Link>
            </div>
          </Col>
          <Col sm={6} lg={7}>
            <div className="ads_box ads_img2">
              <h4 className="mb-0">GET YOUR FREE</h4>
              <h5>CHEESE FRIES</h5>
              <Link to={"/"} className="btn btn_red px-4 rounded-0">
                Learn More
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Section3;

/* keep the burger menu image order unchanged */

/* keep the rest of the burger menu images unchanged */

/* keep the last burger menu images unchanged */

/* keep the menu ad images in the same section */
