export default (text: string, maxLen = 2000) => (text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text);
