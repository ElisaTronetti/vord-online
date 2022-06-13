module.exports =  (mongoose)=>{
    const vordSchema = new mongoose.Schema({
        users:{
            email:{
                type: String,
                required: true,
                unique: true
            },
            name:{
                type: String,
                required: true
            },
            surname:{
                type: String,
                required: true
            },
            password: {
                type: String,
                required: true
            },
            salt: {
                type: String,
                required: true
            },
            documents: {            //documents of the user
                _id:{
                    type: String,
                    required: true,
                    unique: true
                },
                title:{
                    type: String,
                    required: true
                },
                localpath:{
                    type: String,
                    required: true
                },
                time: Number,
                blocks: Object,
                version: String
            },
            sharedWithUser:{
                _id: {
                    type: String,
                    required: true,
                    unique: true
                },
                title:{
                    type: String,
                    required: true
                },
                author:{
                    type: String,
                    required: true
                },
                role:{
                    type: Number,
                    required: true
                },
                localPath:{
                    type: String,
                    required: true
                }
            }
        },
        sharedFiles:{
            _id:{        //TODO decidere semantica ID
                type: String,
                required: true,
                unique: true
            },
            title:{
                type: String,
                required: true
            },
            author:{
                type: String,
                required: true
            },
            time: Number,
            blocks: Object,
            version: String,
            alreadyOpen: {
                type: Boolean,
                required: true
            },
            sharedGroup: {
                email: {
                    type: String,
                    required: true,
                },
                role: {
                    type: Number,
                    required: true,
                }
            }
        }
    })
    return mongoose.model('DB',vordSchema)
}