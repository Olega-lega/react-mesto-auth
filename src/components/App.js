
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
import api from '../utils/Api';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';


function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddCardPopupOpen, setIsAddCardPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [currentCardDelete, setCurrentCardDelete] = useState({})

  function handleEditAvatarClick(){
    setIsEditAvatarPopupOpen(true)
  }
  function handleEditProfileClick(){
    setIsEditProfilePopupOpen(true)
  }
  function handleAddPlaceClick(){
    setIsAddCardPopupOpen(true)
  }
  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddCardPopupOpen(false);
    setIsImagePopupOpen(false);
  };

  function handleCardClick(selectedCard) {
    setSelectedCard(selectedCard);
    setIsImagePopupOpen(true);
  };

  function handleCardLike(card) {
    const isLiked = card.likes.some((likeCard) => likeCard._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((prevCard) => prevCard._id === card._id ? newCard : prevCard));
      })
      .catch((err) => {
        console.error(`Событие невозможно выполнить. Ошибка ${err}`);
      });
  };

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards(cards => cards.filter((prevCard) => prevCard._id !== card._id));
        setCurrentCardDelete(card);
      })
      .catch((err) => {
        console.log(`Невозможно удалить карточку. Ошибка ${err}`);
      })
  };

  function handleUserUpdate(newUser) {
    api.setInfo(newUser.name, newUser.about)
      .then(res => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Невозможно сохранить новые данные пользователя. Ошибка ${err}`);
      })
  };

  function handleAvatarUpdate(newAvatar) {
    api.setAva(newAvatar.avatar)
      .then(res => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.error(`Невозможно сохранить новый аватар. Ошибка ${err}`);
      })
  };

  function handleAddCardSubmit(newCard) {
    api.addNewCard(newCard.name, newCard.link)
      .then(res => {
        setCards([res, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Невозможно добавить новую карточку. Ошибка ${err}`);
      })
  };

  useEffect(() => {
    api.getInfo()
      .then((res) => {
        setCurrentUser(res)
      })
      .catch((err) => console.log(`Возникла ошибка! ${err}`))
  }, [])

  useEffect(() => {
    api.getInitialCards()
      .then(res => {
        const cardsData = res;
        setCards(cardsData);
      })
      .catch(err => {
        console.log(`Возникла ошибка! ${err}`);
      })
  }, []);

  return (
    <div className="App">
      <CurrentUserContext.Provider value={currentUser}>
      <Header />
      <Main
      onEditAvatar = {handleEditAvatarClick}
      onEditProfile = {handleEditProfileClick}
      onAddPlace = {handleAddPlaceClick}
      cards = {cards}
      onClickCard={handleCardClick}
      onLikeCard={handleCardLike}
      onCardDelete={handleCardDelete}
      />
      <Footer />
      <EditAvatarPopup
      isOpen = {isEditAvatarPopupOpen}
      onClose = {closeAllPopups}
      onUpdateAvatar={handleAvatarUpdate}
      />
      <EditProfilePopup
      isOpen = {isEditProfilePopupOpen}
      onClose = {closeAllPopups}
      onUpdateUser={handleUserUpdate}
      />
      <AddPlacePopup
      isOpen = {isAddCardPopupOpen}
      onClose = {closeAllPopups}
      onAddCard={handleAddCardSubmit}
      />
      <ImagePopup
      card = {selectedCard}
      isOpen = {isImagePopupOpen}
      onClose = {closeAllPopups}
      />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
