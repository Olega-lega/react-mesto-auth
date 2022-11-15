import React from "react";
import logo from "../image/logo.svg";
import { Link, Route, Switch } from "react-router-dom";

function Header({ email, onSignOut }) {
  return (
    <header className="header page__header">
      <img className="header__image" src={logo} alt="логотип Russia Mesto" />
      <Switch>
        <Route path="/sign-in">
          <Link to="/sign-up" className="header__element">
            Регистрация
          </Link>
        </Route>
        <Route path="/sign-up">
          <Link to="/sign-in" className="header__element">
            Войти
          </Link>
        </Route>
        <Route path="/" exact>
          <nav className="header__menu">
            <p className="header__menu-element">{email}</p>
            <button
              onClick={onSignOut}
              className="header__menu-element header__menu-element_btn"
            >
              Выйти
            </button>
          </nav>
        </Route>
      </Switch>
    </header>
  );
}
export default Header;
