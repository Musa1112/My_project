const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors'); // Add this line

dotenv.config();
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors()); // Add this line

class SabiDoktor {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
  }

  async processMessage(message) {
    try {
      // Call OpenAI API to generate a response
      const response = await this.generateOpenAIResponse(message);

      // Add additional logic for processing the response if needed
      return `User: ${message}\nSabiDoktor: ${response}`;
    } catch (error) {
      console.error('Error processing message:', error.message);
      return 'Error processing message';
    }
  }

  async generateOpenAIResponse(prompt) {
    const apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';

    try {
      const response = await axios.post(apiUrl, {
        prompt: prompt,
        max_tokens: 50
        // Add additional parameters based on your needs
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`
        }
      });

      return (response.data.choices[0] && response.data.choices[0].text.trim()) || 'No response from SabiDoktor';

    } catch (error) {
      console.error('Error generating response from OpenAI:', error.message);
      return 'Error generating response from OpenAI';
    }
  }
}

const sabiDoktor = new SabiDoktor();

app.post('/webhook', async (req, res) => {
  const { message } = req.body;
  const response = await sabiDoktor.processMessage(message);
  res.json({ response });
});

app.listen(port, () => {
  console.log(`SabiDoktor Server listening at http://localhost:${port}`);
});