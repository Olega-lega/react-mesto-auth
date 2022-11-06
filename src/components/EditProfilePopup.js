import React, {useContext, useEffect, useState, useCallback} from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

function EditProfilePopup({isOpen, onClose, onUpdateUser}) {
  const currentUser = useContext(CurrentUserContext);
  const [values, setValues] = useState({});
  const resetForm = useCallback((newValues = {}) => {
    setValues(newValues);
  }, [setValues]);

  function handleSubmit(event) {
    event.preventDefault();
    onUpdateUser({
      name: values.name,
      about: values.about
    });
  };

  useEffect(() => {
    resetForm()
    if (isOpen) {
   setValues({ name: currentUser.name, about: currentUser.about })
    };
  }, [currentUser, isOpen, resetForm])

  function handleChange(e) {
    const {name, value} = e.target;
    setValues({ ...values, [name]: value });
  }

  return(
    <PopupWithForm
      name="edit"
      title="Редактировать профиль"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      >
          <input
              className="popup__input popup__input-name"
              type="text"
              name="name"
              id="name-input"
              minLength="2"
              maxLength="40"
              placeholder="Имя Фамилия"
              value={values.name || ""}
              onChange={handleChange}
              required
            />
            <span className="name-input-error popup__span-error"></span>
            <input
              className="popup__input popup__input-activity"
              type="text"
              name="about"
              id="job-input"
              minLength="2"
              maxLength="200"
              placeholder="Вид деятельности"
              value={values.about  || ""}
              onChange={handleChange}
              required
            />
            <span className="job-input-error popup__span-error"></span>
      </PopupWithForm>
  )
}
export default EditProfilePopup;