import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ExperienceSchema = new Schema (
    {
        role: {
            type: String,
            required: true
        },
        company: {
            type: String,
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        area: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true,
            default:'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png'
        },
        username: [{
            type: Schema.Types.String,
            required: true,
            ref: 'Profile'
        }],
    },
    {
        timestamps: true,
    }
)

ExperienceSchema.static('findExperiences', async function (query) {
    const total = await this.countDocuments(query.criteria)
    const experiences = await this.find(query.criteria, query.options.fields)
        .skip(query.options.skip)
        .limit(query.options.limit)
        .sort(query.options.sort)

    return { total, experiences }
})

export default model('experiences', ExperienceSchema)

