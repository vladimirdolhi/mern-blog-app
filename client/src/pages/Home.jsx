import { useEffect, useMemo, useState } from "react";
import { BlogController } from "../controllers/blogController";
import BlogList from "../components/BlogList";
import SearchBar from "../components/SearchBar";
import DateFilter from "../components/DateFilter";
import SortSelect from "../components/SortSelect";

const Home = () => {
  const [blogs, setBlogs] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");

  const fetchList = async () => {
    setIsPending(true);
    try {
      const data = await BlogController.list({
        search: q,
        from,
        to,
        sort: sortBy,
      });
      setBlogs(data);
      setError(null);
    } catch (e) {
      setError(e.message || "Failed to load blogs");
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [q, from, to, sortBy]);

  const empty = useMemo(() => blogs && blogs.length === 0, [blogs]);

  return (
    <div className="home">
      {error && <div>{error}</div>}
      {/* Toolbar */}
      <div style={{ marginBottom: 16 }}>
        <SearchBar value={q} onChange={setQ} />
        <DateFilter from={from} to={to} onFrom={setFrom} onTo={setTo} />
        <SortSelect value={sortBy} onChange={setSortBy} />
      </div>
      {isPending && <div>Loading...</div>}
      {blogs && <BlogList blogs={blogs} />}
      {blogs && empty && <p>No blogs match your filters.</p>}
    </div>
  );
};

export default Home;
