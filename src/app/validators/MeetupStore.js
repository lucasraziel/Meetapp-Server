import * as Yup from 'yup';
import { addHours } from 'date-fns';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      place: Yup.string().required(),
      description: Yup.string().required(),
      title: Yup.string().required(),
      date: Yup.date()
        .required()
        .min(addHours(new Date(), 1)),
      file_id: Yup.number().required(),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: err.inner });
  }
};
