import axios from 'axios';
import dotenv from 'dotenv';
import Tesseract from 'tesseract.js';
import leoProfanity from "leo-profanity";
import { badWords } from './BadWordsDB.js';
dotenv.config();

// Your Clarifai API CREDIANTIOLS : 
const PAT = process.env.PAT;
const USER_ID = process.env.USER_ID;
const APP_ID = process.env.APP_ID;
const MODEL_ID = process.env.MODEL_ID;
const MODEL_VERSION_ID = process.env.MODEL_VERSION_ID;

// // Remove Default & Add Custom Bad Words in leoProfanity
leoProfanity.clearList();
leoProfanity.add(badWords);

// Function to analyze the image
export const getNSFW = async (imageUrl) => {
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
        const nsfwScore = concepts.find(concept => concept.name === 'nsfw')?.value;

        return nsfwScore;
    } catch (error) {
        console.log('Error analyzing image:', error.response?.data || error.message);
        return null;
    }
}

export const extractTextFromImage = async (imageUrl) => {
    try {
        const { data: { text } } = await Tesseract.recognize(
            imageUrl,  // Image URL or Path
            'eng+hin+mar',  // English (eng), Hindi (hin), Marathi (mar)
        );
        return text;
    } catch (error) {
        console.log("OCR Error:", error);
        return null;
    }
}

const normalizeText = async (text) => {
    return text.toLowerCase()
        .replace(/0/g, 'o') // Replace zero with 'o'
        .replace(/1/g, 'i') // Replace one with 'i'
        .replace(/3/g, 'e') // Replace three with 'e'
        .replace(/5/g, 's') // Replace five with 's'
        .replace(/\s+/g, ' ') // Remove extra spaces
        .replace(/[०१२३४५६७८९]/g, d => "0123456789"["०१२३४५६७८९".indexOf(d)]) // Convert Hindi digits to English
        .normalize("NFC")
        .trim();
};

export const containsLink = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)|www\.[^\s]+/g;
    return urlRegex.test(text);
};

export const moderateText = async (text) => {

    const cleanedTXT = await normalizeText(text);

    // profanity check
    if (leoProfanity.check(cleanedTXT)) {
        return { isClean: false, msg: "profanity detected" };
    }

    // links check
    if (containsLink(cleanedTXT)) {
        return { isClean: false, msg: "Links are not allowed" };
    }

    return { isClean: true, msg: "text is clean" };
}

export const analyzeImage = async (imageUrl) => {

    // get NSFW score
    const nsfwScore = await getNSFW(imageUrl);

    if (!nsfwScore) {
        return { status: false, message: "Error analyzing image" };
    }

    // Check NSFW score
    if (nsfwScore > 0.5) {
        return { status: false, message: "NSFW content detected" };
    }

    // exptract text from Image and analyze
    const text = await extractTextFromImage(imageUrl);
    if (text) {
        const { isClean, msg } = await moderateText(text);
        if (isClean === false) {
            return { status: false, message: msg };
        }
    }

    return { status: true, message: "Image is clean" };
};
