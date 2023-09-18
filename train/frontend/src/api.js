
const useLocalBackend = process.env.REACT_APP_ENV;
const remoteApiUrl = process.env.REACT_APP_DEPLOY_URL;

const localApiUrl = `http://localhost:${process.env.PORT || 6060}`;

console.log(`Now using '${useLocalBackend}' env`);

export const apiUrl = useLocalBackend === "test" ? localApiUrl : remoteApiUrl;

const api = {
    getTickets: async function (){
        const resp = await fetch(`${apiUrl}/tickets`);
        const res = await resp.json();
        return res.data;
    },
    
    getCodes: async function (){
        const resp = await fetch(`${apiUrl}/codes`);
        const res = await resp.json();
        return res.data;
    },
    
    getDelayed: async function (){
        const resp = await fetch(`${apiUrl}/delayed`);
        const res = await resp.json();
        return res.data;
    },
    
    createTicket: async function (newTicketObj){
        const response = await fetch(`${apiUrl}/tickets`, {
            body: JSON.stringify(newTicketObj),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST'
        })
    
        return response
    },
};

export default api;
