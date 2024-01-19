const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const e = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;
const mongoDBURL = process.env.MONGODB_URL;

app.use(cors());
app.use(express.json());

mongoose.connect(mongoDBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.error('Cannot connect to MongoDB', err);
});

const flashcardSchema = new mongoose.Schema({
    term: String,
    definition: String,
});

const Flaschcard = mongoose.model('Flashcard', flashcardSchema);

app.post('/api/addFlashcard', async(req, res) => {
    try{
        const {term, definition} = req.body;
        const newFlashcard = new Flaschcard({term, definition});
        await newFlashcard.save();
        res.status(201).json(newFlashcard);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Server error'});
    }
});

app.get('/api/getFlashcards', async(req, res) => {
    try{
        const flashcards = await Flaschcard.find();
        res.json(flashcards);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Server error'});
    }
});

app.put('/api/editFlashcard/:id', async(req, res) => {
    try{
        const {id} = req.params;
        const {term, definition} = req.body;

        const updatedFlashcard = await Flaschcard.findByIdAndUpdate(
            id,
            {term, definition},
            {new: true}
        );
        res.json(updatedFlashcard);
    } catch (error){
        console.error(error);
        res.status(500).json({error: 'Server error'});
    }
});

app.delete('/api/deleteFlashcard/:id', async(req, res) => {
    try {
        const {id} = req.params;
        await Flaschcard.findByIdAndDelete(id);
        res.json({message: 'Flashcard deleted'});
    } catch (error) {
        res.status(500).json({error: 'Server error'});
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

