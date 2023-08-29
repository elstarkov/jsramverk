const fetch = require('node-fetch')
const database = require('../db/database.js');

const apiKey= "7c99bdeb761844b08e940832abebd446";

const codes = {
    getCodes: async function getCodes(req, res){
        const query = `<REQUEST>
                  <LOGIN authenticationkey="${apiKey}" />
                  <QUERY objecttype="ReasonCode" schemaversion="1">
                        <INCLUDE>Code</INCLUDE>
                        <INCLUDE>Level1Description</INCLUDE>
                        <INCLUDE>Level2Description</INCLUDE>
                        <INCLUDE>Level3Description</INCLUDE>
                  </QUERY>
            </REQUEST>`;


            const response = fetch(
                "https://api.trafikinfo.trafikverket.se/v2/data.json", {
                    method: "POST",
                    body: query,
                    headers: { "Content-Type": "text/xml" }
                }
            ).then(function(response) {
                return response.json()
            }).then(function(result) {
                return res.json({
                    data: result.RESPONSE.RESULT[0].ReasonCode
                });
            })
    }
};

module.exports = codes;
