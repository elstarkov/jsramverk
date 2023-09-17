const port = 6060;

const api = {
    getTickets: async function (){
        const resp = await fetch(`http://localhost:${port}/tickets`);
        const res = await resp.json();
        return res.data;
    },
    
    getCodes: async function (){
        const resp = await fetch(`http://localhost:${port}/codes`);
        const res = await resp.json();
        return res.data;
    },
    
    getDelayed: async function (){
        const resp = await fetch(`http://localhost:${port}/delayed`);
        const res = await resp.json();
        return res.data;
    },
    
    createTicket: async function (newTicketObj){
        const response = await fetch(`http://localhost:${port}/tickets`, {
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
