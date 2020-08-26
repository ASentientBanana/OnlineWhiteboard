class Logger{
    constructor(){
        if(Logger.instance == null){
            this.logs = []
            Logger.instance = this;
        }
        return Logger.instance;
    }
     logPrint (){
        console.log(this.logs);            
    }
     addLog (x){
        this.logs.push(x)           
    }
}

const logger = new Logger();
Object.freeze(logger);
module.exports = logger;