
const fetch = require('node-fetch');

const apiKey = process.env.API_KEY;

const codes = {
    getCodes: async function getCodes(req, res) {
        const query = `<REQUEST>
                <LOGIN authenticationkey="${apiKey}" />
                    <QUERY objecttype="ReasonCode" schemaversion="1">
                        <INCLUDE>Code</INCLUDE>
                        <INCLUDE>Level1Description</INCLUDE>
                        <INCLUDE>Level2Description</INCLUDE>
                        <INCLUDE>Level3Description</INCLUDE>
                    </QUERY>
            </REQUEST>`;


        const response = await fetch(
            "https://api.trafikinfo.trafikverket.se/v2/data.json", {
                method: "POST",
                body: query,
                headers: { "Content-Type": "text/xml" }
            });

        const result = await response.json();
        const reasonCodes = result.RESPONSE.RESULT[0].ReasonCode;

        return res.json({ data: reasonCodes });
    }
};

module.exports = codes;
