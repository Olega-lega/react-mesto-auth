import React from "react";
import error from "../image/notfound.png";
import { useHistory } from "react-router-dom";

function NotFound() {
  const history = useHistory();

  function handleClick() {
    history.push("/");
  }

  return (
    <section className="notfound">
      <h1 className="notfound__title">404 Punished</h1>
      <img
        src={error}
        alt="404 Page Not Found"
        className="notfound__error"
        onClick={handleClick}
      />
      <p className="notfound__subtitle">Страница не найдена</p>
    </section>
  );
}

export default NotFound;
