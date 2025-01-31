import axios from "axios";
import { AIResponse } from "../types/APIResponseTypes";
const API = axios.create({
  baseURL: "http://localhost:11434/api/",
});

export const getAIResponse = async (data: {
  question: string;
  model: string;
}): Promise<AIResponse> => {
  const response = await API.post<AIResponse>("generate", {
    model: data.model, //"llama3.2",//"codellama",//"llama3.2",//"deepseek-r1",
    prompt: data.question,
    stream: false,
  });

  // response.data.on("data", (chunk) => {
  //   console.log("Received chunk:", chunk.toString());
  // });

  // response.data.on("end", () => {
  //   console.log("Stream ended.");
  // });
  return response.data;
};
