import mongoose from 'mongoose'

const { Schema, model } = mongoose;


const CommentSchema = new Schema(
    {
        commentAuthor_id: {
            type: String,

        },
        postID: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        likedBy: [],
        createdAt: {
            type: Date,

        },
        updatedAt: {
            type: Date,

        },

    }
)

export default model('Comment', CommentSchema)