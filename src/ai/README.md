# Running Genkit Locally

The AI features in this application are powered by Genkit flows, which are defined in the `src/ai/flows` directory.

To test these features during local development, you must run the Genkit development server in a **separate terminal** from your main `npm run dev` command.

## Instructions

1. **Open a new terminal window.**
2. **Navigate to your project directory.**
3. **Run the following command:**

   ```bash
   npm run genkit:dev
   ```

   Alternatively, if you want the server to automatically restart when you make changes to your flows, you can use:

   ```bash
   npm run genkit:watch
   ```

4. **Set your API Key:** Make sure you have your `GOOGLE_API_KEY` set in your `.env` file at the root of the project.

   ```env
   GOOGLE_API_KEY="your-google-api-key-here"
   ```

This will start the Genkit server, which listens for requests from your Next.js application. You can view the Genkit developer UI at `http://localhost:4000` to inspect your flows, see logs, and test your prompts.
