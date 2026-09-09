const mongoose= require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    username:{
        type: String,
        maxlength: 20,
        required: true,
        unique:true
    },
    password: {
        type:String,
        required: true
    }
    },
    {timestamps: true},
)

// static singup method
userSchema.statics.signup = async function(email,username, password, confirmPassword){
     
    //convalida
    if(!email || !username || !password || ! confirmPassword){
        throw Error('all fields must be filled')
    }
    if(!validator.isEmail(email)){
        throw Error('Email s not valid')
    }
    if(password !==confirmPassword){
        throw Error('Le password non coincidono')
    }
    
    if(!validator.isStrongPassword(password)){
        throw Error('La password deve contenere almeno 8 caratteri, una lettera maiuscola, una lettera minuscola, un numero e un carattere speciale')
    }

    const exist =await this.findOne({email})
    const usernameExist= await this.findOne({username})

    if(exist){
        throw Error('Email already in use')
    }

     if(usernameExist){
        throw Error('Username already in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({email, username, password:hash})

    return user
}

//Static login method

userSchema.statics.login = async function (identifier, password) {
    if(!identifier || !password){
        throw Error('all fields must be filled')
    }

    const user =await this.findOne({
        $or:[
            {email: identifier},
            {username: identifier}
        ]
        })

    if(!user){
        throw Error('Incorrect Email or username')
    }

    const match = await bcrypt.compare(password, user.password)

    if(!match){
        throw Error('incorrect password')
    }
    return user
    
}

module.exports = mongoose.model('User', userSchema )