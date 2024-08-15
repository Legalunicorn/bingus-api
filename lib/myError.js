class myError extends Error{
    constructor(msg,status){
        super(msg)
        this.status = status || 400;
    }
}
module.exports = myError