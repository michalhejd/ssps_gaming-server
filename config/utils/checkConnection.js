import { config } from "dotenv"
import axios from "axios"
config()

export async function checkConnection(){
   //check if can connect to google.com
    try{
        await axios.get("https://google.com")
    }
    catch(err){
        console.log("Cannot connect to internet");
        return process.exit(1);
    }
    console.log("Connected to internet")
    return
}