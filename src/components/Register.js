import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

function Register({ handleRegister, onRender }) {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  function handleSubmit(event) {
    event.preventDefault();
    handleRegister(formValues.password, formValues.email);
  }

  const handleInputChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      setFormValues((state) => ({ ...state, [name]: value }));
    },
    [setFormValues]
  );

  useEffect(() => {
    return () => {
      setFormValues({
        email: "",
        password: "",
      });
    };
  }, []);

  return (
    <section className="login">
      <div className="login__container">
        <h2 className="login__title">Регистрация</h2>
        <form name="login" className="login-login" onSubmit={handleSubmit}>
          <fieldset className="login__fieldset">
            <label className="login__field">
              <input
                className="login__input login__input_position_sign"
                type="email"
                id="login-email"
                name="email"
                placeholder="Email"
                required
                minLength="4"
                value={formValues.email}
                onChange={handleInputChange}
              />
              <span className="login__error"></span>
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
                value={formValues.password}
                onChange={handleInputChange}
              />
              <span className="login__error"></span>
            </label>
          </fieldset>
          <button type="submit" className="login__btn login__btn_position_sign">
            {onRender ? "Аутентификация..." : "Зарегистрироваться"}
          </button>
        </form>
        <p className="login__auth-text">
          Уже зарегистрированы?&nbsp;
          <Link to="/sign-in" className="login__auth">
            Войти
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Register;
