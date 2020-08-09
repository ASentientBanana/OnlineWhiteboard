//Setup
const socket = io('ws://localhost:3000');
const msgForm = document.getElementById("send-container");
const txtInput = document.getElementById("message-input");
const chatContainer = document.getElementById("chat-container");

const userName = prompt("Please enter your name!")


msgForm.addEventListener("submit",e=>{
    e.preventDefault();
    const msgTxt = txtInput.value;
    socket.emit("chat-msg",{"message-text":msgTxt,"user-name":userName})
    appendMessage(msgTxt,"You");

    txtInput.value = "";
});
socket.on("chat-msg",msg=>{
    console.log(msg);
    appendMessage(msg["message-text"],msg["user-name"]);
})

const appendMessage = (message,user)=>{
    msgElem = document.createElement("div");
    msgElem.innerText = ` ${user}: ${message}`;
    chatContainer.append(msgElem);
}



window.addEventListener('load',()=>{
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    let data;
    
    let drawing = false;
    
    //resize :D
    canvas.height = 50;
    canvas.width =  50;

    
    const startPos = e =>{
        drawing = true;
        draw(e);
    }

    const endPos = ()=>{
        drawing = false;
        ctx.beginPath();
        socket.emit('mb',"");
    }

    const draw = e =>{
        if(!drawing) return;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineTo(e.clientX,e.clientY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX,e.clientY);
        data = {
            "x":e.clientX,
            "y":e.clientY
        };
        socket.emit('m',data);
    }
    
    socket.on("mb",e=>{
        ctx.beginPath();
    })

    socket.on("m",e=>{
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineTo(e.x,e.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.x,e.y);
        console.log(e);
    })

    // event listeners
    canvas.addEventListener("mousedown",startPos);
    canvas.addEventListener("mouseup",endPos);
    canvas.addEventListener("mousemove",draw);
})


