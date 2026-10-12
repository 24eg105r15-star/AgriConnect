import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Sprout,
  TrendingUp,
  Truck,
  ShieldCheck,
  Search,
  MapPin,
  ShoppingBasket,
  Leaf,
  Menu,
  X,
  Users,
  ChevronRight,
} from "lucide-react";

import heroImage from "./assets/hero.png";
import "./App.css";

const sampleCrops = [
  {
    name: "Tomatoes",
    category: "Vegetables",
    price: "₹1,800",
    unit: "/ quintal",
    location: "Hyderabad, Telangana",
    quantity: "25 quintals",
    icon: "🍅",
  },
  {
    name: "Rice",
    category: "Grains",
    price: "₹2,400",
    unit: "/ quintal",
    location: "Warangal, Telangana",
    quantity: "100 quintals",
    icon: "🌾",
  },
  {
    name: "Turmeric",
    category: "Spices",
    price: "₹8,500",
    unit: "/ quintal",
    location: "Nizamabad, Telangana",
    quantity: "15 quintals",
    icon: "🌿",
  },
];

const benefits = [
  {
    icon: TrendingUp,
    title: "Fair market prices",
    description:
      "Explore crop prices and compare market opportunities before making a deal.",
  },
  {
    icon: Users,
    title: "Direct connections",
    description:
      "Bring farmers and buyers together with fewer unnecessary intermediaries.",
  },
  {
    icon: Truck,
    title: "Smarter logistics",
    description:
      "Estimate transportation costs and plan crop deliveries more effectively.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent deals",
    description:
      "Keep track of orders, price negotiations, transactions, and user ratings.",
  },
];

