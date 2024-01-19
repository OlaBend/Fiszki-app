import React, {useState} from "react";
import axios from "axios";


const TranslationComp = ({onTranslation}) => {
    const [word, setWord] = useState('');
    const [translatedWord, setTranslatedWord] = useState('');
    const [loading, setLoading] = useState(false);

    const translateWord = async () => {
        try {
            setLoading(true);
            const response = await axios.post(
                'http://localhost:3001/translate',
                 {
                    text: word, targetLanguage: 'en'
                 }
            );
            const translation = response.data.translation;
            setTranslatedWord(translation);

            onTranslation({term: word, definition: translation});
            await axios.post('http://localhost:3001/api/addFlashcard', {
                term: word,
                definition: translation,
            });
        } catch (error) {
            console.error('Error translating word:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <input type="text" value={word} onChange={(e) => setWord(e.target.value)}/>
            <button onClick={translateWord} disabled={loading} className="btn btn-outline-light">
                Przetłumacz
            </button>
            {loading && <p>Tłumaczenie: {translatedWord}</p>}
        </div>
    );
};

export default TranslationComp;