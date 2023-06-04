import { Link } from "react-router-dom";

const Public = () => {
  return (
    <section className="public">
      <header>
        <h1>
          Welcome to <span className="nowrap">Don Whale Repairs!</span>
        </h1>
      </header>
      <main className="public__main">
        <p>
          Located in Lagos City, Don Whale Repairs provides a trained staff
          ready to meet your tech repair needs.
        </p>
        <address className="public__addr">
          Don Whale Repairs
          <br />
          No 2, computer village,
          <br />
          Lagos City, Nigeria
          <br />
          <a href="tel:+8145647383">(814) 555-4444</a>
        </address>
        <br />
        <p>Owner: Wale Ajogbade</p>
      </main>
      <footer>
        <Link to="/login">Employee Login</Link>
      </footer>
    </section>
  );
};
export default Public;
