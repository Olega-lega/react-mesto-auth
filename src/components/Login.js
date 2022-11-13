import React, { useState, useEffect, useCallback } from 'react';

function Login({ handleLogin, onRender }) {
  const [formValues, setFormValues] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formValues;
  
  function handleSubmit(event) {
    event.preventDefault();
    handleLogin(formValues.email, formValues.password);
  };

  const handleInputChange = useCallback((event) => {
      const {name, value} = event.target;
      setFormValues((state) => ({ ...state, [name]: value }));
  }, [setFormValues]);


  return (
    <section className="login">
      <div className="login__container">
        <h2 className="login__title">Вход</h2>
        <form name="login" className="login__form" onSubmit={handleSubmit}>
          <fieldset className="login__fieldset">
            <label className="login__field">
              <input
                className="login__input login__input_position_sign "
                type="email"
                id="login-email"
                name="email"
                placeholder="Email"
                minLength="4"
                required
                value={email}
                onChange={handleInputChange}
              />
              <span className="login__error"> </span>
            </label>
            <label className="login__field">
              <input
                className="login__input login__input_position_sign"
                type="password"
                id="login-password"
                name="password"
                placeholder="Пароль"
                minLength="4"
                required
                value={password}
                onChange={handleInputChange}
              />
              <span className="login__error"></span>
            </label>
          </fieldset>
          <button
            type="submit"
            className="login__btn login__btn_position_sign"
          >{onRender ? 'Авторизация...' : 'Войти'}</button>
        </form>
        <p className="login__auth-text">&nbsp;</p>
      </div>
    </section>
  )
}

export default Login;