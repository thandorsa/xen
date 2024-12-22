import config from './config.json' assert { type: 'json' };
import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';
import mongoose from 'mongoose';
import jointocreate from './jointocreate.js'; // Import other modules as needed

const { token, default_prefix, color } = config;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Required for basic bot functions
    GatewayIntentBits.GuildMessages, // For message-related events
    GatewayIntentBits.MessageContent, // For reading message content
    GatewayIntentBits.GuildMembers, // For member-related events
    GatewayIntentBits.GuildVoiceStates, // For voice-related events
  ],
  partials: [Partials.Message, Partials.Reaction],
});

// Connect to MongoDB
mongoose
  .connect(
    'mongodb+srv://mlauzimabel:C83eksFrSyi1g3sE@cluster0.x2rvy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  )
  .then(() => console.log('Connected to MongoDB'));

// Load join-to-create functionality
jointocreate(client);

// Initialize bot collections
client.commands = new Collection();
client.aliases = new Collection();
client.db = await import('quick.db'); // For dynamic import

// Load command and event handlers dynamically
const loadHandlers = async () => {
  const handlerTypes = ['command', 'event'];  // Define the types of handlers we want to load

  for (const handler of handlerTypes) {
    try {
      const handlerModule = await import(`./handlers/${handler}.js`);
      handlerModule.default(client); // Call the default export (which is a function) and pass the client
    } catch (error) {
      console.error(`Failed to load ${handler} handler:`, error);
    }
  }
};

// Load handlers on bot startup
loadHandlers();

// Export the client for modular usage
export default client; // Use default export

// Set default options (if necessary)
client.once('ready', () => {
  console.log(`${client.user.tag} is online!`);
});

// Log in to Discord
client.login(token);
