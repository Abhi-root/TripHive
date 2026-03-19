
module.exports.isAuthenticated = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","Plz login first");
        return res.redirect("/login");
    }
    next();
}