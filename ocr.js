import { ImageAnnotatorClient } from '@google-cloud/vision';

import apiKey from "./curious-truth-431503-i9-426084e9936b.json" assert { type: "json" };

const CREDENTIALS = JSON.parse(JSON.stringify(apiKey));

const CONFIG = {
    credentials: {
        private_key: CREDENTIALS.private_key,

        client_email: CREDENTIALS.client_email
    }

};



// Instantiates a client
const visionClient = new ImageAnnotatorClient(CONFIG);

export async function getText(path) {
    let [result] = await visionClient.textDetection(path)
    console.log(result)
    if (result.textAnnotations.length > 0) {
        return result.textAnnotations[0].description;
    }
    else {
        return 'Image not clear enough/ not of right format.';
    }
}

