class Logger{
    private static instance:Logger;
    private logs:any;
    constructor(){
        if(Logger.instance === null){
            Logger.instance = this;
        }
        this.logs = {
            colors:{},
            chats:[],
        }
        return Logger.instance;
    }
     logPrint (){
        console.log(this.logs);            
    }

    addColorLog(clr:string){
        const clrLog =this.logs.colors;
        if(clrLog.hasOwnProperty(clr)){
            clrLog[clr] = clrLog + 1;
        }
    }
     addChatLog (x:string){
        this.logs.push(x)           
    }
}

const logger = new Logger();
Object.freeze(logger);
module.exports = logger;