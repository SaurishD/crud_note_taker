import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { data } = await axios.get(
      `${process.env.API_URL}/auth/me`,
      {
        headers: {
          Cookie: req.headers.cookie || '',
        },
        withCredentials: true,
      },
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
}