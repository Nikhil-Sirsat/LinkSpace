import leoProfanity from "leo-profanity";
import { badWords } from "./BadWordsDB.js";

// // Remove Default & Add Custom Bad Words in leoProfanity
leoProfanity.clearList();
leoProfanity.add(badWords);

export const moderateText = async (text) => {
    const cleanedTXT = await normalizeText(text);
    if (leoProfanity.check(cleanedTXT)) {
        return true;  // Reject image
    }
    return false;  // Allow image
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