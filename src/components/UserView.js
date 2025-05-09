import React from 'react';
import { Card, Col, Row, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function UserView({ movies, loadMoreMovies, loading }) {
  return (
    <>
      <Row>
        <h2 className='p-5 text-center'>List of Movies</h2>
        {movies.map((movie) => (
          <Col key={movie.id || movie._id} sm={12} md={6} lg={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{movie.title}</Card.Title>
                <Card.Text><strong>Director:</strong> {movie.director}</Card.Text>
                <Card.Text><strong>Year:</strong> {movie.year}</Card.Text>
                <Card.Text><strong>Description:</strong> {movie.description}</Card.Text>
                <Card.Text><strong>Genre:</strong> {movie.genre}</Card.Text>
                <div>
                  <strong>Comments:</strong>
                  <ul>
                    {movie.comments && movie.comments.map((comment) => (
                      <li key={comment._id}>
                        <strong>User {comment.userId}:</strong> {comment.comment}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link to={`/movies/${movie._id}`}>
                  <Button variant="primary">View Movie</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="text-center my-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Button onClick={loadMoreMovies} variant="primary">
            Load More
          </Button>
        )}
      </div>
    </>
  );
}

export default UserView;
