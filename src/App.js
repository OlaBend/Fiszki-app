import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import TranslationComp from './TranslationComp';
import axios from 'axios';
import { Alert } from 'bootstrap';
import ErrorAlert from './ErrorAlert';


const App = () => {

  const [allFlashcards, setAllFlashcards] = useState([]);
  const [currentFlashcard, setCurrentFlashcard] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [newTerm, setNewTerm] = useState('');
  const [newDefinition, setNewDefinition] = useState('');
  const [isAddingNewFlashcard, setIsAddingNewFlashcard] = useState(false);
  const [translations, setTranslations] = useState(''); //not done
  const [error, setError] = useState(null);

  const handleToggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  const handleNextFlashcard = () => {
    setShowAnswer(false);
    const currentIndex = allFlashcards.findIndex(card => card._id === currentFlashcard._id);
    const nextIndex = (currentIndex + 1) % allFlashcards.length;
    setCurrentFlashcard(allFlashcards[nextIndex]);
  }; 
  
  const handleAddFlashcard = async () => {
    try {
      console.log('before axios ', newTerm, newDefinition);
      const response = await axios.post('http://localhost:3001/api/addFlashcard', {
        term: newTerm,
        definition: newDefinition,
      });

      setAllFlashcards([...allFlashcards, response.data]);
      setNewTerm('');
      setNewDefinition('');
      setIsAddingNewFlashcard(false);
    } catch (error) {
      console.error('Error adding flashcard:', error);
      setError(error.message);
    }
  };

  const handleEditFlashcard = async () => {
    try {
      await axios.put(`http://localhost:3001/api/editFlashcard/${currentFlashcard._id}`, {
        term: newTerm,
        definition: newDefinition,
      });
      const updatedFlashcards = allFlashcards.map((card) => 
        card._id === currentFlashcard._id ? {...card, term: newTerm, definition: newDefinition} : card
      );
      setAllFlashcards(updatedFlashcards);
      setNewTerm('');
      setNewDefinition('');
      setIsEditMode(false);
    }catch (error) {
      console.error('Error editing flashcard:', error);
    }
  };

  const handleDeleteFlashcard = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/deleteFlashcard/${currentFlashcard._id}`);
      const updatedFlashcards = allFlashcards.filter(card => card._id != currentFlashcard._id);
      setAllFlashcards(updatedFlashcards);
      setShowAnswer(false);

      if(updatedFlashcards.length > 0) {
        setCurrentFlashcard(updatedFlashcards[0]);
      } else {
        setCurrentFlashcard({});
      }
    } catch (error) {
      console.error('Error deleting flashcard:', error);
    }
  };

  const handleStartEditMode = () => {
    setNewTerm(currentFlashcard.term);
    setNewDefinition(currentFlashcard.definition);
    setIsEditMode(true);
  };

  const handleShareFlashcards = () => {
    alert('Fiszki zostały udostępnione!');
  };

  const handleTranslation = ({originalWord, translatedWord}) => {
   setTranslations([...translations, {original: originalWord, translation: translatedWord}]);
  };

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/getFlashcards');
        setAllFlashcards(response.data);
        setCurrentFlashcard(response.data[0] || {});
      } catch (error) {
        console.error('Error getting flashcards:', error);
      }
    };
    fetchFlashcards();
  }, []);

  return (
   <div className='container mt-4  bg-success text-white'>
    <div className='d-flex flex-column align-items-center'>
      <nav className='navbar navbar-expand-lg navbar-light bg-light rounded'>
        <div className='container-fluid'>
          <a className='navbar-brand' href='#'>Ucz się i dodawaj fiszki!</a>
        </div>
      </nav>
    </div>
    <h1 className='my-4'>Learn Languages</h1>
    <TranslationComp onTranslation={handleTranslation}/> 
    {allFlashcards.length > 0 && (
      <div>
        <div className='card my-4'>
          <div className='card-body'>
          {isAddingNewFlashcard ? (
            <div>
              <h5 className="card-title mb-4">Dodaj nową fiszkę</h5>
                <input
                  type="text"
                  placeholder="Termin"
                  value={newTerm}
                  onChange={(e) => setNewTerm(e.target.value)}
                  className="form-control my-2"/>
                <input
                  type="text"
                  placeholder="Definicja"
                  value={newDefinition}
                  onChange={(e) => setNewDefinition(e.target.value)}
                  className="form-control mb-2"/>
                <button
                  onClick={handleAddFlashcard}
                  className="btn btn-primary mr-2">
                  Dodaj fiszkę
                </button>
                <button
                  onClick={() => setIsAddingNewFlashcard(false)}
                  className="btn btn-secondary">
                  Anuluj
                </button>
              </div>
            ): (
              <div>
                <h5 className='card-title'>
                  Fiszka {allFlashcards.indexOf(currentFlashcard) + 1} z {allFlashcards.length}
                </h5>
                <p className='card-text'>
                  {showAnswer ? currentFlashcard.definition
                    : currentFlashcard.term}
                </p>
                <button onClick={handleToggleAnswer} className='btn btn-info mr-2'>
                  {showAnswer ? 'Pokaż termin' : 'Pokaż definicję'}
                </button>
                <button onClick={handleNextFlashcard} className='btn btn-primary mr-2'>
                  Następna fiszka
                </button>
                <button onClick={handleStartEditMode} className='btn btn-warning mr-2'>
                  Edytuj fiszkę
                </button>
                <button onClick={handleDeleteFlashcard} className='btn btn-danger'>
                  Usuń fiszkę
                </button>
              </div>
            )}
            {error && (
              <ErrorAlert errorMessage={error} onClose={() => setError(null)}/>
            )}
          </div>
        </div>
        <div className='mt-3'>
          <button onClick={handleShareFlashcards} className='btn btn-success mr-2'>
            Udostępnij
          </button>
        </div>
      </div>
    )}
    <div className='mt-3'>
      <h3>Dodaj nową fiszkę</h3>
      <input type='text' placeholder='Termin' value={newTerm}
        onChange={(e) => setNewTerm(e.target.value)} className='form-control mb-2'/>
      <input type='text' placeholder='Definicja' value={newDefinition}
        onChange={(e) => setNewDefinition(e.target.value)} className='form-control mb-2'/>
      <button onClick={isEditMode ? handleEditFlashcard : handleAddFlashcard} className='btn btn-primary '>
        {isEditMode ? 'Edytuj fiszkę' : 'Dodaj fiszkę'}
      </button>
    </div>
   </div>
   
  );      
};

export default App;
