import React, { useContext }  from "react";
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

function Card ({card, cardOpen, onLikeCard, onCardDelete}) {

  const currentUser = useContext(CurrentUserContext);
  const isOwn = card.owner._id === currentUser._id;
  const cardDeleteButtonClassName = (
    `element__button-delete ${isOwn ? 'element__button-delete' : 'element__button-delete_hide'}`
  );
  const isLiked = card.likes.some(i => i._id === currentUser._id);
  const cardLikeButtonClassName =  `element__button ${isLiked && `element__button_active`}`;

  function handleCardClick() {
    cardOpen(card);
  };

  function handleLikeClick() {
    onLikeCard(card);
  };

  function handleDeleteClick() {
    onCardDelete(card);
  };

  return(
        <li className="element__cards-item">
          <button
            className={cardDeleteButtonClassName} onClick={handleDeleteClick}
            type="button"
            aria-label="button-delete"
          ></button>
          <img className="element__cards-img" src={card.link} alt={card.name} onClick={handleCardClick}/>
          <div className="element__cards-group">
            <h2 className="element__cards-title">{card.name}</h2>
            <div className="element__button_block">
              <button
                className={cardLikeButtonClassName} onClick={handleLikeClick}
                type="button"
                aria-label="button-like"
              ></button>
              <span className="element__button_count">{card.likes.length}</span>
            </div>
          </div>
        </li>
  )
}

export default Card