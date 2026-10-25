
import { useState } from "react";
import trains from "../data/trains";
import "../styles/train-list.css";

const stations = [
  { name: "Thiruvananthapuram Central", code: "TVC" },
  { name: "Kollam Jn", code: "QLN" },
  { name: "Ernakulam Jn", code: "ERS" },
  { name: "Ernakulam Town", code: "ERN" },
  { name: "Alappuzha", code: "ALLP" },
  { name: "Kottayam", code: "KTYM" },
  { name: "Thrissur", code: "TCR" },
  { name: "Kozhikode", code: "CLT" },
  { name: "Kannur", code: "CAN" },
  { name: "Mangaluru Central", code: "MAQ" },
  { name: "Palakkad Jn", code: "PGT" },
  { name: "Shoranur Jn", code: "SRR" },
  { name: "Kayamkulam Jn", code: "KYJ" },
  { name: "Chengannur", code: "CNGR" },
  { name: "Aluva", code: "AWY" },
  { name: "Coimbatore Jn", code: "CBE" },
  { name: "New Delhi", code: "NDLS" },
];

function TrainList() {
const [fromText, setFromText] = useState("Thiruvananthapuram Central (TVC)");
  const [toText, setToText] = useState("Ernakulam Jn (ERS)");
  const [activeInput, setActiveInput] = useState("");
  const [activeTab, setActiveTab] = useState("find");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [message, setMessage] = useState("");

  const findSuggestions = (text) => {
    if (!text.trim()) return [];

    return stations
      .filter(
        (station) =>
          station.name.toLowerCase().includes(text.toLowerCase()) ||
          station.code.toLowerCase().includes(text.toLowerCase())
      )
      .slice(0, 8);
  };

const resolveStation = (text) =>
  stations.find(
    (station) =>
      station.code.toLowerCase() === text.trim().toLowerCase() ||
      station.name.toLowerCase() === text.trim().toLowerCase() ||
      `${station.name} (${station.code})`.toLowerCase() ===
        text.trim().toLowerCase()
  );

const selectedFrom = resolveStation(fromText);
const selectedTo = resolveStation(toText);


  const chooseStation = (station, field) => {
    if (field === "from") {
      setFromText(`${station.name} (${station.code})`);
    } else {
      setToText(`${station.name} (${station.code})`);
    }

    setActiveInput("");
    setMessage("");
  };

  const swapStations = () => {
    setFromText(toText);
    setToText(fromText);
    setSearched(false);
    setMessage("");
  };

  const clearStation = (field) => {
    if (field === "from") {
      setFromText("");
    } else {
      setToText("");
    }

    setSearched(false);
    setMessage("");
    setActiveInput(field);
  };

  const searchTrains = () => {
    setActiveInput("");

    const from = resolveStation(fromText);
    const to = resolveStation(toText);

    if (!from || !to) {
      setMessage("Please select valid stations from the suggestions.");
      setSearched(false);
      return;
    }

    if (from.code === to.code) {
      setMessage("Please choose two different stations.");
      setSearched(false);
      return;
    }

    const matchingTrains = trains;

    setResults(matchingTrains);
    setSearched(true);
    setMessage(
      matchingTrains.length
        ? ""
        : "Live train data is unavailable right now - no sample trains are available for this route."
    );
  };

  const renderStationInput = (field) => {
    const isFrom = field === "from";
    const text = isFrom ? fromText : toText;
    const setText = isFrom ? setFromText : setToText;
    const suggestions = findSuggestions(text);

    return (
      <div className="station-field">
        <label htmlFor={`${field}-station`}>
          {isFrom ? "From" : "To"}
        </label>

        <div className="station-input-wrap">
          <span className="station-pin" aria-hidden="true">
            ♧
          </span>

          <input
            id={`${field}-station`}
            type="text"
            value={text}
            placeholder="Search station"
            autoComplete="off"
            onFocus={() => setActiveInput(field)}
            onChange={(event) => {
              setText(event.target.value);
              setActiveInput(field);
              setSearched(false);
            }}
          />

          {text && (
            <button
              type="button"
              className="clear-btn"
              aria-label={`Clear ${field} station`}
              onClick={() => clearStation(field)}
            >
              ×
            </button>
          )}
        </div>

        {activeInput === field && text.trim() && (
          <div className="station-suggestions">
            {suggestions.length ? (
              suggestions.map((station) => (
                <button
                  type="button"
                  className="suggestion-option"
                  key={station.code}
                  onClick={() => chooseStation(station, field)}
                >
                  <span>{station.name}</span>
                  <strong>{station.code}</strong>
                </button>
              ))
            ) : (
              <div className="no-suggestions">No matching stations</div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="train-list-page"
      onClick={() => setActiveInput("")}
    >
      <nav className="main-navigation">
        <a
          href="#home"
          className="nav-brand"
          onClick={(event) => event.preventDefault()}
        >
          🚆 Where Is My Train
        </a>

        <div className="nav-links">
          <a href="#home" onClick={(event) => event.preventDefault()}>
            🏠 Home
          </a>
          <a
            href="#find-trains"
            className="nav-active"
            onClick={(event) => {
              event.preventDefault();
              setActiveTab("find");
            }}
          >
            🔎 Find Trains
          </a>
          <a href="#live-status" onClick={(event) => event.preventDefault()}>
            📍 Live Status
          </a>
          <a href="#coach" onClick={(event) => event.preventDefault()}>
            🚉 Coach Position
          </a>
          <a href="#pnr" onClick={(event) => event.preventDefault()}>
            🎫 PNR Status
          </a>
          <a href="#help" onClick={(event) => event.preventDefault()}>
            ❓ Help
          </a>
        </div>
      </nav>

      <header className="train-page-header">
        <div className="train-header-inner">
          <h1>🚆 Where Is My Train</h1>
          <div className="header-info">
            <span>🌐 EN</span>
            <span>◷ Train Search</span>
          </div>
        </div>
      </header>

      <main className="train-page-container">
        <div className="search-tabs">
          <button
            type="button"
            className={activeTab === "find" ? "tab-active" : ""}
            onClick={() => setActiveTab("find")}
          >
            🔎 Find Trains
          </button>

          <button
            type="button"
            className={activeTab === "track" ? "tab-active" : ""}
            onClick={() => setActiveTab("track")}
          >
            ➤ Track Train
          </button>
        </div>

        {activeTab === "find" ? (
          <>
            <section
              className="search-panel"
              id="find-trains"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="station-search-row">
                {renderStationInput("from")}

                <button
                  type="button"
                  className="swap-stations-btn"
                  onClick={swapStations}
                  aria-label="Swap stations"
                  title="Swap stations"
                >
                  ⇅
                </button>

                {renderStationInput("to")}

                <button
                  type="button"
                  className="search-trains-btn"
                  onClick={searchTrains}
                >
                  🔎 Search
                </button>
              </div>
            </section>

            <section className="results-section">
              {searched && !message && (
                <p className="sample-notice">
                  Live train data is unavailable right now - showing sample
                  trains.
                </p>
              )}

              {message && (
                <p className="search-message">{message}</p>
              )}

              {searched &&
                results.map((train) => (
                  <article className="train-card" key={train.trainNumber}>
                    <div className="train-card-top">
                      <div className="train-title-group">
                        <span className="train-number-badge">
                          {train.trainNumber}
                        </span>
                        <h3>{train.trainName}</h3>
                      </div>

                      <span className="train-type">{train.trainType}</span>
                    </div>
<p className="train-route-label">
  {resolveStation(fromText)?.name} ({resolveStation(fromText)?.code})
  {" → "}
  {resolveStation(toText)?.name} ({resolveStation(toText)?.code})
</p>
                    <div className="train-route-times">
                      <div className="train-time-block">
                        <strong>{train.departureTime}</strong>
                        <span>{resolveStation(fromText)?.code}</span>
                      </div>

                      <div className="route-duration">
                        <div className="route-track">
                          <span className="route-dot departure-dot" />
                          <span className="route-line" />
                          <span className="route-dot arrival-dot" />
                        </div>
                        <span>◷ {train.travelTime}</span>
                      </div>

                      <div className="train-time-block arrival-block">
                        <strong>{train.arrivalTime}</strong>
                        <span>{resolveStation(toText)?.code}</span>
                      </div>
                    </div>

                    <div className="train-card-footer">
                      <span>Runs: {train.runsOn.join(" · ")}</span>
                      <span className="train-card-links">
                        Live Status · Coach Position
                      </span>
                    </div>
                  </article>
                ))}

              {!searched && (
                <p className="helper-message">
                  Select your departure and arrival stations, then press Search.
                </p>
              )}
            </section>
          </>
        ) : (
          <section className="search-panel track-placeholder">
            <h2>Track Train</h2>
            <p>
              Train tracking will be added later. This demo currently uses
              sample train data and does not connect to live railway services.
            </p>
            <button
              type="button"
              className="search-trains-btn"
              onClick={() => setActiveTab("find")}
            >
              Back to Find Trains
            </button>
          </section>
        )}

        <p className="demo-note">
          Demo version · Sample schedules only, not live railway information.
        </p>
      </main>
    </div>
  );
}

export default TrainList;
