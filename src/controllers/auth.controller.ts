import User from "../database/models/user.model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createClient } from "redis";
import sessionModel from "../database/models/session.model";

const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));
client.connect();

class AuthController {

    async signup(req:any, res:any) {
        try {
            const { username, email, password } = req.body;
            
            const check1:any = await User.findOne({username: username});
            const check2:any = await User.findOne({email: email});
            if (!check1 && !check2){
                const hashPwd = await bcrypt.hash(password,3);
                console.log(hashPwd);
                const result = await User.create({username: username, email:email, password:hashPwd});
                console.log('Signup successfully',result);
                return res.status(200).json({message: "OK"});
            }
            else if (check1 || check2){
                return res.status(400).json({message: "Username or email already exist"});
            }
            
        } catch(err) {
            console.error(err);
            return res.status(400).json({message: "server problem"});
        }
    }

    async login(req:any, res:any) {

        try {
            console.log("fegrtgt");
            
            const { username, password } = req.body;
            console.log("ddfd",req.body);
            
            const result: any = await User.findOne({username: username});
            if(!username) {
                return res.status(200).json({message: "Wrong username"});
            }
            const pwdMatch = await bcrypt.compare(password, result.password)
            if(pwdMatch) {
                console.log('Login result',result);                
                const token = jwt.sign({id:result._id},'appinventiv',{expiresIn: '6h'});
                console.log(token);
                let session_payload:any={
                    user_id:result._id,
                    device_id:"1234",
                    device_type:"google chrome",
                    isSessionActive: true
                }

                await sessionModel.insertMany([
                    session_payload
                ])
                
                await client.set(`${result._id}_session`,JSON.stringify(session_payload))
                return res.send({message:"User Login Succesfully",token:token})
            }
            return res.status(400).json({message: "Incorrect Password"});
        } catch(err) {
            console.error(err);
        }
    }
}

export const authController = new AuthController();








// import User from "../database/models/user.model";
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

// class AuthController {

//     async signup(req:any, res:any) {
//         try {
//             const { username, email, password } = req.body;
            
//             const check1:any = await User.findOne({username: username});
//             const check2:any = await User.findOne({email: email});
//             if (!check1 && !check2){
//                 const hashPwd = await bcrypt.hash(password,3);
//                 console.log(hashPwd);
//                 const result = await User.create({username: username, email:email, password:hashPwd});
//                 console.log('Signup successfully',result);
//                 return res.status(200).json({message: "OK"});
//             }
//             else if (check1 || check2){
//                 return res.status(400).json({message: "Username or email already exist"});
//             }
            
//         } catch(err) {
//             console.error(err);
//             return res.status(400).json({message: "server problem"});
//         }
//     }

//     async login(req:any, res:any) {
//         try {
//             const { username, password } = req.body;
//             const result: any = await User.findOne({username: username});
//             if(!username) {
//                 return res.status(200).json({message: "Wrong username"});
//             }
//             const pwdMatch = await bcrypt.compare(password, result.password)
//             if(pwdMatch) {
//                 console.log('Login result',result);                
//                 const token = jwt.sign({id:result._id},'appinventiv',{expiresIn: '6h'});
//                 console.log(token);
//                 return res.status(200).json({message: "OK Login",token});
//             }
//             return res.status(400).json({message: "Incorrect Password"});
//         } catch(err) {
//             console.error(err);
//         }
//     }
// }

// export const authController = new AuthController();