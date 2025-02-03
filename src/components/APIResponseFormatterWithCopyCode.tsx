import React from "react";
import { Box, Typography, List, ListItem, Paper, IconButton } from "@mui/material";
import FileCopyIcon from "@mui/joy/Badge";
// Utility function to format text and detect code blocks
const formatText = (text:string) => {
  if (!text) return "";

  // Convert Markdown-style **bold** text
  const boldPattern = /\*\*(.*?)\*\*/g;
  let formattedText = text.replace(boldPattern, (_, p1) => `<b>${p1}</b>`);

  // Convert markdown-like bullet points "- text" into proper bullet points
  const bulletPattern = /- (.*?)(\n|$)/g;
  formattedText = formattedText.replace(bulletPattern, (_, p1) => `<li>${p1}</li>`);

  // Convert code blocks (```code```)
  const codeBlockPattern = /```(.*?)```/gs;
  formattedText = formattedText.replace(
    codeBlockPattern,
    (_, code) => `<pre style="background:#f4f4f4; padding:10px; border-radius:5px;"><code>${code}</code></pre>`
  );

  return formattedText;
};

// Function to render API response dynamically
const renderResponse = (response:any) => {
  if (typeof response === "string") {
    return <Typography dangerouslySetInnerHTML={{ __html: formatText(response) }} />;
  }

  if (Array.isArray(response)) {
    return (
      <List>
        {response.map((item, index) => (
          <ListItem key={index}>{renderResponse(item)}</ListItem>
        ))}
      </List>
    );
  }

  if (typeof response === "object" && response !== null) {
    return (
      <Box>
        {Object.entries(response).map(([key, value], index) => (
          <Box key={index} sx={{ marginBottom: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {key.replace(/_/g, " ")}:
            </Typography>
            <Box sx={{ paddingLeft: 2 }}>{renderResponse(value)}</Box>
          </Box>
        ))}
      </Box>
    );
  }

  return null; // Handle null/undefined cases
};

// Function to copy code to clipboard
const copyToClipboard = (code:string) => {
  navigator.clipboard.writeText(code).then(() => {
    alert("Code copied to clipboard!");
  }).catch((err) => {
    console.error("Failed to copy: ", err);
  });
};

// Main Component
export const APIResponseFormatterWithCopyCode = ({ response }:{response:string}) => {
  if (!response) return null;

  return (
    <Paper elevation={3} sx={{ padding: 3, maxWidth: "800px", margin: "auto", marginTop: 4 }}>
      {renderResponse(response)}
    </Paper>
  );
};

// Example Usage (Simulating API Response)
const SamplePage = () => {
  const sampleResponse1 = `
    Karnataka is a state in India located in the southern region of the country.
    Here are some key points about Karnataka:
    
    **Geography**:
    - Karnataka shares borders with five states: Tamil Nadu, Kerala, Telangana, Andhra Pradesh, and Odisha.
    - It is known for its diverse geographical features, including coastal plains, hill ranges, and water bodies like the Kaveri river.
    
    **Capital**:
    - The capital city of Karnataka is Bengaluru.

    **Example Code for Swapping Numbers**:
    \`\`\`python
    def swap_numbers(a, b):
        return b, a
    
    num1, num2 = swap_numbers(5, 10)
    print(num1, num2)
    \`\`\`
  `;

  const sampleResponse2 = `
    It seems like you're referring to **"Punyam"**, a Kannada film starring **P. T. Ravindra Varadhan (Ravi)**.
    
    - The film was released in 1982.
    - It is known for its music composed by **R. D. Laxmikanth**.
    
    **Code Example**:
    \`\`\`js
    function swapNumbers(a, b) {
        return [b, a];
    }
    
    console.log(swapNumbers(5, 10));
    \`\`\`
  `;

  // Format and extract code from the sample response
  const extractCode = (text:string) => {
    const codePattern = /```(.*?)```/gs;
    const matches = text.match(codePattern);
    return matches ? matches.map(code => code.replace(/```/g, "")) : [];
  };

  const codeSamples1 = extractCode(sampleResponse1);
  const codeSamples2 = extractCode(sampleResponse2);

  return (
    <Box>
      <Typography variant="h4" align="center" sx={{ marginTop: 4 }}>
        API Response Example
      </Typography>
      
      <APIResponseFormatterWithCopyCode response={sampleResponse1} />
      {codeSamples1.map((code, index) => (
        <Box key={index} sx={{ marginTop: 2 }}>
          <pre style={{ background: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
            <code>{code}</code>
          </pre>
          <IconButton onClick={() => copyToClipboard(code)}>
            <FileCopyIcon />
          </IconButton>
        </Box>
      ))}

      <APIResponseFormatterWithCopyCode response={sampleResponse2} />
      {codeSamples2.map((code, index) => (
        <Box key={index} sx={{ marginTop: 2 }}>
          <pre style={{ background: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
            <code>{code}</code>
          </pre>
          <IconButton onClick={() => copyToClipboard(code)}>
            <FileCopyIcon />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
};

export default SamplePage;
