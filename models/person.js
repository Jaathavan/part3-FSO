/* eslint-disable no-param-reassign */
import { connect, Schema, model } from 'mongoose';

const url = process.env.MONGODB_URI;

connect(url)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
  });

const personSchema = new Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator(v) {
        return /^\d{2,3}-\d{6,}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: true,
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // eslint-disable-next-line no-param-reassign, no-underscore-dangle
    returnedObject.id = returnedObject._id.toString();
    // eslint-disable-next-line no-underscore-dangle
    delete returnedObject._id;
    // eslint-disable-next-line no-underscore-dangle
    delete returnedObject.__v;
  },
});

export default model('Person', personSchema);
