import { body } from 'express-validator';

export const userValidation = [
	body('email', 'Указана некорректная почта').isEmail(),
	body('uniqueName', 'Длина имени не менее 3 символов').isLength({ min: 3 }),
	body('password', 'Длина пароля не менее 5 символов').isLength({ min: 5 }),
];
