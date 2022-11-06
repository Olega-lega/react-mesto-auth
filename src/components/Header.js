import React from 'react';
import logo from '../image/logo.svg';

function Header() {
  return(
    <header className="header page__header">
    <img
      className="header__image"
      src={logo}
      alt="логотип Russia Mesto"
    />
  </header>
  );
};
export default Header;