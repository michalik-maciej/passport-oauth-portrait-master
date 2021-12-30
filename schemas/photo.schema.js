const validationSchema = {
	type: 'object',
	required: ['email', 'title', 'author'],
	properties: {
		email: {
			type: 'string',
			minLength: 5,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9]+@[a-z]+\.[a-z]+$/,
		},
		title: {
			type: 'string',
			minLength: 2,
      maxLength: 25,
		},
		author: {
			type: 'string',
			minLength: 2,
      maxLength: 50,
		},
	},
};

module.exports = validationSchema;
