const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://jaath_notes:${password}@cluster0.p7nfr0m.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
})
  
const Person = mongoose.model('Person', noteSchema)
  
mongoose
    .connect(url)
    .then((result) => {
        console.log('connected')
        if (process.argv.length === 5) {
            const person = new Person({
                name: process.argv[3],
                number: process.argv[4]
            })
        }
  
        return person.save()
    })
    .then(() => {
        console.log('note saved!')
        return mongoose.connection.close()
    })
    .catch((err) => console.log(err))