function Home() {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredCrops = sampleCrops.filter((crop) => {
    const matchesSearch =
      crop.name.toLowerCase().includes(searchText.toLowerCase()) ||
      crop.location.toLowerCase().includes(searchText.toLowerCase());

    const matchesCategory =
      activeCategory === "All" || crop.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const scrollTo = (sectionId) => {
    setMobileMenuOpen(false);

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const goToSignup = () => {
    setMobileMenuOpen(false);
    navigate("/signup");
  };

  const goToLogin = () => {
    setMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <div className="agri-app">
      {/* Navigation */}
      <header className="site-header">
        <a
          className="brand"
          href="#home"
          aria-label="AgriConnect home"
          onClick={() => setMobileMenuOpen(false)}
        >
          <span className="brand-icon">
            <Sprout size={25} />
          </span>

          <span>
            Agri<span>Connect</span>
          </span>
        </a>

        <nav
          className={`nav-links ${mobileMenuOpen ? "nav-open" : ""}`}
        >
          <a
            href="#home"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </a>

          <a
            href="#marketplace"
            onClick={() => setMobileMenuOpen(false)}
          >
            Marketplace
          </a>

          <a
            href="#benefits"
            onClick={() => setMobileMenuOpen(false)}
          >
            Why AgriConnect
          </a>

          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
          >
            How it works
          </a>

          <button
            className="mobile-auth-link"
            onClick={goToSignup}
          >
            Get started
          </button>
        </nav>

        <div className="header-actions">
          <button
            className="button button-outline header-login"
            onClick={goToLogin}
          >
            Log in
          </button>

          <button
            className="button button-primary header-signup"
            onClick={goToSignup}
          >
            Join AgriConnect <ArrowRight size={16} />
          </button>
        </div>

        <button
          className="mobile-menu-button"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main>
        {/* Hero section */}
        <section className="hero-section" id="home">
          <div className="hero-content">
            <div className="eyebrow">
              <Leaf size={15} />
              A BETTER WAY TO TRADE AGRICULTURE
            </div>

            <h1>
              From the farm
              <br />
              to the <span>future.</span>
            </h1>

            <p className="hero-description">
              A smarter agricultural marketplace connecting farmers
              directly with buyers. Discover crops, explore market prices,
              and make better-informed trading decisions.
            </p>

            <div className="hero-buttons">
              <button
                className="button button-primary button-large"
                onClick={() => navigate("/marketplace")}
              >
                Explore marketplace <ArrowRight size={18} />
              </button>

              <button
                className="button button-outline button-large"
                onClick={() => scrollTo("how-it-works")}
              >
                How it works
              </button>
            </div>

            <div className="hero-trust">
              <div className="trust-icon">
                <ShieldCheck size={19} />
              </div>

              <div>
                <strong>Built for agricultural trade</strong>
                <p>Designed around farmers and buyers</p>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-frame">
              <img
                src={heroImage}
                alt="Agricultural landscape"
                className="hero-image"
              />

              <div className="image-overlay">
                <div className="overlay-icon">
                  <Sprout size={22} />
                </div>

                <div>
                  <strong>Growing together</strong>
                  <p>Better connections. Better opportunities.</p>
                </div>
              </div>
            </div>

            <div className="floating-card floating-price">
              <div className="floating-card-icon">
                <TrendingUp size={20} />
              </div>

              <div>
                <span>Market insights</span>
                <strong>Compare crop prices</strong>
              </div>
            </div>

            <div className="floating-card floating-farmers">
              <div className="farmers-icon">
                <Users size={20} />
              </div>

              <div>
                <strong>Farmers + Buyers</strong>
                <span>One connected marketplace</span>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="value-strip" id="benefits">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <article className="value-item" key={benefit.title}>
                <span className="value-icon">
                  <Icon size={23} />
                </span>

                <div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              </article>
            );
          })}
        </section>

        {/* Marketplace preview */}
        <section className="marketplace-section" id="marketplace">
          <div className="section-heading">
            <div>
              <span className="section-kicker">
                THE MARKETPLACE
              </span>

              <h2>Discover what's growing</h2>

              <p>
                Preview agricultural produce and explore the marketplace.
                The cards below contain sample data.
              </p>
            </div>

            <span className="demo-label">DEMO DATA</span>
          </div>

          <div className="market-tools">
            <div className="search-box">
              <Search size={19} />

              <input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search crops or locations..."
                aria-label="Search crops or locations"
              />
            </div>

            <div className="category-filters">
              {["All", "Vegetables", "Grains", "Spices"].map(
                (category) => (
                  <button
                    key={category}
                    className={
                      activeCategory === category ? "filter-active" : ""
                    }
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="crop-grid">
            {filteredCrops.length > 0 ? (
              filteredCrops.map((crop) => (
                <article className="crop-card" key={crop.name}>
                  <div
                    className={`crop-art crop-${crop.name.toLowerCase()}`}
                  >
                    <span className="crop-emoji">{crop.icon}</span>
                    <span className="crop-category">{crop.category}</span>
                  </div>

                  <div className="crop-details">
                    <div className="crop-title-row">
                      <h3>{crop.name}</h3>
                      <span className="crop-quantity">
                        {crop.quantity}
                      </span>
                    </div>

                    <div className="crop-location">
                      <MapPin size={15} />
                      {crop.location}
                    </div>

                    <div className="crop-card-bottom">
                      <div>
                        <span className="price-caption">
                          Example price
                        </span>

                        <strong className="crop-price">
                          {crop.price}
                        </strong>

                        <span className="price-unit">{crop.unit}</span>
                      </div>

                      
<button
  className="crop-arrow"
  aria-label={`Order ${crop.name}`}
  onClick={() => navigate("/marketplace")}
  title={`Find ${crop.name} listings to order`}
>
  <ShoppingBasket size={20} />
</button>

                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state">
                <ShoppingBasket size={32} />

                <h3>No matching crops</h3>
                <p>Try another crop name, location, or category.</p>

                <button
                  className="button button-outline"
                  onClick={() => {
                    setSearchText("");
                    setActiveCategory("All");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          <div className="marketplace-footer">
            <span>
              Example listings are shown for UI development.
            </span>

            <button
              className="text-link"
              onClick={() => navigate("/marketplace")}
            >
              View marketplace <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* How it works */}
        <section className="how-section" id="how-it-works">
          <div className="how-intro">
            <span className="section-kicker">
              SIMPLE. CONNECTED. PRACTICAL.
            </span>

            <h2>Good agriculture starts with good connections.</h2>

            <p>
              AgriConnect is designed to make crop discovery and
              agricultural trade easier for both sides of the marketplace.
            </p>
          </div>

          <div className="steps-grid">
            <article className="step-card">
              <span className="step-number">01</span>
              <Sprout size={28} />
              <h3>Create your profile</h3>

              <p>
                Choose whether you're a farmer or buyer and set up
                your information.
              </p>
            </article>

            <article className="step-card">
              <span className="step-number">02</span>
              <Search size={28} />
              <h3>Explore opportunities</h3>

              <p>
                Discover crop listings, compare prices, and find
                relevant trading partners.
              </p>
            </article>

            <article className="step-card">
              <span className="step-number">03</span>
              <ShoppingBasket size={28} />
              <h3>Make your deal</h3>

              <p>
                Place orders, discuss prices, and keep track of
                your transactions.
              </p>
            </article>
          </div>
        </section>

        {/* Call to action */}
        <section className="cta-section" id="get-started">
          <div className="cta-icon">
            <Sprout size={29} />
          </div>

          <span className="section-kicker">
            YOUR NEXT STEP STARTS HERE
          </span>

          <h2>Let's grow something better together.</h2>

          <p>
            Join the agricultural marketplace designed to bring
            farmers and buyers closer.
          </p>

          <div className="cta-buttons">
            <button
              className="button button-light button-large"
              onClick={goToSignup}
            >
              Create an account <ArrowRight size={18} />
            </button>

            <button
              className="button button-cta-outline button-large"
              onClick={goToLogin}
            >
              Log in
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <a className="brand footer-brand" href="#home">
          <span className="brand-icon">
            <Sprout size={23} />
          </span>

          <span>
            Agri<span>Connect</span>
          </span>
        </a>

        <p>Connecting farms, markets, and opportunities.</p>

        <span className="footer-copy">
          © {new Date().getFullYear()} AgriConnect
        </span>
      </footer>
    </div>
  );
}

export default Home;