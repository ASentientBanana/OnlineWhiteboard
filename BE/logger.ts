import fs from 'fs';

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
    addTextLog(log:string = 'empty log string'){
        fs.readFile('log.txt', 'utf-8', function(err, data) {
            const date = new Date();
            const [month, day, year]       = [date.getMonth(), date.getDate(), date.getFullYear()];
            const [hour, minutes, seconds] = [date.getHours(), date.getMinutes(), date.getSeconds()];

            const newData = ` ${data}\r\n ${day}/${month}/${year} ${date.toLocaleTimeString()}:: ${log}`
            if (err) throw err;
            fs.writeFile('./log.txt', newData, 'utf-8',(err)=>{
                if(err) throw err;
            })
        })
    }
}

const logger = new Logger();
Object.freeze(logger);
export default logger;