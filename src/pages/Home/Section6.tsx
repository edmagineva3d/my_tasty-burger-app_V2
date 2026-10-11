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
                  "Na para bang, para bang, sabi ko sa sarili ko VEGETARIAN ako pero nung natikman ko 'to, ano nga ulit ako."
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
                  "PINAKA-MASARAP na BURGER na natikman ko sa buong planet EARTH na inutang ko pambili galing kay MARS."
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
                  "Ganito pala ang kamandag ng isang Tasty Burger. Mapapa-SMILE ka sa sarap ng bawat kagat."
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
                  "A delicious meal at a great price! I loved the burger and fries, and the service was also friendly. Kaya Eto napa-nganga nalang ako!"
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