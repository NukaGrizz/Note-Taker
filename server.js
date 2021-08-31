const express = require('express');
const fs = require('fs');
const PORT = process.env.PORT || 3001;
const path = require('path');
const app = express();
const { notes } = require('./db/db.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

function createNewNote(body, notesArray) {
  const note = body;
  notesArray.push(note);
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify({ notes: notesArray }, null, 2)
  );
  return note;
};

function deleteById(idParam, notesArray) {
  console.log(notesArray);
  console.log(idParam.id);
  var i = notesArray.findIndex(a => a.id === idParam.id);
  console.log(i);
  notes.splice( i, 1);
  console.log(notes);
  fs.writeFileSync(
      path.join(__dirname, './db/db.json'),
      JSON.stringify({ notes: notesArray }, null, 2)
    );
  return notes;
};

app.get('/api/notes', (req, res) => { 
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  req.body.id = Math.random().toString();
  console.log(req.body.id)
  const note = createNewNote(req.body, notes);
  res.json(note);
});

app.delete('/api/notes/:id', (req, res) => {
  console.log(req.params)
  const note = deleteById(req.params, notes);
  res.json(note);
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`);
});
