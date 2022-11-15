import React from "react";
const year = new Date().getFullYear();

function Footer() {
  return (
    <footer className="footer page__footer">
      <p className="footer__text">&#169; {year} Mesto Russia</p>
    </footer>
  );
}
export default Footer;
