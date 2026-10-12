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
import { useEffect, useMemo, useState } from "react";
import {
  Utensils,
  Hamburger,
  FaceSlightlySmiling,
  Heart,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

function Section3() {
  const { addToCart } = useCart();
  useEffect(() => { const sync = () => { try { setFavoriteIds(JSON.parse(localStorage.getItem("tastyBurgerFavorites") || "[]")); } catch { setFavoriteIds([]); } }; window.addEventListener("tasty-favorites-updated", sync); return () => window.removeEventListener("tasty-favorites-updated", sync); }, []);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem("tastyBurgerFavorites") || "[]"); } catch { return []; } });
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
      soldOut: true,
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
      soldOut: true,
    },
    // Add more mock data objects as needed
  ];

  const visibleProducts = useMemo(() => {
    const filtered = mockData.filter((product) => {
      const query = search.trim().toLowerCase();
      const matchesSearch = !query || `${product.title} ${product.paragraph}`.toLowerCase().includes(query);
      const isFries = product.title.toLowerCase().includes("fries");
      const matchesCategory = category === "all" || (category === "fries" ? isFries : category === "burgers" ? !isFries : true);
      return matchesSearch && matchesCategory && (!favoritesOnly || favoriteIds.includes(product.id));
    });
    if (sortBy === "name") filtered.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "popular" || sortBy === "rating") filtered.sort((a, b) => b.rating - a.rating);
    return filtered;
  }, [search, category, sortBy, favoritesOnly, favoriteIds]);

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
      <div className="menu_tools_wrap"><Container>
        <div className="menu_tools">
          <div className="menu_results_count">Showing <strong>{visibleProducts.length}</strong> menu item{visibleProducts.length === 1 ? "" : "s"}</div>
          
<div className="menu_filter_tabs" role="group" aria-label="Menu category">
  {[
    { id: "all", label: "All items", Icon: Utensils },
    { id: "burgers", label: "Burgers", Icon: Hamburger },
    { id: "fries", label: "Fries", Icon: FaceSlightlySmiling },
  ].map(({ id, label, Icon }) => (
    <button
      key={id}
      type="button"
      className={category === id ? "active" : ""}
      onClick={() => setCategory(id)}
    >
      <Icon size={17} strokeWidth={2} />
      <span>{label}</span>
    </button>
  ))}

  <button
    type="button"
    className={favoritesOnly ? "active" : ""}
    onClick={() => {
      setFavoriteIds(() => {
        try {
          return JSON.parse(
            localStorage.getItem("tastyBurgerFavorites") || "[]"
          );
        } catch {
          return [];
        }
      });
      setFavoritesOnly((value) => !value);
    }}
  >
    <Heart size={17} strokeWidth={2} />
    <span>Favorites</span>
  </button>
</div>

 <div className="menu_search_sort">
            <label className="menu_search">
              <Search size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search burgers, fries, or toppings..."
                aria-label="Search menu"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <X size={17} />
                </button>
              )}
            </label>

            <label className="menu_sort">
              <SlidersHorizontal size={18} />
              <span className="visually-hidden">Sort menu</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="featured">Featured picks</option>
                <option value="popular">Most popular</option>
                <option value="rating">Top rated</option>
                <option value="name">Name: A to Z</option>
              </select>
            </label>
          </div>
        </div>
      </Container>
    </div>

    
      <Container>
        <Row>
          {visibleProducts.length ? visibleProducts.map((cardData) => (
            <Cards
              key={cardData.id}
              id={cardData.id}
              image={cardData.image}
              rating={cardData.rating}
              title={cardData.title}
              paragraph={cardData.paragraph}
              price={cardData.price}
              soldOut={cardData.soldOut}
              badgeLabel={({ "0001": "FAN FAVORITE", "0002": "BEST SELLER", "0003": "GREAT VALUE", "0004": "PLANT-BASED PICK", "0005": "GREAT VALUE", "0006": "CRISPY FAVORITE", "0007": "POPULAR PICK", "0008": "FUN FAVORITE" } as Record<string, string>)[cardData.id]}
              renderratingIcons={renderRatingIcons}
              handleAddToCart={(product) => addToCart(product)}
            />
          )) : <Col xs={12}><div className="menu_no_results"><i className="bi bi-search"></i><h4>No tasty matches found</h4><p>Try another search or choose a different menu filter.</p><button type="button" className="btn btn_red" onClick={() => { setSearch(""); setCategory("all"); setFavoritesOnly(false); setSortBy("featured"); }}>Show all items</button></div></Col>}
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
              <h5>CHEESEBURGER</h5>
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
