import React from "react"

function ImagePopup({isOpen, card, onClose}) {

  function handleOverlayClose(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return(
    <div className={`popup popup_img ${card && isOpen ? "popup_open" : ''}`} onClick={handleOverlayClose}>
    <div className="popup__container-img">
      <button className="popup__button-close" type="button" onClick={onClose}></button>
      <img className="popup__object-picture" src={card.link} alt={card.name} />
      <h2 className="popup__img-title">{card.name}</h2>
    </div>
  </div>
  )
}
export default ImagePopup