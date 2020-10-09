const messageModel = require('../models/Message.ts');
const imageModel = require('../models/Image.ts');
const userModel = require('../models/User');
const testMdl = require('../models/test');


class DBEntryUtility{
    static createMesssageEntry(body:string,user_name:string,){
        messageModel.create({
            body,
            user_name
          })
          .then(()=>{console.log('message added ')})
          .catch((e:any)=>{console.log(`err adding message ${e}`)})
    }
    static createTest(name:string){
        testMdl.create({
            name
          })
          .then(()=>{console.log('test name added ')})
          .catch((e:any)=>{console.log(`test err adding name ${e}`)})
    }

    static createImageEntry(image:string,user_id:string){
        imageModel.create({
            image,
            user_id
          })
          .then(()=>{console.log('image added')})
          .catch((e:any)=>{console.log(`err adding image ${e}`)})
    }

    static createUser(user_name:string){
        userModel.create({
            user_name,
          })
          .then(()=>{console.log('user added')})
          .catch((e:any)=>{console.log(`err user ${e}`)})
    }

    static  getUserIdByName(user_name:string){
          return userModel.findOne({
            where: {
              user_name
            }
          })
        }

    static getImagesForUser(user_id:number){
        let imageArr:string[];
        return imageModel.findAll({
            where: {
              user_id
              }
        })
        
    }
}


module.exports = DBEntryUtility; 

