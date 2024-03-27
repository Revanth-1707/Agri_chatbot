// server.js
const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const port = process.env.PORT || 3001; // Use the port specified by environment variable or default to 3001
app.use(cors(
    {
        origin : "https://agri-chatbot-cyan.vercel.app",
        methods: ["POST","GET"],
        credentials: true
    }
));
app.options('*', cors()); // Enable preflight requests for all routes

app.use(express.json());

// Define routes
// app.post('/api/chatbot', async (req, res) => {
//     // Implement endpoint logic to communicate with ChatGPT API
//     res.json({ message: 'Placeholder response from backend' });
// });

// Function to fetch weather data from the OpenWeatherMap API
async function getWeatherData(city) {
    const API_KEY = 'ea0b728e586d27592f0a9154d6e5a3a5';
    const API_URL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${API_KEY}`;

    try {
        const response = await axios.get(API_URL);
        const weatherDescription = response.data.weather[0].main;
        const temperature = response.data.main.temp;
        const min_temp = response.data.main.temp_min;
        const max_temp = response.data.main.temp_max;
        const humidity = response.data.main.humidity;
        const windspeed = response.data.wind.speed;
        return `Current weather in ${city} indicates ${weatherDescription} with temperature of ${temperature}°F. Throughout the day, temperatures are expected to range between a comfortable minimum of ${min_temp}°F and a warmer maximum of ${max_temp}°F. Additionally, the air is moderately humid, with a humidity level of ${humidity}%. There is also a gentle breeze blowing at a speed of ${windspeed} MPH.`;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return 'Sorry, I could not fetch the current weather.';
    }
}

function isWeatherQuery(message) {
    return message.toLowerCase().includes('weather');
}

// Extract city from the message (e.g., "What's the weather in New York?")
function extractCity(message) {
    const matches = message.match(/in\s+(\w+)/i);
    return matches ? matches[1] : null;
}

app.get('/', (req, res) => {
    res.send('Welcome to the backend of your Chat Bot application!'); // Example response
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// server.js
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://revanthagastya12345:bT4Sg$V45*#UQC8@cluster.ymnnu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB:', err));


// server.js
const axios = require('axios');
const openai = require('openai');

const openaiClient = new openai.OpenAI(process.env.OPENAI_API_KEY);

app.post('/api/chatbot', async (req, res) => {
    const { message } = req.body;

    try {
        let response;
        if (isWeatherQuery(message)) {
            const city = extractCity(message);
            if (city) {
                response = await getWeatherData(city);
                res.json({ message: response, isWeather: true }); // Include the isWeather flag
            } else {
                res.json({ message: 'Please enter weather information in the format: "weather in [city name]"', isWeather: false }); // Include the isWeather flag
            }
        } else {
            response = await openaiClient.completions.create({
                model: 'gpt-3.5-turbo-instruct',
                prompt: `User: ${message}\nBot:`,
                max_tokens: 150
            });
            if (response && response.choices && response.choices.length > 0) {
                const botResponse = response.choices[0].text.trim();
                res.json({ message: botResponse, isWeather: false }); // Include the isWeather flag
            } else {
                console.error('Invalid response from ChatGPT API:', response);
                res.status(500).json({ error: 'Invalid response from ChatGPT API' });
            }
        }
    } catch (error) {
        console.error('Error communicating with ChatGPT API:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/api/signup', async (req, res) => {
    try {
      const { email, password } = req.body;
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create a new user
      const newUser = new User({ email, password: hashedPassword });
      // Save the user to the database
      await newUser.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error signing up:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });



  app.post('/api/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid password' });
      }
      // If passwords match, return success message
      res.json({ message: 'Login successful' });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
