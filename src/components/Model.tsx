import * as React from "react";
import { useEffect, useRef } from "react";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import { Input, Stack } from "@mui/joy";
import { Option, Select, Skeleton } from "@mui/joy";

import { getAIResponse } from "../api/Index";
import { ApiResponseFormatter } from "./ApiResponseFormatter";
import { APIResponseFormatterWithCopyCode } from "./APIResponseFormatterWithCopyCode";

export default function BasicModal(props: {
  open: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  description: string;
  buttonText: string;
}) {
  const [question, setQuestion] = React.useState<string>("");
  const [apiCalling, setApiCalling] = React.useState<boolean>(false);
  const [chatHistory, setChatHistory] = React.useState<
    { q: string; a: string }[]
  >([]);
  const [selectedModel, setSelectedModel] = React.useState<string>("llama3.2");
  const availableModels = ["codellama", "llama3.2", "deepseek-r1"];
  const [streamResponseData, setStreamResponseData] = React.useState<
    string | null
  >(null);
  const chatHandler = async () => {
    // setChatHistory([...chatHistory, { q: question, a: "I don't know" }]);
    setApiCalling(true);
    try {
      const res = await getAIResponse({
        question: question,
        model: selectedModel,
        setStreamResponseData: setStreamResponseData,
      });
      setChatHistory([...chatHistory, { q: question, a: res.response }]);
      setQuestion("");
      setApiCalling(false);
      setStreamResponseData(null);
      console.log("streamResponseData",streamResponseData);
    } catch (e) {
      setChatHistory([...chatHistory, { q: question, a: "error occured" }]);
      setQuestion("");
      setApiCalling(false);
    }
  };

  //scrolling at the end logic
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  // Function to auto-scroll to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom(); // Scroll when messages update
  }, [chatHistory, apiCalling]);
  //scrolling at the end logic

  //model select logic://"codellama",//"llama3.2",//"deepseek-r1",
  const handleChange = (
    event: React.SyntheticEvent | null,
    newValue: string | null
  ) => {
    setSelectedModel(newValue || "llama3.2");
    console.log(newValue);
  };

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        color="neutral"
        onClick={() => props.setOpen?.(true)}
      >
        {props.buttonText}
      </Button>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={props.open}
        onClose={() => props.setOpen?.(false)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          vh: "100",
          vw: "100",
          maxWidth: "90%",
          margin: "auto",
        }}
      >
        <Sheet
          variant="outlined"
          sx={{
            // minHeight: "90%",
            height: "80%",
            // overflow:"auto",
            // maxHeight: "90%",
            minWidth: "80%",
            borderRadius: "md",
            p: 5,
            boxShadow: "lg",
          }}
        >
          {/* <ModalClose variant="plain" sx={{ m: 1 }} /> */}
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              // height: "90%",
              // overflow:'auto'
            }}
          >
            <Select defaultValue={selectedModel} onChange={handleChange}>
              {availableModels.map((model) => (
                <Option key={model} value={model}>
                  {model}
                </Option>
              ))}
            </Select>
            <Typography
              component="h2"
              id="modal-title"
              level="h4"
              textColor="inherit"
              sx={{ fontWeight: "lg", mb: 1 }}
            >
              {props.title}
            </Typography>
          </Stack>

          <Stack
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "90%",
              // overflow:'auto'
            }}
          >
            <Stack sx={{ overflow: "auto" }} pb={2} gap={2}>
              {chatHistory.map((chat, index) => (
                <Stack
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Typography
                    sx={{ background: "#ede0df", p: 1, borderRadius: 4 }}
                  >
                    {chat.q}
                  </Typography>
                  <Stack
                    key={index}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      gap: 2,
                    }}
                  >
                    {/* <Typography
                      sx={{
                        width: "90%",
                        background: "#ede0ff",
                        borderRadius: 4,
                      }}
                    >
                      {chat.a}
                    </Typography> */}
                    <ApiResponseFormatter
                      key={index}
                      response={chat.a}
                    ></ApiResponseFormatter>
                  </Stack>
                </Stack>
              ))}
              {apiCalling && (
                <>
                  <Stack
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      m: 10,
                    }}
                  >
                    {/* <Skeleton variant="text" level="body-xs" /> */}
                    <Typography
                      sx={{ background: "#ede0df", p: 1, borderRadius: 4 }}
                    >
                      {question}
                    </Typography>
                    <Stack
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        gap: 2,
                      }}
                    >
                      {streamResponseData ? (
                        <ApiResponseFormatter
                          response={streamResponseData}
                        ></ApiResponseFormatter>
                      ) : (
                        <Skeleton variant="text" level="h1" />
                      )}
                    </Stack>
                  </Stack>
                  <div ref={messagesEndRef} />
                </>
              )}

              <div ref={messagesEndRef} />
            </Stack>

            <Stack
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
              gap={2}
            >
              <Input
                sx={{ width: "90%" }}
                placeholder="Type something..."
                variant="solid"
                value={question}
                disabled={apiCalling}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && question.length > 0) {
                    chatHandler();
                  }
                }}
              ></Input>
              <Button
                variant="solid"
                disabled={question.length === 0 || apiCalling}
                color="neutral"
                onClick={chatHandler}
              >
                send
              </Button>
            </Stack>
          </Stack>
        </Sheet>
      </Modal>
    </React.Fragment>
  );
}
