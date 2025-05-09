import React, { useState } from 'react';
import { toast } from 'react-toastify';

function AdminView({ movies, addMovieToList, refetchMovies }) {

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    director: '',
    year: '',
    description: '',
    genre: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const { title, director, year, description, genre } = formData;
    if (!title || !director || !year || !description || !genre) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      const res = await fetch('https://movieapp-api-lms1.onrender.com/movies/addMovie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          year: Number(formData.year)
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Movie added successfully!');
        setShowModal(false);
        setFormData({
          title: '',
          director: '',
          year: '',
          description: '',
          genre: ''
        });
        

        // Prevent duplicate entries
        addMovieToList(prevMovies => {
          const exists = prevMovies.some(m => m._id === data.movie._id);
          return exists ? prevMovies : [...prevMovies, data.movie];
        });

      } else {
        toast.error(data.message || 'Failed to add movie.');
      }
    } catch (err) {
      console.error('Failed to add movie:', err);
      toast.error('An error occurred while adding the movie.');
    }
  };

  return (
    <div>
      <h2>Admin Movie Dashboard</h2>
      <button className="btn btn-success mb-3" onClick={() => setShowModal(true)}>
        Add Movie
      </button>

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Director</th>
            <th>Year</th>
            <th>Genre</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie, index) => (
            <tr key={`${movie._id || movie.id}-${index}`}>
              <td>{index + 1}</td>
              <td>{movie.title}</td>
              <td>{movie.director}</td>
              <td>{movie.year}</td>
              <td>{movie.genre}</td>
              <td>{movie.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Movie</h5>
                <button
                  type="button"
                  className="close"
                  aria-label="Close"
                  onClick={() => setShowModal(false)}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <input name="title" placeholder="Title" className="form-control mb-2" value={formData.title} onChange={handleChange} />
                <input name="director" placeholder="Director" className="form-control mb-2" value={formData.director} onChange={handleChange} />
                <input name="year" placeholder="Year" type="number" className="form-control mb-2" value={formData.year} onChange={handleChange} />
                <input name="genre" placeholder="Genre" className="form-control mb-2" value={formData.genre} onChange={handleChange} />
                <textarea name="description" placeholder="Description" className="form-control" value={formData.description} onChange={handleChange} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminView;
