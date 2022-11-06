import React from 'react';

function PopupWithForm({title, name, children, isOpen, onClose, onSubmit}){

  function handleOverlayClose(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div className={`popup popup_${name} ${isOpen && "popup_open"}`} onClick={handleOverlayClose}>
        <div className="popup__container">
          <button
            className="popup__button-close"
            type="button"
            aria-label="button-close"
            onClick={onClose}
          ></button>
          <form
            className=
            {`popup__form popup__form_${name}`}
            name={`popup-${name}`}
            onSubmit={onSubmit}
          >
            <h2 className="popup__title">{title}</h2>
            {children}
            <button
              className="popup__button-save"
              type="submit"
            >
              Сохранить
            </button>
          </form>
        </div>
      </div>
  )
}
export default PopupWithForm