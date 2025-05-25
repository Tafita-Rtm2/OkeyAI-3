import { createContext, useState } from "react";
import Loading from "../components/Loading";
import runChat from "../configs/gemini";

const Context = createContext();

const ContextProvider = ({ children }) => {
  const [input, setInput] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(localStorage.getItem("isSubscribed") === "true" ? true : false);


  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  // without typing animation
  const handleSend = async (prompt) => {
    try {
      setLoading(true);
      setShowResult(true);
      // Update messages state with user message
      setMessages((prevMessages) => [...prevMessages, { role: "user", text: prompt }]);

      // Show typing message while waiting for response
      setMessages((prevMessages) => [...prevMessages, { role: "bot", text: <Loading /> }]);

      // Send user message to the API
      const text = await runChat(prompt);

      // Replace \n with <br/> for HTML rendering.
      // The old logic for ** and * based formatting is removed as the new API provides plain text with \n.
      let newResponse = text.replace(/\n/g, "<br/>");

      // Remove typing message
      setMessages((prevMessages) => prevMessages.slice(0, -1));

      // Update messages state with bot response (initially empty)
      setMessages((prevMessages) => [...prevMessages, { role: "bot", text: <Loading /> }]);

      setLoading(false);

      // Typing effect: loop through each character of the response and update state
      for (let i = 0; i < newResponse.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 10)); // Delay between each character
        const partialText = newResponse.substring(0, i + 1); // Get characters up to the current index
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[prevMessages.length - 1].text = partialText; // Update the last message
          return updatedMessages;
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const contextValue = {
    handleSend,
    input,
    setInput,

    prevPrompts,
    setPrevPrompts,
    showResult,
    setShowResult,
    loading,
    setLoading,

    newChat,
    messages,
    setMessages,
    isSubscribed,
    setIsSubscribed,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export { Context, ContextProvider };
