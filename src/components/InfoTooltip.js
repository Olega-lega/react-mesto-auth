import React from "react";
import { useHistory } from "react-router-dom";
import regSuccess from "../image/Union.png";
import regError from "../image/notfound.png";

function InfoTooltip({ isOpen, onClose, onRegister, registration }) {
  const history = useHistory();

  function handleOverlayClose(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <section
      className={`popup popup__type_small ${isOpen && "popup_open"}`}
      onClick={(e) => {
        handleOverlayClose(e);
        registration && history.push("/sign-in");
        onRegister(false);
      }}
    >
      <div className="popup__container popup__container_small">
        <button
          onClick={() => {
            onClose();
            registration && history.push("/sign-in");
            onRegister(false);
          }}
          type="button"
          className="popup__button-close"
        />
        <img
          className="popup__subinfo"
          src={registration ? regSuccess : regError}
          alt="Статус регистрации"
        />
        <h2 className="popup__description ">
          {registration
            ? "Вы успешно зарегистрировались!"
            : "Что-то пошло не так. Попробуйте ещё раз."}
        </h2>
      </div>
    </section>
  );
}

export default InfoTooltip;
