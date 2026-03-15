# 5. React Chat UI

The final piece of our architecture is the frontend. When integrating PicoFlow into a web application, it’s critical to maintain state across multiple requests.

## Session Management with CHAT_SESSION_ID

PicoFlow manages user sessions using a unique `CHAT_SESSION_ID`. Each user gets their own session that stores their state, memory, and current step in the `MedicalFlow`.

The frontend must store and pass this ID with every request.

### The React `App.jsx`
Here’s a simplified snippet of how the main `App` component calls the API and manages the session ID.

```jsx
import React, { useState } from 'react';
import { sendMessage, endChat } from './services/api';
// ... other imports

function App() {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState("");

  const handleSendMessage = async (text) => {
    // Add user message
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);

    try {
      // Send the message and pass the current session ID
      const response = await sendMessage(text, "MedicalFlow", sessionId);

      // Update session ID if changed
      if (response.sessionId) {
        setSessionId(response.sessionId);
      }

      // Add bot message
      const botMsg = { role: 'bot', content: response.message };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      // handle error
    }
  };

  // ... rest of component
```

### The API Service `api.js`

The `sendMessage` function constructs the HTTP headers with the session ID and makes the POST request to the NestJS backend. When the backend creates a new PicoFlow session, it returns a new session ID in the headers.

```javascript
export const sendMessage = async (message, flowName, sessionId) => {
  const url = "/ai/run"; // Assume this endpoint points to the backend
  const headers = {
    "Content-Type": "application/json",
    ...(sessionId && { "CHAT_SESSION_ID": sessionId }),
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ message, flowName }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Read the session ID returned by the server
    const newSessionId = response.headers.get("CHAT_SESSION_ID") || sessionId;

    return {
      message: data.message || "No response received",
      sessionId: newSessionId,
    };
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
```

### How It Works

1. **First Request:** When a user sends their first message, `sessionId` is empty.
2. **Backend Instantiation:** The NestJS backend receives the request, sees no session ID, creates a new `MedicalFlow` instance, and returns a new session ID in the response headers.
3. **Subsequent Requests:** The React frontend captures the new `sessionId` and attaches it to the `CHAT_SESSION_ID` header for all subsequent API calls.
4. **State Persistence:** PicoFlow uses this ID to pull the state for that specific user from memory, ensuring the bot picks up exactly where it left off, whether it’s at the `SymptomsStep` or `BookingStep`.

By tying the frontend request loop directly to PicoFlow's stateful backend graph, we’ve created a robust and completely decoupled business agent. Congratulations!
