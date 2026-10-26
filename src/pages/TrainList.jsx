
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "../styles/train-list.css";
import StationInput from "../components/StationInput";
import TrainInput from "../components/TrainInput";
import { findStation, getStation, stationLabel } from "../utils/stations";
import {
  WEEKDAYS,
  findTrain,
  findTrainsBetween,
  formatDuration,
  startOfDay
} from "../utils/trains";

function toInputDate(date) {
  const value = new Date(date);
  value.setMinutes(value.getMinutes() - value.getTimezoneOffset());
  return value.toISOString().slice(0, 10);
}

function TrainList() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const fromCode = params.get("from") || "";
  const toCode = params.get("to") || "";
  const date = params.get("date") || "";

  const [fromText, setFromText] = useState(stationLabel(getStation(fromCode)));
  const [toText, setToText] = useState(stationLabel(getStation(toCode)));
  const [dateText, setDateText] = useState(date);
  const [activeTab, setActiveTab] = useState("find");
  const [trainQuery, setTrainQuery] = useState("");
  const [message, setMessage] = useState("");

  const fromStation = getStation(fromCode);
  const toStation = getStation(toCode);
  const searched = Boolean(fromStation && toStation && fromCode !== toCode);
  const travelDate = date ? new Date(`${date}T00:00`) : null;
  const results = searched
    ? findTrainsBetween(fromCode, toCode, travelDate)
    : [];

  const swapStations = () => {
    setFromText(toText);
    setToText(fromText);
    setMessage("");
  };

  const searchTrains = (event) => {
    event.preventDefault();

    const from = findStation(fromText);
    const to = findStation(toText);

    if (!from || !to) {
      setMessage("Please select valid stations from the suggestions.");
      return;
    }

    if (from.code === to.code) {
      setMessage("Please choose two different stations.");
      return;
    }

    setMessage("");
    const next = { from: from.code, to: to.code };
    if (dateText) next.date = dateText;
    setParams(next);
  };

  const trackTrain = (event) => {
    event.preventDefault();
    const train = findTrain(trainQuery);

    if (!train) {
      setMessage("Train not found. Pick a train from the suggestions.");
      return;
    }

    navigate(`/live-status/${train.number}`);
  };

  return (
    <div className="train-list-page">
      <main className="train-page-container">
        <div className="search-tabs">
          <button
            type="button"
            className={activeTab === "find" ? "tab-active" : ""}
            onClick={() => {
              setActiveTab("find");
              setMessage("");
            }}
          >
            🔎 Find Trains
          </button>

          <button
            type="button"
            className={activeTab === "track" ? "tab-active" : ""}
            onClick={() => {
              setActiveTab("track");
              setMessage("");
            }}
          >
            ➤ Track Train
          </button>
        </div>

        {activeTab === "find" ? (
          <form className="search-panel" id="find-trains" onSubmit={searchTrains}>
            <div className="station-search-row">
              <StationInput
                id="from-station"
                label="From"
                value={fromText}
                onChange={setFromText}
              />

              <button
                type="button"
                className="swap-stations-btn"
                onClick={swapStations}
                aria-label="Swap stations"
                title="Swap stations"
              >
                ⇅
              </button>

              <StationInput
                id="to-station"
                label="To"
                value={toText}
                onChange={setToText}
              />

              <div className="station-field date-field">
                <label htmlFor="travel-date">Date</label>
                <div className="station-input-wrap">
                  <input
                    id="travel-date"
                    type="date"
                    value={dateText}
                    min={toInputDate(startOfDay())}
                    onChange={(event) => setDateText(event.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="search-trains-btn">
                🔎 Search
              </button>
            </div>
          </form>
        ) : (
          <form className="search-panel" onSubmit={trackTrain}>
            <div className="station-search-row track-row">
              <TrainInput
                id="track-train"
                label="Train"
                value={trainQuery}
                onChange={setTrainQuery}
              />
              <button type="submit" className="search-trains-btn">
                ➤ Track
              </button>
            </div>
          </form>
        )}

        <section className="results-section">
          {message && <p className="search-message">{message}</p>}

          {activeTab === "find" && searched && (
            <>
              <h2 className="results-heading">
                {results.length} {results.length === 1 ? "train" : "trains"} from{" "}
                {fromStation.name} to {toStation.name}
                {travelDate && (
                  <span>
                    {" "}on{" "}
                    {travelDate.toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short"
                    })}
                  </span>
                )}
              </h2>

              {!results.length && (
                <p className="search-message">
                  No direct trains found for this route
                  {travelDate ? " on the selected date" : ""}. Try nearby
                  stations such as Ernakulam Jn (ERS) / Ernakulam Town (ERN).
                </p>
              )}

              {results.map((result) => {
                const { train, fromStop, toStop } = result;

                return (
                  <article className="train-card" key={train.number}>
                    <div className="train-card-top">
                      <div className="train-title-group">
                        <span className="train-number-badge">{train.number}</span>
                        <h3>{train.name}</h3>
                      </div>

                      <span className="train-type">{train.type}</span>
                    </div>

                    <p className="train-route-label">
                      {fromStop.name} ({fromStop.code}) → {toStop.name} ({toStop.code})
                    </p>

                    <div className="train-route-times">
                      <div className="train-time-block">
                        <strong>{fromStop.departure}</strong>
                        <span>{fromStop.code}</span>
                      </div>

                      <div className="route-duration">
                        <div className="route-track">
                          <span className="route-dot departure-dot" />
                          <span className="route-line" />
                          <span className="route-dot arrival-dot" />
                        </div>
                        <span>
                          ◷ {formatDuration(result.duration)} · {result.distance} km
                        </span>
                      </div>

                      <div className="train-time-block arrival-block">
                        <strong>
                          {toStop.arrival}
                          {result.arrivalDayOffset > 0 && (
                            <sup className="day-offset">+{result.arrivalDayOffset}</sup>
                          )}
                        </strong>
                        <span>{toStop.code}</span>
                      </div>
                    </div>

                    <div className="train-classes">
                      {result.classes.map((item) => (
                        <span key={item} className="class-chip">{item}</span>
                      ))}
                    </div>

                    <div className="train-card-footer">
                      <span className="runs-on">
                        Runs:{" "}
                        {WEEKDAYS.map((day) => (
                          <span
                            key={day}
                            className={result.runsOn.includes(day) ? "day-on" : "day-off"}
                          >
                            {day.charAt(0)}
                          </span>
                        ))}
                      </span>
                      <span className="train-card-links">
                        <Link to={`/live-status/${train.number}`}>Live Status</Link>
                        {" · "}
                        <Link to={`/coach?train=${train.number}`}>Coach Position</Link>
                      </span>
                    </div>
                  </article>
                );
              })}
            </>
          )}

          {activeTab === "find" && !searched && !message && (
            <p className="helper-message">
              Select your departure and arrival stations, then press Search.
            </p>
          )}
        </section>

        <p className="demo-note">
          Demo version · Sample schedules only, not live railway information.
        </p>
      </main>
    </div>
  );
}

export default TrainList;
