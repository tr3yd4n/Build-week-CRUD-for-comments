import mongoose from 'mongoose'

const { Schema, model } = mongoose

const ProfileSchema = new Schema (
    {
        name: {
            type: String,
            required: true
        },
        surname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        bio: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        area: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true,
            default:'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png'
        },
        username: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

ProfileSchema.static('findProfiles', async function (query) {
    const total = await this.countDocuments(query.criteria)
    const profiles = await this.find(query.criteria, query.options.fields)
        .skip(query.options.skip)
        .limit(query.options.limit)
        .sort(query.options.sort)

    return { total, profiles }
})

export default model('Profile', ProfileSchema)