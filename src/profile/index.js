import express from 'express'
import ProfileModel from './schema.js'
import createError from 'http-errors'
import q2m from 'query-to-mongo'
import { uploadOnCloudinary } from '../../settings/cloudinary.js'
import { generatePDFReadableStream } from '../lib/pdf/index.js'
import { pipeline } from 'stream'

const profilesRouter = express.Router()

// ===============  CREATES NEW PROFILE =======================
profilesRouter.post('/', async (req, res, next) => {
    try {
        const newProfile = new ProfileModel(req.body)
        const { _id } = await newProfile.save()

        res.status(201).send({ _id })

    } catch (error) {
        if(error.name === "validationError") {
            next(createError(400, error))
        } else {
            console.log(error)
            next(createError(500, "An Error ocurred while creating a new profile"))
        }
    }
})

// ===============  RETURNS PROFILE LIST =======================
profilesRouter.get('/', async (req, res, next) => {
    try {
        const query = q2m(req.query)

        const { total, profiles } = await ProfileModel.findProfiles(query)

        res.send({ links: query.links('/profile', total), total, profiles })
    } catch (error) {
        next(createError(500, "An Error ocurred while getting the list of profiles"))
    }
})

// ===============  RETURNS SINGLE PROFILE =======================
profilesRouter.get('/:profileId', async (req, res, next) => {
    try {
        const profileId = req.params.profileId
        const profile = await ProfileModel.findById(profileId)

        if(profile) {
            res.send(profile)
        } else {
            next(createError(404, `Profile with _id ${profileId} Not Found!`))
        }
    } catch (error) {
        next(createError(500, "An Error ocurred while getting the profile"))
    }
})

// ===============  UPDATES A PROFILE =======================
profilesRouter.put('/:profileId', async (req, res, next) => {
    try {
        const profileId = req.params.profileId
        const modifiedProfile = await ProfileModel.findByIdAndUpdate(profileId, req.body, {
            new: true,
            runValidators: true,
        } )

        if(modifiedProfile) {
            res.send(modifiedProfile)
        } else {
            next(createError(404, `Profile with _id ${profileId} Not Found!`))
        }
    } catch (error) {
        next(createError(500, `An Error ocurred while updating the profile ${req.params.profileId}`))
    }
})

// ===============  DELETES A PROFILE =======================
profilesRouter.delete('/:profileId', async (req, res, next) => {
    try {
        const profileId = req.params.profileId
        const deletedProfile = await ProfileModel.findByIdAndDelete(profileId)

        if (deletedProfile) {
            res.status(204).send()
        } else {
            next(createError(404, `Profile with _id ${profileId} Not Found!`))
        }
    } catch (error) {
        next(createError(500, `An Error ocurred while deleting the profile ${req.params.profileId}`))
    }
})

// ===============  UPLOADS IMAGE TO profile =======================
profilesRouter.post('/:profileId/picture', uploadOnCloudinary.single('image'), async (req, res,next) => {
    try {
        const profileId = req.params.profileId
        // const profile = await ProfileModel.findById(profileId)

        const modifiedProfile = await ProfileModel.findByIdAndUpdate(
            profileId, 
            {image: req.file.path}, 
            {new: true} 
        )
        if(modifiedProfile) {
            res.send(modifiedProfile)
        } else {
            next(createError(404, `Profile with _id ${profileId} Not Found!`))
        }
    } catch (error) {
        console.log(error)
        next(createError(500, `An Error ocurred while uploading Image to profile with _id ${profileId}`))
    }
})

// ===============  UPLOADS IMAGE TO profile =======================
profilesRouter.get('/:profileId/CV', async (req, res, next) => {
    try {
        const profileId = req.params.profileId
        const profile = await ProfileModel.findById(profileId)

        if(profile) {

            res.setHeader("Content-Disposition", `attachment; filename=${req.body.name}_${req.body.surname}_CV.pdf`)

            const source = await generatePDFReadableStream(profile)
            const destination = res
            
            pipeline(source, destination, err => {
                if(err) next(err)
            })
        } else {
            next(createError(404, `Profile with _id ${profileId} Not Found!`))
        }
    } catch (error) {
        console.log(error)
        next(createError(500, `An Error ocurred while generating pdf CV for profile with _id ${profileId}`))
    }
})
export default profilesRouter
