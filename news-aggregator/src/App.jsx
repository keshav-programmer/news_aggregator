import { useEffect, useMemo, useState } from "react";
import ThemeToggle from "./components/ThemeToggle";
import BreakingTicker from "./components/BreakingTicker";
import HeroSection from "./components/HeroSection";
import NewsFeed from "./components/NewsFeed";
import Footer from './components/Footer'
import {
  Bookmark,
  Clock3,
  ArrowUpRight,
  TrendingUp,
  Globe2,
  Zap,
} from "lucide-react";
import Navbar from "./components/Navbar";



const categories = [
  "All News",
  "India",
  "World",
  "Technology",
  "Business",
  "Science",
  "Sports",
  "Entertainment",
];


function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("pressly-theme") || "dark",
  );


   const [category, setCategory] = useState("All News");
  const [query, setQuery] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  // New news-related state
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("pressly-theme", theme);
  }, [theme]);

  
useEffect(() => {
  async function fetchNews() {
    setLoading(true);
    setError("");

    try {
      const categoryMap = {
        "All News": "general",
        India: "general",
        World: "general",
        Technology: "technology",
        Business: "business",
        Science: "science",
        Sports: "sports",
        Entertainment: "entertainment",
      };

      const apiCategory = categoryMap[category] || "general";

      const response = await fetch(
        `http://localhost:5000/api/news?category=${apiCategory}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }

      const data = await response.json();

      const formattedArticles = data.articles.map((article) => ({
        ...article,
        category:
          apiCategory === "general"
            ? "World"
            : categoryMap[category] === apiCategory
              ? category
              : "World",
      }));

      setArticles(formattedArticles);
    } catch (err) {
      console.error("News fetching error:", err);
      setError("Unable to load news. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  fetchNews();
}, [category]);


  const visibleArticles = useMemo(() => {
    return articles.filter((article) => {
     const matchesCategory =
  category === "All News" || article.category === category;

      const text =
        `${article.title} ${article.description} ${article.source} ${article.category}`.toLowerCase();

      const matchesSearch = text.includes(query.toLowerCase());
      const matchesBookmarks = !showBookmarks || bookmarks.includes(article.id);

      return matchesCategory && matchesSearch && matchesBookmarks;
    });
  }, [articles, category, query, bookmarks, showBookmarks]);

  function toggleBookmark(id) {
    setBookmarks((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  }

  function chooseCategory(item) {
    setCategory(item);
    setShowBookmarks(false);
    setMobileMenu(false);
  }

  return (
    <div
      className={`app-shell min-h-screen ${
        theme === "light" ? "light-theme" : "dark-theme"
      } bg-[#090b10] text-gray-100`}
    >
      {/* Top announcement bar */}
      <div className="flex items-center justify-center gap-2 border-b border-white/5 bg-orange-500/10 px-4 py-2 text-center text-xs text-orange-300">
        <Zap size={14} />
        <span>YOUR WORLD. YOUR NEWS. ALL IN ONE PLACE.</span>
      </div>

      {/* Navbar */}
      <Navbar
        theme={theme}
        setTheme={setTheme}
        query={query}
        setQuery={setQuery}
        category={category}
        chooseCategory={chooseCategory}
        setCategory={setCategory}
        bookmarks={bookmarks}
        showBookmarks={showBookmarks}
        setShowBookmarks={setShowBookmarks}
        mobileMenu={mobileMenu}
        setMobileMenu={setMobileMenu}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breaking news ticker */}
        <BreakingTicker />

        {/* Hero */}
        {!showBookmarks && category === "All News" && !query && (
          <HeroSection
            articles={articles}
            setCategory={setCategory}
            setShowBookmarks={setShowBookmarks}
          />
        )}

        {/* Feed heading */}
        <NewsFeed
          articles={visibleArticles}
          bookmarks={bookmarks}
          toggleBookmark={toggleBookmark}
          showBookmarks={showBookmarks}
          category={category}
          query={query}
          setQuery={setQuery}
          setCategory={setCategory}
          setShowBookmarks={setShowBookmarks}
        />

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}

export default App;
