
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
import { Switch, Redirect, Route, useHistory } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.js';
import * as auth from '../utils/auth.js';
import NavMenu from './NavMenu';
import Login from './Login.js';
import Register from './Register.js';
import NotFound from './NotFound.js';
import InfoTooltip from './InfoTooltip.js';


function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddCardPopupOpen, setIsAddCardPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [currentCardDelete, setCurrentCardDelete] = useState({})
  const [authState, setAuthState] = useState({
    loggedIn: false,
    email: null
  });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const history = useHistory();

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

  function handleLogin(email, password) {
    setIsProcessing(true);
    auth.authorize(email, password)
      .then((res) => {
        setAuthState({
          loggedIn: true,
          email: res.email,
        });
        history.push('/');
      })
      .catch((err) => {
        switch (err) {
          case 400:
            console.log('Ошибка 400. Не передано одно из полей.');
            break;
          case 401:
            console.log(`Ошибка 401. Пользователь ${email} не найден.`);
            break;
          default:
            console.log(`Аутентификация не пройдена. Ошибка ${err}`);
        };
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  function handleSignOut() {
    auth.logout()
    .then(() => {
      setAuthState({
        loggedIn: false,
        email: null,
      });
      history.push('/sign-in');
    })
    .catch((err) => {
      console.log(`Завершение сессии не выполнено. Ошибка ${err}`);
    });
  };

  function handleRegister(email, password) {
    setIsProcessing(true);
    auth.register(email, password)
      .then((res) => {
        if (!res.error) {
          setIsInfoTooltipPopupOpen(true);
          setRegistrationSuccess(true);
        } else {
          setIsInfoTooltipPopupOpen(true);
        }
      })
      .catch((err) => {
        switch (err) {
          case 400:
            console.log('Ошибка 400. Некорректно заполнено одно из полей.');
            break;
          default:
            console.log(`Регистрация не выполнена. Ошибка ${err}`);
        };
        setIsInfoTooltipPopupOpen(true);
      })
      .finally(() => {
        setIsProcessing(false);
      });
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
      {authState.loggedIn &&
       <NavMenu
        onSignOut={handleSignOut}
        email={authState.email}
       />
      }
      <Header 
       onSignOut={handleSignOut}
       email={authState.email}
       />
      <Switch>
       <ProtectedRoute
      path="/" exact
      component={Main}
      onEditAvatar = {handleEditAvatarClick}
      onEditProfile = {handleEditProfileClick}
      onAddPlace = {handleAddPlaceClick}
      cards = {cards}
      onClickCard={handleCardClick}
      onLikeCard={handleCardLike}
      onCardDelete={handleCardDelete}
      loggedIn={authState.loggedIn}
      email={authState.email}
      />
       <Route path="/sign-in">
              <Login
                handleLogin={handleLogin}
                email={authState.email}
                onRender={isProcessing}
              />
            </Route>
            <Route path="/sign-up">
              <Register
                handleRegister={handleRegister}
                onRender={isProcessing}
              />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
            <Route path="/">
              {authState.loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
            </Route>
          </Switch>
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
      <InfoTooltip
      isOpen={isInfoTooltipPopupOpen}
      onClose={closeAllPopups}
      onRegister={setRegistrationSuccess}
      registration={registrationSuccess}
      />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
