import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// Your Clarifai API CREDIANTIOLS : 
const PAT = process.env.PAT;
const USER_ID = process.env.USER_ID;
const APP_ID = process.env.APP_ID;
const MODEL_ID = process.env.MODEL_ID;
const MODEL_VERSION_ID = process.env.MODEL_VERSION_ID;

// Function to analyze the image
export default async function analyzeImage(imageUrl) {
    try {
        const response = await axios.post(
            `https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`,
            {
                user_app_id: {
                    user_id: USER_ID,
                    app_id: APP_ID,
                },
                inputs: [
                    {
                        data: {
                            image: {
                                url: imageUrl,
                            },
                        },
                    },
                ],
            },
            {
                headers: {
                    'Authorization': `Key ${PAT}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        );

        const concepts = response.data.outputs[0].data.concepts;
        console.log(concepts);
        const nsfwScore = concepts.find(concept => concept.name === 'nsfw')?.value;

        return nsfwScore;
    } catch (error) {
        console.error('Error analyzing image:', error.response?.data || error.message);
        throw new Error('Failed to analyze image.');
    }
}