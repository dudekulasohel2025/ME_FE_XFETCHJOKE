import React, { useState } from "react";
import axios from "axios";

const API_URL = "https://official-joke-api.appspot.com/random_joke";

function App() {
  const [joke, setJoke] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchJoke = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await axios.get(API_URL);
      setJoke(response.data);
    } catch (err) {
      setJoke(null);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="joke-card">
        <h1>Random Joke</h1>

        <p className="subtitle">
          Click the button to fetch a fresh one.
        </p>

        <button
          className="fetch-button"
          onClick={fetchJoke}
          disabled={loading}
        >
          {loading ? "Fetching..." : "Fetch joke"}
        </button>

        {error ? (
          <div className="error-container">
            <p className="error-message">
              Could not fetch a joke. Try again.
            </p>

            <button
              className="retry-button"
              onClick={fetchJoke}
              disabled={loading}
            >
              Try again
            </button>
          </div>
        ) : joke ? (
          <div className="joke">
            <p className="setup">{joke.setup}</p>
            <p className="punchline">{joke.punchline}</p>
          </div>
        ) : (
          <p className="no-joke">No joke yet.</p>
        )}
      </div>
    </div>
  );
}

export default App;