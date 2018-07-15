module.exports = (hbs) =>{
    hbs.registerHelper('json', function(context){
        return JSON.stringify(context);
    });
};