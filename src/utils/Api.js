export class Api {
  constructor({baseUrl, token}) {
    this._baseUrl = baseUrl;
    this._token = token;
  }

  _responseHandler(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Что-то пошло не так: ${res.status}`);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      method: "GET",
      headers: {
        authorization: this._token,
        "Content-Type": "application/json",
      },
    }).then(this._responseHandler);
  }
  getInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      headers: {
        authorization: this._token,
        "Content-Type": "application/json",
      },
    })
      .then(this._responseHandler)
  }

  addNewCard(name, link) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: {
        authorization: this._token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    }).then(this._responseHandler);
  }

  deleteCard(_id) {
    return fetch(`${this._baseUrl}/cards/${_id}`, {
      method: "DELETE",
      headers: {
        authorization: this._token,
        "Content-Type": "application/json",
      },
    }).then(this._responseHandler);
  }

  setInfo(name, about) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        authorization: this._token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        about: about,
      }),
    }).then(this._responseHandler);
  }

  setAva(data) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        authorization: this._token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatar: data,
      }),
    }).then(this._responseHandler);
  }

  changeLikeCardStatus(cardId, setLike) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: setLike ? 'PUT' : 'DELETE',
      headers: {
        authorization: this._token,
        "Content-Type": "application/json",
      },
    })
      .then(this._responseHandler);
  };

}
const api = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-50',
  token: '7f9ed849-91dd-461f-a1ba-4d8a8f634854'
});

export default api;