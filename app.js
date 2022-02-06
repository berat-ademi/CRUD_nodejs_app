const Joi = require('joi'); //what is returned from this module is a class so Pascal naming convention
// first load Express module
const express = require('express');
const app = express();

app.use(express.json()); //what we do here, basically we add a piece of middleware


const books = [
    {id:1, name:'Start with why'},
    {id:2, name:'Leaders eat last'},
    {id:3, name:'Find your why'},
]
//this app object has a bunch of useful methods like : get, post, put, delete
//this get method takes 2 arguments: first is path or the URL, second is a 'callback function'\
//(this is the function that will be called when we have a HTTP GET request to this endpoint), it should have two arguments (request, response)
app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

app.get('/api/books', (req, res) => {
    res.send(books);
});

app.get('/api/books/:id', (req, res) => {
    const book = books.find(c => c.id === parseInt(req.params.id));
    if (!book) return res.status(404).send('The book with the given ID was not found');
    res.send(book);
});

app.post('/api/books', (req, res) => {
    //we define schema
    const { error } = validateBook(req.body); //equivalent to result.error
    if (error) return res.status(400).send(error.details[0].message);
    
    //we need to read the book object that shoud be in the body of the request, use these properties to create a new book object/
    //and then add that book object to our books array.
    const book = {
        id: books.length +1,
        name: req.body.name
    };  
    books.push(book);
    res.send(book);
});


app.put('/api/books/:id', (req, res) => {
    //look up the book
    // if not exist, return 404
    const book = books.find(c => c.id === parseInt(req.params.id));
    if (!books) return res.status(404).send('The book with the given ID was not found')
    //validate
    //if invalid, return 400 - bad request
    const { error } = validateBook(req.body); //equivalent to result.error
    if (error) return res.status(400).send(error.details[0].message);

    //update book
    book.name = req.body.name;
    // return the updated book
    res.send(book);
});


app.delete('/api/books/:id', (req, res) =>{
    //look up the course
    // not existing, return 404
    const book = books.find(c => c.id === parseInt(req.params.id));
    if (!books) return res.status(404).send('The book with the given ID was not found')

    // delete
    const index = books.indexOf(book);
    books.splice(index, 1);

    // return same book
    res.send(book); 
});


function validateBook(book) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(book)
}


//PORT
// setting an environment variable on Windows use 'set PORT=5000'/ PoweShell: '$env:PORT=5000'
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));