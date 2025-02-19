let url = "https://dog.ceo/api/breeds/image/random/6";
let gifUrl = "https://api.giphy.com/v1/gifs/random?api_key=JW0vWwVJ0uKi7MktTad2ZUTneYEuOpOY&tag=&rating=g";

module.exports.homeDisplay = (req,res,next) => {
    res.render("home");
}

module.exports.mainDisplay = (req, res, next) => {
    fetch(url)
    .then(data => data.json())
    .then(data=>{
        
        res.render("main" , { image: data.message})
    })
    .catch(err => console.log(err))
}

module.exports.privateDisplay = (req, res, next) => {
    fetch(gifUrl)
    .then(data => data.json())
    .then(data => {
        console.log("***GIF API*** --->>>", data.data.images.original.url);
        res.render("private",{image: data.data.images.original.url});
    })
    .catch(err => console.log(err))

}