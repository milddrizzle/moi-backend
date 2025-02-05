"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getZodiacSign = (day, month) => {
    const zodiacSigns = [
        { sign: "Capricorn", endDate: 19 },
        { sign: "Aquarius", endDate: 48 },
        { sign: "Pisces", endDate: 79 },
        { sign: "Aries", endDate: 109 },
        { sign: "Taurus", endDate: 140 },
        { sign: "Gemini", endDate: 171 },
        { sign: "Cancer", endDate: 203 },
        { sign: "Leo", endDate: 234 },
        { sign: "Virgo", endDate: 266 },
        { sign: "Libra", endDate: 295 },
        { sign: "Scorpio", endDate: 325 },
        { sign: "Sagittarius", endDate: 355 },
    ];
    const dateIndex = (month - 1) * 31 + day; // Approximation to convert to a single index  
    // Determine the sign based on the date index  
    for (let i = 0; i < zodiacSigns.length; i++) {
        if (dateIndex <= zodiacSigns[i].endDate) {
            return zodiacSigns[i].sign;
        }
    }
    // Return Capricorn for dates after Sagittarius  
    return "Capricorn";
};
exports.default = getZodiacSign;
