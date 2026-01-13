const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const rawId = "nctE34Mfppk";
const result = getYouTubeId(rawId);

console.log(`Input: "${rawId}"`);
console.log(`Result: ${result}`);

if (result === null) {
    console.log("FAIL: getYouTubeId did not extract ID from raw string.");
} else {
    console.log("SUCCESS: ID extracted.");
}
