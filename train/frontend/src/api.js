/* eslint-disable no-undef */
const useLocalBackend = process.env.REACT_APP_ENV;
const remoteApiUrl = process.env.REACT_APP_DEPLOY_URL;

const localApiUrl = `http://localhost:${process.env.PORT || 6060}`;

console.log(`Now using '${useLocalBackend}' env`);

export const apiUrl = useLocalBackend === 'test' ? localApiUrl : remoteApiUrl;

const api = {
    getTickets: async function (token) {
        const resp = await fetch(`${apiUrl}/tickets`, {
            headers: {
                'x-access-token': token
            }
        });
        const res = await resp.json();
        return res.data;
    },

    getCodes: async function (token) {
        const resp = await fetch(`${apiUrl}/codes`, {
            headers: {
                'x-access-token': token
            }
        });

        const res = await resp.json();
        return res.data;
    },

    getDelayed: async function (token) {
        const resp = await fetch(`${apiUrl}/delayed`, {
            headers: {
                'x-access-token': token
            }
        });

        const res = await resp.json();
        return res.data;
    },

    createTicket: async function (newTicketObj) {
        const response = await fetch(`${apiUrl}/tickets`, {
            body: JSON.stringify(newTicketObj),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST'
        });

        return response;
    },

    updateTicket: async function (newTicketObj) {
        const response = await fetch(`${apiUrl}/tickets`, {
            body: JSON.stringify(newTicketObj),
            headers: {
                'content-type': 'application/json'
            },
            method: 'PUT'
        });

        return response;
    },

    register: async function (newUser) {
        const response = await fetch(`${apiUrl}/register`, {
            body: JSON.stringify(newUser),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST'
        });

        return response;
    },

    login: async function (user) {
        const response = await fetch(`${apiUrl}/login`, {
            body: JSON.stringify(user),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST'
        });

        return response;
    }
};

export default api;
