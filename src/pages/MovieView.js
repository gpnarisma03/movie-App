import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import UserContext from '../UserContext';

const MovieView = () => {
  const { user } = useContext(UserContext);  
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchMovie = async () => {
    try {
      const response = await fetch(`https://movieapp-api-lms1.onrender.com/movies/getMovie/${id}`);
      if (!response.ok) throw new Error("Movie not found");
      const data = await response.json();
      setMovie(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovie();
  }, [id]);

const handleCommentSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem('token');

  if (!comment.trim()) return;


  setSubmitting(true);
  try {
    const res = await fetch(`https://movieapp-api-lms1.onrender.com/movies/addComment/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify({
        comment,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to submit comment");
    }

    setComment("");
    await fetchMovie();
  } catch (err) {
    alert(err.message);
  } finally {
    setSubmitting(false);
  }
};



  if (loading) return <p>Loading movie...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!movie) return null;

  return (
    <div style={{ padding: "1rem", maxWidth: "600px", margin: "auto" }}>
      <h2>{movie.title}</h2>
      <p><strong>Director:</strong> {movie.director}</p>
      <p><strong>Year:</strong> {movie.year}</p>
      <p><strong>Genre:</strong> {movie.genre}</p>
      <p><strong>Description:</strong> {movie.description}</p>

      <hr />

      <h3>Comments</h3>
      {movie.comments && movie.comments.length > 0 ? (
        <ul>
            {movie.comments.map((c, idx) => (
            <li key={idx}>
                <strong>{c.userId}</strong>: {c.comment}
            </li>
            ))}

        </ul>
      ) : (
        <p>No comments yet.</p>
      )}

      <form onSubmit={handleCommentSubmit} style={{ marginTop: "1rem" }}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment"
          rows="3"
          style={{ width: "100%", padding: "0.5rem" }}
        />
        <button type="submit" disabled={submitting} style={{ marginTop: "0.5rem" }}>
          {submitting ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </div>
  );
};

export default MovieView;
