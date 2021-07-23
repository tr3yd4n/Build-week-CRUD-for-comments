import express, { query } from 'express';
import mongoose from 'mongoose';
import ProfileModel from '../profile/schema.js';

import createError from 'http-errors';
import q2m from 'query-to-mongo';
import { uploadOnCloudinary } from '../../settings/cloudinary.js';

import PostModel from './schema.js';

const postRouter = express.Router();

postRouter.post(
  '/:postId/picture',
  uploadOnCloudinary.single('image'),
  async (req, res, next) => {
    try {
      const postId = req.params.postId;
      const postUpdatePicture = await PostModel.findByIdAndUpdate(
        postId,
        { image: req.file.path },
        { new: true }
      );
      const newPicture = await postUpdatePicture.save();
      if (newPicture) {
        res.send(newPicture);
      } else {
        next(createError(404, `post with _id:${postId} not found!`));
      }
    } catch (error) {
      if (error.name === 'ValidationError') {
        next(createError(400, error));
      } else {
        console.log(error);
        next(
          createError(
            500,
            `Error occured while uploading new image with _id${req.params.postId}`
          )
        );
      }
    }
  }
);

postRouter.post('/', async (req, res, next) => {
  try {
    const newPost = new PostModel(req.body);
    const { _id } = await newPost.save();

    res.status(201).send({ _id });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(createError(400, error));
    } else {
      console.log(error);
      next(createError(500, 'Error occured while creating new post'));
    }
  }
});
postRouter.get('/', async (req, res, next) => {
  try {
    const query = q2m(req.query);

    const { total, posts } = await PostModel.findPostUser(query);

    // const total = await PostModel.countDocuments(query.criteria);
    // const posts = await PostModel.find(query.criteria, query.options.fields)
    //   .skip(query.options.skip)
    //   .limit(query.options.limit)
    //   .sort(query.options.sort)
    //   .populate('user')
    //   .exec();

    res.send({ links: query.links('/posts', total), total, posts });

    // const posts = await PostModel.find();
    // res.send({ posts });
  } catch (error) {
    console.log(error);
    next('error');
  }
});
postRouter.get('/:postId', async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const posts = await PostModel.findById(postId);

    if (posts) {
      res.send(posts);
    } else {
      next(createError(404, `post with id ${postId} not found`));
    }
  } catch (error) {
    console.log(error);
    next('error');
  }
});
postRouter.put('/:postId', async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const updatedPost = await PostModel.findByIdAndUpdate(postId, req.body, {
      new: true,
      runValidators: true,
    });

    if (updatedPost) {
      res.send(updatedPost);
    } else {
      next(
        createError(
          500,
          `An error occurred while updating post ${req.params.postId}`
        )
      );
    }
  } catch (error) {
    console.log(error);
    next('error');
  }
});
postRouter.delete('/:postId', async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const deletePost = await PostModel.findByIdAndDelete(postId);

    if (deletePost) {
      res.status(204).send();
    } else {
      next(
        createError(
          500,
          `An error occurred while deleting post ${req.params.postId}`
        )
      );
    }
  } catch (error) {
    console.log(error);
    next('error');
  }
});

export default postRouter;
