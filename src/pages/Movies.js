import { useEffect, useState, useContext } from 'react';
import UserView from '../components/UserView';
import AdminView from '../components/AdminView';
import UserContext from '../UserContext';

function Movies() {
  const { user } = useContext(UserContext);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 15;

  useEffect(() => {
    fetchMovies();
  }, [currentPage]);

const fetchMovies = async (reset = false) => {
  setLoading(true);
  try {
    const res = await fetch(`https://movieapp-api-lms1.onrender.com/movies/getMovies?page=1&limit=${moviesPerPage}`);
    const data = await res.json();
    if (data.movies) {
      if (reset) {
        setMovies(data.movies);
        setCurrentPage(1);
      } else {
        setMovies((prevMovies) => [...prevMovies, ...data.movies]);
      }
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
  } finally {
    setLoading(false);
  }
};


  const loadMoreMovies = () => {
    setCurrentPage((prev) => prev + 1);
  };

  // Add new movie to state immediately
  const addMovieToList = (newMovie) => {
    setMovies((prevMovies) => [newMovie, ...prevMovies]);
  };

  return (
    <div>
      {user && user.isAdmin ? (
<AdminView movies={movies} addMovieToList={addMovieToList} refetchMovies={() => fetchMovies(true)} />

      ) : (
        <UserView
          movies={movies}
          loadMoreMovies={loadMoreMovies}
          loading={loading}
        />
      )}
    </div>
  );
}

export default Movies;
