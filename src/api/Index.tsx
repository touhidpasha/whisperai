export const getAIResponse = async (data: {
  question: string;
  model: string;
  setStreamResponseData: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  let accumulatedText = "";

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: data.model, //"llama3.2",//"codellama",//"llama3.2",//"deepseek-r1",
        prompt: data.question,
        stream: true, // Enable streaming
      }),
    });

    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      // Ollama sends JSON objects per line, so we need to parse them
      const lines = chunk.split("\n").filter((line) => line.trim() !== "");
      for (const line of lines) {
        try {
          const jsonData = JSON.parse(line);
          if (jsonData.response) {
            accumulatedText += jsonData.response;
            data.setStreamResponseData((prev) => prev + jsonData.response);
          }
        } catch (err) {
          console.error("Error parsing JSON line:", line, err);
        }
      }
    }
  } catch (e) {
    console.error("Error parsing JSON line:", e);
  } finally {
    return { response: accumulatedText };
  }
};
