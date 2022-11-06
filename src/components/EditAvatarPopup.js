import React, {useContext, useEffect, useState, useCallback} from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js'

function EditAvatarPopup({isOpen, onClose, onUpdateAvatar}) {
  const currentUser = useContext(CurrentUserContext);
  const [values, setValues] = useState({});
  const resetForm = useCallback((newValues = {}) => {
    setValues(newValues);
  }, [setValues]);


  function handleSubmit(event) {
    event.preventDefault();
    onUpdateAvatar({
      avatar: values.link,
    });
  };

  useEffect(() => {
    resetForm()
    if (isOpen) {
   setValues({ avatar: currentUser.avatar })
    } 
  }, [currentUser, isOpen, resetForm])

  function handleChange(e) {
    const {name, value} = e.target;
    setValues({ ...values, [name]: value });
  }

  return(
    <PopupWithForm
      name="avatar"
      title="Обновить аватар"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <input
              className="popup__input popup__input-avatar"
              type="url"
              name="link"
              id="popup-avatar"
              placeholder="ссылка на аватар"
              onChange={handleChange}
              required
            />
            <span className="popup-avatar-error popup__span-error"></span>
    </PopupWithForm>
  )
}
export default EditAvatarPopup