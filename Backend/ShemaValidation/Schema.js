
import Joi from "joi";

// user schema
export const userSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    age: Joi.number().min(10).required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    bio: Joi.string().max(500).optional(),
    image: Joi.string().uri().required(),
    password: Joi.string().min(5).max(20)
        .pattern(new RegExp(/^[a-zA-Z0-9@#$%^&*()_+!~\-]{5,20}$/))
        .required(),
});

// post schema
export const PostSchema = Joi.object({
    caption: Joi.string().max(2200).allow('', null).messages({
        'string.max': 'Caption cannot exceed 2200 characters.',
    }),
    imageUrl: Joi.string().uri().required().messages({
        'string.uri': 'Image URL must be a valid URI.',
        'any.required': 'Image is required.',
    }),
    taggedUsers: Joi.array().items(Joi.string()),
});

// comment schema
export const commentSchema = Joi.object({
    comment: Joi.string().required(),
});

// story schema
export const storySchema = Joi.object({
    caption: Joi.string().min(2).max(50).optional(),
    mediaUrl: Joi.string().uri().required(),
});