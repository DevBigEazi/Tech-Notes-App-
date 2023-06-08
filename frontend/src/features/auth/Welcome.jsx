import { Link } from "react-router-dom";

const Welcome = () => {
  const date = new Date();
  const today = new Intl.DateTimeFormat("en-NG", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);

  const content = (
    <section className="welcome">
      <p>{today}</p>

      <h1>Welcome!</h1>

      <p>
        <Link to="/dash/notes">View techNotes</Link>
      </p>

      <p>
        <Link to="/dash/notes/newNote">Add New techNote</Link>
      </p>

      <p>
        <Link to="/dash/users">View User Settings</Link>
      </p>

      <p>
        <Link to="/dash/users/newUser">Add New User</Link>
      </p>
    </section>
  );

  return content;
};

export default Welcome;
