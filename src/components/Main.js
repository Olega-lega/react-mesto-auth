import React,{ useContext } from "react";
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import Card from "./Cards";

function Main({onEditAvatar, onEditProfile, onAddPlace, cards, onClickCard, onLikeCard, onCardDelete}) {

  const currentUser = useContext(CurrentUserContext);

  return (
    <main className="content">
    <section className="profile content__profile">
      <div className="profile__avatar">
        <img className="profile__image" src={currentUser.avatar} alt="Автор" />
        <button className="profile__pencel"
        onClick={onEditAvatar}></button>
      </div>
      <div className="profile__form">
        <div className="profile__from-info">
          <h1 className="profile__title">{currentUser.name}</h1>
          <button
            className="profile__button-edit"
            type="button"
            aria-label="button-edit"
            onClick={onEditProfile}
          ></button>
        </div>
        <p className="profile__subtitle">{currentUser.about}</p>
      </div>
      <button
        className="profile__button-add"
        type="button"
        aria-label="button-add"
        onClick={onAddPlace}
      ></button>
    </section>

    <section className="element content__element">
      <ul className="element__cards-list">
      {cards.map((card) => (
          <Card
            card={card}
            cardOpen={onClickCard}
            key={card._id}
            onLikeCard={onLikeCard}
            onCardDelete={onCardDelete}
          />
        ))}
      </ul>
    </section>
  </main>
  )
}
export default Main