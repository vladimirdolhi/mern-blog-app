import { useHistory, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { BlogController } from "../controllers/blogController";
import { RatingController } from "../controllers/ratingController";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";

const FIVE_MIN = 5 * 60 * 1000;

const BlogDetails = () => {
  const { id } = useParams();
  const history = useHistory();
  const { user } = useAuth();

  const [blog, setBlog] = useState(null);
  const [myRating, setMyRating] = useState(0);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  const fmt = (iso) =>
    new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso || Date.now()));

  const load = async () => {
    setIsPending(true);
    try {
      const data = await BlogController.get(id);
      setBlog(data);
      setError(null);

      if (user) {
        try {
          const mine = await RatingController.mine(id);
          setMyRating(mine?.value || 0);
        } catch {
          setMyRating(0);
        }
      } else {
        setMyRating(0);
      }
    } catch (err) {
      setError(err.message || "Failed to load blog");
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    load();
  }, [id, user?.id]);

  const handleDelete = async () => {
    if (!blog) return;
    await BlogController.remove(blog._id);
    history.push("/");
  };

  const isOwner = user && blog && user.id === blog.user._id;
  const canDelete = isOwner;
  const canEdit = (() => {
    if (!isOwner || !blog?.createdAt) return false;
    const created = new Date(blog.createdAt).getTime();
    return Date.now() - created <= FIVE_MIN;
  })();

  const average = Number(blog?.ratingAvg || 0);
  const totalRatings = Number(blog?.ratingCount || 0);
  const canRate = Boolean(user) && blog && !isOwner;

  const onRate = async (value) => {
    if (!canRate) return;
    try {
      await RatingController.rate(blog._id, value);
      await load();
    } catch (e) {
      alert(e.message || "Failed to rate");
    }
  };

  const goEdit = () => {
    console.log("edit");
    history.push(`/blogs/${blog._id}/edit`);
  };

  return (
    <div className="blog-details">
      {isPending && <div>Loading...</div>}
      {error && <div>{error}</div>}

      {blog && (
        <article>
          <h2>{blog.title}</h2>
          <div className="blog-body">{blog.body}</div>
          <small>Author: {blog.user.name}</small>
          <p />
          <small>{fmt(blog.createdAt)}</small>

          <div className="rating-panels">
            <section className="rating-card rating-card--summary">
              <div className="rating-card__header">
                <h3 className="rating-card__title">Average rating</h3>
                {!!totalRatings && (
                  <span className="rating-chip">
                    {totalRatings} rating{totalRatings > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <div className="rating-card__content">
                <StarRating value={average} readOnly />
                <small className="rating-note">
                  {totalRatings
                    ? `${average.toFixed(1)} / 5`
                    : "No ratings yet"}
                </small>
              </div>
            </section>

            <section className="rating-card rating-card--action">
              <div className="rating-card__header">
                <h3 className="rating-card__title">Your rating</h3>
              </div>

              <div className="rating-card__content">
                {canRate ? (
                  <>
                    <StarRating value={myRating} onChange={onRate} />
                    <small className="rating-note">
                      {myRating
                        ? `You rated ${myRating}/5`
                        : "Hover & click to rate"}
                    </small>
                  </>
                ) : (
                  <small className="rating-muted">
                    {user
                      ? "You cannot rate your own blog."
                      : "Login to leave a rating."}
                  </small>
                )}
              </div>
            </section>
          </div>

          <div className="owner-actions">
            {canEdit && <button onClick={goEdit}>edit</button>}
            {canDelete && <button onClick={handleDelete}>delete</button>}
          </div>
          {!canEdit && user && isOwner && (
            <small className="edit-window-note">
              Editing allowed only within 5 minutes after creation.
            </small>
          )}
        </article>
      )}
    </div>
  );
};

export default BlogDetails;
