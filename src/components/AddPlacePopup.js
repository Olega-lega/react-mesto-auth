import React, { useState, useCallback, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup({isOpen, onClose, onAddCard}) {
  
  const [values, setValues] = useState({});
  const resetForm = useCallback((newValues = {}) => {
    setValues(newValues);
  }, [setValues]);

  useEffect( () => {
    resetForm()
  },[isOpen,resetForm])

  function handleSubmit(event) {
    event.preventDefault();
    onAddCard(values);
  };

  function handleChange(e) {
    const {name, value} = e.target;
    setValues({ ...values, [name]: value });
  }
  return (
    <PopupWithForm
      name="add"
      title="Новое место"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      >
     <input
              className="popup__input popup__input-place"
              type="text"
              name="name"
              id="place-input"
              minLength="2"
              maxLength="30"
              placeholder="Название"
              value={values.name || ""}
              onChange={handleChange}
              required
            />
            <span className="place-input-error popup__span-error"></span>
            <input
              className="popup__input popup__input-img"
              type="url"
              name="link"
              id="url-input"
              placeholder="Ссылка на картинку"
              value={values.link || ""}
              onChange={handleChange}
              required
            />
            <span className="url-input-error popup__span-error"></span>
    </PopupWithForm>
  )
}
export default AddPlacePopup;