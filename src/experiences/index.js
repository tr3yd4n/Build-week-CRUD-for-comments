
import express from 'express'
import ExperienceModel from './schema.js'
import createError from 'http-errors'
import q2m from 'query-to-mongo'
import { uploadOnCloudinary } from '../../settings/cloudinary.js'

const experienceRouter = express.Router()

// ===============  CREATES NEW PROFILE =======================
experienceRouter.post('/:userName/experiences', async (req, res, next) => {
    try {
        const newExperience = new ExperienceModel(req.body)
        const { _id } = await newExperience.save()

        res.status(201).send({ _id })

    } catch (error) {
        if(error.name === "validationError") {
            next(createError(400, error))
        } else {
            console.log(error)
            next(createError(500, "An Error ocurred while creating a new experience"))
        }

    }
  
});

// ===============  RETURNS PROFILE LIST =======================
experienceRouter.get('/:userName/experiences', async (req, res, next) => {
    try {
        const query = q2m(req.query)

        const { total, experiences } = await ExperienceModel.findExperiences(query)

        res.send({ links: query.links('/experiences', total), total, experiences })
    } catch (error) {
        next(createError(500, "An Error ocurred while getting the list of profiles"))
    }
})

// ===============  RETURNS SINGLE PROFILE =======================
experienceRouter.get('/:userName/experiences/:expId', async (req, res, next) => {
    try {
        const expId = req.params.expId
        const experience = await ExperienceModel.findById(expId)

        if(experience) {
            res.send(experience)
        } else {
            next(createError(404, `Experience with _id ${expId} Not Found!`))
        }

    } catch (error) {
      next(createError(500, 'An Error ocurred while getting the profile'));
    }
  }
);

// ===============  UPDATES A PROFILE =======================

experienceRouter.put('/:userName/experiences/:expId', async (req, res, next) => {
    try {
        const expId = req.params.expId
        const modifiedExperience = await ExperienceModel.findByIdAndUpdate(expId, req.body, {
            new: true,
            runValidators: true,
        } )

        if(modifiedExperience) {
            res.send(modifiedExperience)
        } else {
            next(createError(404, `Experience with _id ${expId} Not Found!`))

        }

      if (modifiedExperience) {
        res.send(modifiedExperience);
      } else {
        next(createError(404, `Experience with _id ${expId} Not Found!`));
      }
    } catch (error) {

        next(createError(500, `An Error ocurred while updating the experience ${req.params.expId}`))

    }
  }
);

// ===============  DELETES A PROFILE ====================expId===

experienceRouter.delete('/:userName/experiences/:expId', async (req, res, next) => {
    try {
        const expId = req.params.expId
        const deletedExperience = await ExperienceModel.findByIdAndDelete(expId)

        if (deletedExperience) {
            res.status(204).send()
        } else {
            next(createError(404, `Experience with _id ${expId} Not Found!`))
        }
    } catch (error) {
        next(createError(500, `An Error ocurred while deleting the experience ${req.params.epxId}`))

    }
  }
);

// ===============  UPLOADS IMAGE TO profile =======================

experienceRouter.post('/:userName/experiences/:expId/picture', uploadOnCloudinary.single('image'), async (req, res,next) => {
    try {
        const expId = req.params.expId
        // const profile = await ProfileModel.findById(profileId)

        const modifiedExperience = await ExperienceModel.findByIdAndUpdate(
            expId, 
            {image: req.file.path}, 
            {new: true} 
        )
        if(modifiedExperience) {
            res.send(modifiedExperience)
        } else {
            next(createError(404, `Experience with _id ${expId} Not Found!`))
        }
    } catch (error) {
        console.log(error)
        next(createError(500, `An Error ocurred while uploading Image to experience with _id ${expId}`))

    }
  }
);

export default experienceRouter

