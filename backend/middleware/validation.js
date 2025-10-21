const Joi = require('joi');

// Validation middleware
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errorMessage
            });
        }
        next();
    };
};

// User registration validation
const registerSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name cannot exceed 50 characters',
            'any.required': 'Name is required'
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please enter a valid email address',
            'any.required': 'Email is required'
        }),
    password: Joi.string()
        .min(6)
        .max(128)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters long',
            'string.max': 'Password cannot exceed 128 characters',
            'any.required': 'Password is required'
        }),
    role: Joi.string()
        .valid('jobseeker', 'employer', 'admin')
        .required()
        .messages({
            'any.only': 'Role must be either jobseeker, employer, or admin',
            'any.required': 'Role is required'
        }),
    companyName: Joi.string()
        .min(2)
        .max(100)
        .when('role', {
            is: 'employer',
            then: Joi.required(),
            otherwise: Joi.optional()
        })
        .messages({
            'string.min': 'Company name must be at least 2 characters long',
            'string.max': 'Company name cannot exceed 100 characters',
            'any.required': 'Company name is required for employers'
        })
});

// User login validation
const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please enter a valid email address',
            'any.required': 'Email is required'
        }),
    password: Joi.string()
        .required()
        .messages({
            'any.required': 'Password is required'
        })
});

// Profile update validation
const updateProfileSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .optional(),
    skills: Joi.array()
        .items(Joi.string().trim())
        .optional(),
    education: Joi.array()
        .items(Joi.object({
            degree: Joi.string().required(),
            institution: Joi.string().required(),
            year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
            gpa: Joi.string().optional()
        }))
        .optional(),
    experience: Joi.array()
        .items(Joi.object({
            company: Joi.string().required(),
            position: Joi.string().required(),
            startDate: Joi.date().max('now').required(),
            endDate: Joi.date().min(Joi.ref('startDate')).optional(),
            description: Joi.string().max(500).optional(),
            current: Joi.boolean().default(false)
        }))
        .optional(),
    certifications: Joi.array()
        .items(Joi.object({
            name: Joi.string().required(),
            issuer: Joi.string().required(),
            date: Joi.date().max('now').required(),
            expiryDate: Joi.date().min(Joi.ref('date')).optional()
        }))
        .optional(),
    location: Joi.object({
        city: Joi.string().required(),
        country: Joi.string().required()
    }).optional(),
    phone: Joi.string()
        .pattern(/^[\+]?[1-9][\d]{0,15}$/)
        .optional()
        .messages({
            'string.pattern.base': 'Please enter a valid phone number'
        }),
    // Employer specific fields
    companyName: Joi.string()
        .min(2)
        .max(100)
        .optional(),
    companySize: Joi.string()
        .valid('1-10', '11-50', '51-200', '201-500', '500+')
        .optional(),
    industry: Joi.string()
        .max(100)
        .optional(),
    website: Joi.string()
        .uri()
        .optional()
        .messages({
            'string.uri': 'Please enter a valid website URL'
        })
});

// Change password validation
const changePasswordSchema = Joi.object({
    currentPassword: Joi.string()
        .required()
        .messages({
            'any.required': 'Current password is required'
        }),
    newPassword: Joi.string()
        .min(6)
        .max(128)
        .required()
        .messages({
            'string.min': 'New password must be at least 6 characters long',
            'string.max': 'New password cannot exceed 128 characters',
            'any.required': 'New password is required'
        })
});

// Job posting validation
const jobPostingSchema = Joi.object({
    title: Joi.string()
        .min(5)
        .max(100)
        .required()
        .messages({
            'string.min': 'Job title must be at least 5 characters long',
            'string.max': 'Job title cannot exceed 100 characters',
            'any.required': 'Job title is required'
        }),
    description: Joi.string()
        .min(50)
        .max(2000)
        .required()
        .messages({
            'string.min': 'Job description must be at least 50 characters long',
            'string.max': 'Job description cannot exceed 2000 characters',
            'any.required': 'Job description is required'
        }),
    companyName: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'Company name must be at least 2 characters long',
            'string.max': 'Company name cannot exceed 100 characters',
            'any.required': 'Company name is required'
        }),
    location: Joi.object({
        city: Joi.string().required(),
        country: Joi.string().required(),
        remote: Joi.boolean().default(false)
    }).required(),
    jobType: Joi.string()
        .valid('full-time', 'part-time', 'contract', 'internship', 'freelance')
        .required()
        .messages({
            'any.only': 'Job type must be one of: full-time, part-time, contract, internship, freelance',
            'any.required': 'Job type is required'
        }),
    experienceLevel: Joi.string()
        .valid('entry', 'mid', 'senior', 'executive')
        .required()
        .messages({
            'any.only': 'Experience level must be one of: entry, mid, senior, executive',
            'any.required': 'Experience level is required'
        }),
    salary: Joi.object({
        min: Joi.number().min(0).optional(),
        max: Joi.number().min(Joi.ref('min')).optional(),
        currency: Joi.string().default('USD'),
        negotiable: Joi.boolean().default(false)
    }).optional(),
    skillsRequired: Joi.array()
        .items(Joi.string().trim())
        .min(1)
        .required()
        .messages({
            'array.min': 'At least one skill is required',
            'any.required': 'Required skills are mandatory'
        }),
    requirements: Joi.array()
        .items(Joi.string().trim())
        .optional(),
    benefits: Joi.array()
        .items(Joi.string().trim())
        .optional(),
    expiryDate: Joi.date()
        .min('now')
        .required()
        .messages({
            'date.min': 'Expiry date must be in the future',
            'any.required': 'Expiry date is required'
        })
});

module.exports = {
    validate,
    registerSchema,
    loginSchema,
    updateProfileSchema,
    changePasswordSchema,
    jobPostingSchema,
    // Allow partial updates but validate shapes
    jobUpdateSchema: Joi.object({
        title: Joi.string().min(5).max(100).optional(),
        description: Joi.string().min(50).max(2000).optional(),
        companyName: Joi.string().min(2).max(100).optional(),
        location: Joi.object({
            city: Joi.string().optional(),
            country: Joi.string().optional(),
            remote: Joi.boolean().optional()
        }).optional(),
        jobType: Joi.string().valid('full-time', 'part-time', 'contract', 'internship', 'freelance').optional(),
        experienceLevel: Joi.string().valid('entry', 'mid', 'senior', 'executive').optional(),
        salary: Joi.object({
            min: Joi.number().min(0).optional(),
            max: Joi.number().min(Joi.ref('min')).optional(),
            currency: Joi.string().optional(),
            negotiable: Joi.boolean().optional()
        }).optional(),
        skillsRequired: Joi.array().items(Joi.string().trim()).min(1).optional(),
        requirements: Joi.array().items(Joi.string().trim()).optional(),
        benefits: Joi.array().items(Joi.string().trim()).optional(),
        expiryDate: Joi.date().min('now').optional()
    })
};
