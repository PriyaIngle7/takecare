server.on("connection", async (ws) => {
  console.log("Client connected");

  try {
    const messages = await Message.find().sort({ timestamp: -1 }).limit(50);
    ws.send(JSON.stringify(messages.reverse())); // Reverse to maintain order
  } catch (error) {
    console.error("Error fetching messages:", error);
  }

  ws.on("message", async (data) => {
    try {
      const receivedMessage = JSON.parse(data);
      const newMessage = new Message(receivedMessage);
      await newMessage.save();

      server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify([newMessage]));
        }
      });
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  ws.on("close", () => console.log("Client disconnected"));
});
