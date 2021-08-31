const express = require('express');
const fs = require('fs');
const PORT = process.env.PORT || 3001;
const path = require('path');
const app = express();
const { notes } = require('./db/db.json');

//middleware 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//grabs all files in public folder and serves them along with any app requests
app.use(express.static('public'));

//function creates a new note and adds it to the db array
function createNewNote(body, notesArray) {
  const note = body;
  notesArray.push(note);
  //overwrite bd with new note added
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify({ notes: notesArray }, null, 2)
  );
  return note;
};

//deletes a note from the db
function deleteById(idParam, notesArray) {
  let i = notesArray.findIndex(a => a.id === idParam.id);
  notes.splice( i, 1);
  //overwrites db with new arry with deleted note removed
  fs.writeFileSync(
      path.join(__dirname, './db/db.json'),
      JSON.stringify({ notes: notesArray }, null, 2)
    );
  return notes;
};

//get route to serve request to view notes arry
app.get('/api/notes', (req, res) => { 
  res.json(notes);
});

//post route to take incoming request to create a new note and add it to the db
app.post('/api/notes', (req, res) => {
  req.body.id = Math.random().toString();
  console.log(req.body.id)
  const note = createNewNote(req.body, notes);
  res.json(note);
});

//delete route to take incoming request to delete note from db
app.delete('/api/notes/:id', (req, res) => {
  console.log(req.params)
  const note = deleteById(req.params, notes);
  res.json(note);
});

//get route to serve request to view notes webpage
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
})

//wildcard route to serve landing page and catch all
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//listener waiting for requests from frontend client
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`);
});
