import { useEffect, useState, useContext } from 'react';
import UserView from '../components/UserView';
import AdminView from '../components/AdminView';
import UserContext from '../UserContext';

function Movies() {
  const { user } = useContext(UserContext);  // Use the context to get user data
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 15;

  useEffect(() => {
    fetchMovies();
  }, [currentPage]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://movieapp-api-lms1.onrender.com/movies/getMovies?page=${currentPage}&limit=${moviesPerPage}`);
      const data = await res.json();
      if (data.movies && data.movies.length > 0) {
        setMovies((prevMovies) => [...prevMovies, ...data.movies]);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMovies = () => {
    setCurrentPage(currentPage + 1);
  };

  console.log(user);  // Check the user object here

  return (
    <div>
      {user && user.isAdmin ? (
        <AdminView movies={movies} />  // Render AdminView if isAdmin is true
      ) : (
        <UserView movies={movies} />  // Render UserView if isAdmin is false
      )}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <button onClick={loadMoreMovies} className="btn btn-primary">
          Load More
        </button>
      )}
    </div>
  );
}

export default Movies;
