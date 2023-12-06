const express = require('express');
const path = require('path');
const fs = require('fs');
const fsp = require('fs').promises;
const uniqid = require('uniqid');
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.delete('/api/notes/:id', (req, res) => { 
    console.log(req.params.id);
    fs.readFile('./db/db.json', 'utf-8', (err, json) => {
        if (err) {
            console.log(err);
            return;
        } else {
            let note = JSON.parse(json);
            let newnote = note.filter(note => note.id !== req.params.id);
            let html = JSON.stringify(newnote);
            return fs.writeFile('./db/db.json', html, (err) => {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    res.sendFile(path.join(__dirname, '/public/notes.html'));    
                }
            });
        }
    });
    });

app.post('/api/notes', async (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, json) => {
        if (err) {
            console.log(err);
            return;
    }  else {
    
        let note = JSON.parse(json);
        let newnote = {id: uniqid(), title: req.body.title, text: req.body.text};

        note.push(newnote);
        let html = JSON.stringify(note);
        return fs.writeFile('./db/db.json', html, (err) => {
            if (err) {
                console.log(err);
                return;
            } else {
                res.sendFile(path.join(__dirname, '/public/notes.html'));    
            }
            
        });
    }})
});
  
app.get('/api/notes', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
  
    try {
      // Read the file asynchronously using fs.promises
      const data = await fsp.readFile('./db/db.json', 'utf8');
      const db = JSON.parse(data);
      res.json(db);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

app.get('/notes', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});
  
app.get('*', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
