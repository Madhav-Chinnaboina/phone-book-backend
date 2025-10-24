const mongoose = require('mongoose');
const password = process.argv[2];
const url = `mongodb+srv://Madhav:${password}@cluster0.sjhg9xg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.set('strictQuery',false);
mongoose.connect(url);
const phoneSchema = new mongoose.Schema({
    name:String,
    number:Number,
})
const Phone = mongoose.model('Phone',phoneSchema);

if(process.argv.length === 3){
    Phone.find({}).then(result=>{
        console.log("phonebook:");
        result.forEach(phone=>{
            console.log(`${phone.name} ${phone.number}`);
        })
        mongoose.connection.close();
    })
    return;
}
else if(process.argv.length<5){
    console.log("Please provide the password, name and number as arguments");
    process.exit(1);
}
const newName=process.argv[3];
const newNumber = process.argv[4];
const phone = new Phone({
    name:newName,
    number:newNumber,
})
phone.save().then(result=>{
    console.log(`added ${newName} number ${newNumber} to phonebook`);
    mongoose.connection.close()
})