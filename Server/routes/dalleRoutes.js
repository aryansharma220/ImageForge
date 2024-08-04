import express from 'express';
import * as dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const router = express.Router();

// const configuration = new Configuration();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Hello from DALL-E!' });
});

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    const aiResponse = await openai.images.generate({
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
    });

    const image = aiResponse.data.data[0].b64_json;
    res.status(200).json({ photo: image });
  } catch (error) {
    console.error('OpenAI API error:', error);
    if (error.error && error.error.code === 'billing_hard_limit_reached') {
      return res.status(403).json({
        error: 'OpenAI API request cannot be completed due to a billing limit.',
        details: 'Please check your OpenAI account and billing status.'
      });
    }
    res.status(500).json({
      error: 'An error occurred while processing your request.',
      details: error.message || 'Unknown error'
    });
  }
});

export default router;