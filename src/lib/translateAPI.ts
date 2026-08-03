export const translateText = async (text: string, from: string = 'es', to: string = 'en'): Promise<string> => {
  if (!text) return '';
  try {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
    const data = await res.json();
    if (data && data.responseData && data.responseData.translatedText) {
      return data.responseData.translatedText;
    }
    return text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};

export const translateArray = async (texts: string[], from: string = 'es', to: string = 'en'): Promise<string[]> => {
  return Promise.all(texts.map(t => translateText(t, from, to)));
};
