import React, { useState, useCallback, useEffect } from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import EditAvatarPopup from "./EditAvatarPopup";
import EditProfilePopup from "./EditProfilePopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import api from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import { Switch, Redirect, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.js";
import * as auth from "../utils/auth.js";
import NavMenu from "./NavMenu";
import Login from "./Login.js";
import Register from "./Register.js";
import NotFound from "./NotFound.js";
import InfoTooltip from "./InfoTooltip.js";

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddCardPopupOpen, setIsAddCardPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [currentCardDelete, setCurrentCardDelete] = useState({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [authState, setAuthState] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddCardPopupOpen(true);
  }
  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddCardPopupOpen(false);
    setIsImagePopupOpen(false);
    setIsInfoTooltipPopupOpen(false);
  }

  function handleCardClick(selectedCard) {
    setSelectedCard(selectedCard);
    setIsImagePopupOpen(true);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(
      (likeCard) => likeCard._id === currentUser._id
    );
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((prevCard) =>
            prevCard._id === card._id ? newCard : prevCard
          )
        );
      })
      .catch((err) => {
        console.error(`Событие невозможно выполнить. Ошибка ${err}`);
      });
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((cards) =>
          cards.filter((prevCard) => prevCard._id !== card._id)
        );
        setCurrentCardDelete(card);
      })
      .catch((err) => {
        console.log(`Невозможно удалить карточку. Ошибка ${err}`);
      });
  }

  function handleUserUpdate(newUser) {
    setIsProcessing(true);
    api
      .setInfo(newUser.name, newUser.about)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(
          `Невозможно сохранить новые данные пользователя. Ошибка ${err}`
        );
      })
      .finally(() => {
        setIsProcessing(false);
      });
  }

  function handleAvatarUpdate(newAvatar) {
    setIsProcessing(true);
    api
      .setAva(newAvatar.avatar)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.error(`Невозможно сохранить новый аватар. Ошибка ${err}`);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  }

  function handleAddCardSubmit(newCard) {
    setIsProcessing(true);
    api
      .addNewCard(newCard.name, newCard.link)
      .then((res) => {
        setCards([res, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Невозможно добавить новую карточку. Ошибка ${err}`);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  }

  const cbTokenCheck = useCallback(async () => {
    try {
      setIsProcessing(true);
      const jwt = localStorage.getItem("jwt");
      if (!jwt) {
        throw new Error("No token in storage");
      }
      const user = await auth.checkToken(jwt);

      if (!user) {
        throw new Error("Invalid user");
      }
      setLoggedIn(true);
      setAuthState(user.data);
    } catch {
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleLogin = useCallback(async (password, email) => {
    try {
      const data = await auth.authenticate(password, email);
      if (data.token) {
        setLoggedIn(true);
        localStorage.setItem("jwt", data.token);
        cbTokenCheck();
      }
    } catch (err) {
      switch (err) {
        case 400:
          console.log("Ошибка 400. Не передано одно из полей.");
          break;
        case 401:
          console.log(`Ошибка 401. Пользователь ${email} не найден.`);
          break;
        default:
          console.log(`Аутентификация не пройдена. Ошибка ${err}`);
      }
    }
  }, []);

  const handleRegister = useCallback(async (password, email) => {
    try {
      const data = await auth.register(password, email);
      if (data) {
        setRegistrationSuccess(true);
        setIsInfoTooltipPopupOpen(true);
      }
    } catch (err) {
      switch (err) {
        case 400:
          console.log("Ошибка 400. Некорректно заполнено одно из полей.");
          break;
        default:
          console.log(`Регистрация не выполнена. Ошибка ${err}`);
      }
      setIsInfoTooltipPopupOpen(true);
    }
  }, []);

  const handleSignOut = useCallback(() => {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    setAuthState({});
  }, []);

  useEffect(() => {
    cbTokenCheck();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      api
        .getInfo()
        .then((res) => {
          setCurrentUser(res);
        })
        .catch((err) => console.log(`Возникла ошибка! ${err}`));

      api
        .getInitialCards()
        .then((res) => {
          const cardsData = res;
          setCards(cardsData);
        })
        .catch((err) => {
          console.log(`Возникла ошибка! ${err}`);
        });
    }
  }, [loggedIn]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">
        {authState.loggedIn && (
          <NavMenu onSignOut={handleSignOut} email={authState.email} />
        )}
        <Header onSignOut={handleSignOut} email={authState.email} />
        <Switch>
          <ProtectedRoute
            path="/"
            exact
            component={Main}
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            cards={cards}
            onClickCard={handleCardClick}
            onLikeCard={handleCardLike}
            onCardDelete={handleCardDelete}
            loggedIn={loggedIn}
            email={authState.email}
          />
          <Route path="/sign-in">
            <Login
              handleLogin={handleLogin}
              email={authState.email}
              onRender={isProcessing}
              loggedIn={loggedIn}
              registrationSuccess={registrationSuccess}
            />
          </Route>
          <Route path="/sign-up">
            <Register handleRegister={handleRegister} onRender={isProcessing} />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
          <Route path="/">
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          </Route>
        </Switch>
        <Footer />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleAvatarUpdate}
          isLoading={isProcessing}
        />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUserUpdate}
          isLoading={isProcessing}
        />
        <AddPlacePopup
          isOpen={isAddCardPopupOpen}
          onClose={closeAllPopups}
          onAddCard={handleAddCardSubmit}
          isLoading={isProcessing}
        />
        <ImagePopup
          card={selectedCard}
          isOpen={isImagePopupOpen}
          onClose={closeAllPopups}
        />
        <InfoTooltip
          isOpen={isInfoTooltipPopupOpen}
          onClose={closeAllPopups}
          onRegister={setRegistrationSuccess}
          registration={registrationSuccess}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
