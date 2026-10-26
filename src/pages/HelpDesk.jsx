
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/help.css';

const FAQ = [
  [
    'How do I check the live status of my train?',
    'Open Live Status, type the train number or name and pick it from the suggestions. Choose the day the train started from its origin (Today, Yesterday, ...) to see where it is, the delay at each station and the expected platform.'
  ],
  [
    'Why does the app ask when the train started?',
    'Long-distance trains run for more than one day, so two journeys of the same train can be on the track at once. The start date tells the app which journey you are travelling on.'
  ],
  [
    'How do I find trains between two stations?',
    'Use Find Trains, enter your From and To stations, optionally a travel date, and press Search. Each result shows timings, travel time, classes and the days it runs.'
  ],
  [
    'Where will my coach stop on the platform?',
    'Open Coach Position for your train. Coaches are numbered from the engine. From PNR Status you can jump straight to your coach and berth.'
  ],
  [
    'What do CNF, RAC and WL mean?',
    'CNF is a confirmed berth. RAC (Reservation Against Cancellation) lets you board and share a side lower berth. WL is wait-listed; the ticket is confirmed only if others cancel.'
  ]
];

export default function HelpDesk() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView();
  }, [hash]);

  return (
    <main className="help-page">
      <h1>Help Desk</h1>
      <p className="help-intro">Answers to common questions and important railway helplines.</p>

      <section className="help-contacts">
        <a href="tel:139" className="help-contact">
          <strong>139</strong>
          <span>Rail Madad: enquiry, complaints and assistance</span>
        </a>
        <a href="tel:182" className="help-contact">
          <strong>182</strong>
          <span>RPF security helpline</span>
        </a>
        <a href="tel:112" className="help-contact">
          <strong>112</strong>
          <span>National emergency number</span>
        </a>
      </section>

      <section id="faq">
        <h2>Frequently Asked Questions</h2>
        {FAQ.map(([question, answer]) => (
          <details key={question} className="help-faq">
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>

      <section id="about-data" className="help-about">
        <h2>About the data</h2>
        <p>
          This is a demo project. Timetables, running status, platforms, coach
          compositions and PNR results are generated from sample data and do
          not come from Indian Railways or NTES. Always confirm with official
          sources before you travel.
        </p>
        <p>
          <Link to="/live-status">Track a train →</Link>
        </p>
      </section>
    </main>
  );
}
