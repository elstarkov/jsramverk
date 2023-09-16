const port = 6060;

async function getTickets(){
    const resp = await fetch(`http://localhost:${port}/tickets`);
    const res = await resp.json();
    return res.data;
}

async function getCodes(){
    const resp = await fetch(`http://localhost:${port}/codes`);
    const res = await resp.json();
    return res.data;
}

async function getDelayed(){
    const resp = await fetch(`http://localhost:${port}/delayed`);
    const res = await resp.json();
    return res.data;
}

async function createTicket(newTicketObj){
    const response = await fetch(`http://localhost:${port}/tickets`, {
        body: JSON.stringify(newTicketObj),
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST'
    })

    return response
}

export default {getTickets, getCodes, getDelayed, createTicket};
