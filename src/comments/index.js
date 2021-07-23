import express, { Router } from 'express'
import createError from 'http-errors'
import CommentModel from './schema.js'
import PostModel from '../post/schema.js'

const commentRouter = express.Router()

commentRouter.post('/:postId/create', async (req, res, next) => { //post a comment
    try {

        const postId = req.params.postId
        const post = await PostModel.findById(postId)
        if (post) {
            const newComment = new CommentModel(req.body)
            newComment.postID = postId
            const { _id } = await newComment.save()
            post.comments.push(_id)
            await post.save()

            res.status(201).send(newComment)
        } else {
            next(createError(404, `post with id ${postId} not found`))
        }
    } catch (error) {
        console.log(error)
        if (error.name === "validationError") {
            next(createError(400, error))
        } else {
            console.log(error)
            next(createError(500, "An Error ocurred while creating your comment"))
        }
    }
})

commentRouter.put('/:commentId/edit', async (req, res, next) => { // ammend a comment
    try {

        const commentId = req.params.commentId;

        const updatedComment = await CommentModel.findByIdAndUpdate(commentId, req.body, {
            new: true,
            runValidators: true,
        })
        if (updatedComment) {
            res.status(204).send(updatedComment)
        } else {
            next(createError(404, `post with id ${postId} not found`))
        }
    } catch (error) {
        if (error.name === "validationError") {
            next(createError(400, error))
        } else {
            console.log(error)
            next(createError(500, "An Error ocurred while editing your comment"))
        }
    }
})

commentRouter.delete('/:postId/:commentId/delete', async (req, res, next) => { // delete a comment
    try {
        const postId = req.params.postId
        const commentId = req.params.commentId
        const post = await PostModel.findById(postId)
        const comment = await CommentModel.findById(commentId)
        if (post && comment) {
            // console.log(post.comments)
            // const eggs = PostModel.findOneAndDelete({ comments: commentId })
            // console.log(eggs)
            // console.log(post.comments)
            //<------------------------------------- this bit no worky?
            await CommentModel.findByIdAndDelete(commentId)
            res.status(204).send(`deleted`)
        } else {
            next(createError(404, `sorry your request cannot be found`))
        }
    } catch (error) {
        console.log(error)
        if (error.name === "validationError") {
            next(createError(400, error))
        } else {
            console.log(error)
            next(createError(500, "An Error ocurred while creating your comment"))
        }
    }
})

commentRouter.get('/:commentId', async (req, res, next) => { //get single comment
    try {

        const commentId = req.params.commentId
        const comment = await CommentModel.findById(commentId)
        if (comment) {
            res.status(200).send(comment)
        } else {
            next(createError(404, `comment with id ${commentId} not found`))
        }
    } catch (error) {
        if (error.name === "validationError") {
            next(createError(400, error))
        } else {
            console.log(error)
            next(createError(500, "An Error ocurred while creating your comment"))
        }
    }
})

commentRouter.get('/:postId/comments', async (req, res, next) => { //get all comment
    try {
        const postId = req.params.postId
        const comments = await CommentModel.findById(postId)
        console.log(postId)
        console.log(comments)

        if (postId && comments) {
            res.status(200).send(comments)
        } else {
            next(createError(404, `comments for post - ${postId} - cannot be found`))
        }
    } catch (error) {
        if (error.name === "validationError") {
            next(createError(400, error))
        } else {
            console.log(error)
            next(createError(500, "An Error ocurred"))
        }
    }
})

export default commentRouter