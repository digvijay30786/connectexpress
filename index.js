const express = require("express");
const mongoose = require("mongoose");

const connect = () => {
    return mongoose.connect("mongodb://localhost:27017/entertainment", {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology:true
    })
}

const myschema = new mongoose.Schema({
    movie_name: { type: String,required:true},
    movie_genre: { type: String, required: true },
    production_year: { type: Number, required: false, default: 2000 },
    budget: {type:Number,required:false,default:9000}
}, {
    versionKey: false,
    timestamps: true
})

const movieColl = mongoose.model("movie", myschema);


const app = express();
app.use(express.json());
//show all list data
app.get('/movies', async (req, res) =>
{
    try
    {
        var movie = await movieColl.find().lean().exec();
        res.send(movie);

    }
    catch (err)
    {
        res.status(400).json({ "status": "error", "message": err.message });
    }
    

})

//insert data in a movie list
app.post('/movies', async (req, res) =>
{
    try {
        var movie = await movieColl.create(req.body);
        res.status(201).json(movie);
    }
    catch (err)
    {
        res.status(400).json({ "status": "error", "message": err.message });
    }
})


//show only single data
app.get('/movies/findone', async (req, res) => {
    try {
        var movie = await movieColl.findOne();
        res.status(200).send(movie);
    }
    catch (err)
    {
        res.status(400).json({ "status": "error", "message": err.message });
    }
})


app.delete("/movies/:id", async (req,res) => {
    try {
        var movie = await movieColl.findByIdAndDelete(req.params.id);
        res.status(200).send(movie);
    }
    catch (err)
    {
        res.status(400).json({ "status": "error", "message": err.message });
    }
})


//update single data

app.patch("/movies/:id", async (req, res) => {
    try {
        var movie = await movieColl.findByIdAndUpdate(req.params.id, req.body, { new: 1 });
        res.status(200).json({ movie });
    }
    catch (err)
    {
        res.status(400).json({ "status": "error", "message": err.message });
    }
})








//running server on 2100 port url : http://localhost:2100
app.listen('2100', async () => {
    await connect();
    console.log("Server connected");
})