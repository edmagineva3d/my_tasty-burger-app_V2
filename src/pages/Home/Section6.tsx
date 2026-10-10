import { Container, Row, Carousel } from "react-bootstrap";

import User1 from "../../assets/blog/review-author-1.jpg";
import User2 from "../../assets/blog/review-author-2.jpg";
import User3 from "../../assets/blog/review-author-3.jpg";
import User4 from "../../assets/blog/review-author-5.jpg";

function Section6() {
  return (
    <section className="blog_section" id="blog">
      <Container>
        <Row>
          <Carousel>
            <Carousel.Item>
              <Carousel.Caption>
                <div className="user_img">
                  <img src={User1} alt="customer" className="img-fluid" />
                </div>
                <p>
                  "The burger was really delicious and the fries were crispy.
                  Everything tasted fresh and satisfying. I will definitely
                  order again!"
                </p>
                <div className="item_rating mb-2">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <h5>BY AMELIE NEWLOVE</h5>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
              <Carousel.Caption>
                <div className="user_img">
                  <img src={User2} alt="customer" className="img-fluid" />
                </div>
                <p>
                  "I really enjoyed my meal at Tasty Burger. The burger was
                  juicy, the cheese was tasty, and the fries were perfectly
                  crispy."
                </p>
                <div className="item_rating mb-2">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <h5>BY SOPHIA MARTIN</h5>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
              <Carousel.Caption>
                <div className="user_img">
                  <img src={User3} alt="customer" className="img-fluid" />
                </div>
                <p>
                  "Tasty Burger has great food and generous servings. The
                  combination of a tasty burger and crispy fries was perfect!"
                </p>
                <div className="item_rating mb-2">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <h5>BY DANIEL REYES</h5>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
              <Carousel.Caption>
                <div className="user_img">
                  <img src={User4} alt="customer" className="img-fluid" />
                </div>
                <p>
                  "A delicious meal at a great price! I loved the burger and
                  fries, and the service was also friendly. Highly recommended!"
                </p>
                <div className="item_rating mb-2">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <h5>BY EMILY SANTOS</h5>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Row>
      </Container>
    </section>
  );
}

export default Section6;
/* keep the blog review images unchanged */
