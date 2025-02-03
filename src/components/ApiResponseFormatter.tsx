import React from "react";
import { Box, Typography, List, ListItem, Paper } from "@mui/material";

// Utility function to format text
const formatTextBKUP = (text:string) => {
  // Convert Markdown-style **bold** text
  const boldPattern = /\*\*(.*?)\*\*/g;
  let formattedText = text.replace(boldPattern, (_, p1) => `<b>${p1}</b>`);

  // Convert markdown-like bullet points "- text" into proper bullet points
  const bulletPattern = /- (.*?)(\n|$)/g;
  formattedText = formattedText.replace(bulletPattern, (_, p1) => `<li>${p1}</li>`);

  return formattedText;
};


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
    // Handle string response (convert markdown-like format)
    return <Typography dangerouslySetInnerHTML={{ __html: formatText(response) }} />;
  }

  if (Array.isArray(response)) {
    // Handle list/array response
    return (
      <List>
        {response.map((item, index) => (
          <ListItem key={index}>{renderResponse(item)}</ListItem>
        ))}
      </List>
    );
  }

  if (typeof response === "object" && response !== null) {
    // Handle object response
    return (
      <Box>
        {Object.entries(response).map(([key, value], index) => (
          <Box key={index} sx={{ marginBottom: 2 }} >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {key.replace(/_/g, " ")}:
            </Typography>
            <Box sx={{ paddingLeft: 2 }}>{renderResponse(value)}</Box>
          </Box>
        ))}
      </Box>
    );
  }

  return null; // Handle null/undefined
};

// Main Component
export const   ApiResponseFormatter = ({ response }:{response:string}) => {
  if (!response) return null; // Handle empty response

//   sx={{
//     width: "90%",
//     background: "#ede0ff",
//     borderRadius: 4,
//   }}
  return (
    <Paper elevation={3} sx={{ padding: 2, maxWidth: "90%", margin: 1, marginBottom: 2 }}>
      {renderResponse(response)}
    </Paper>
  );
};

// // Example Usage (Simulating API Response)
// const SamplePage = () => {
//   const sampleResponse1 = `
//     Karnataka is a state in India located in the southern region of the country.
//     Here are some key points about Karnataka:
    
//     **Geography**:
//     - Karnataka shares borders with five states: Tamil Nadu, Kerala, Telangana (formerly Hyderabad), Andhra Pradesh, and Odisha.
//     - It is known for its diverse geographical features, including coastal plains, hill ranges, and water bodies like the Kaveri river.
    
//     **Capital**:
//     - The capital city of Karnataka is Bengaluru, also known as Bangalore.
    
//     **Major Cities**:
//     - Other major cities include Mysore, Hubballi, and Chikmagalur.
//   `;

//   const sampleResponse2 = `
//     It seems like you're referring to **"Punyam"**, a Kannada film starring **P. T. Ravindra Varadhan (Ravi)**.
    
//     - The film, produced by Gopinath Srinivas, was released in 1982.
//     - It is known for its music composed by **R. D. Laxmikanth**.
//     - P. T. Ravindra Varadhan was a prominent actor in the Kannada film industry.
//   `;

//   return (
//     <Box>
//       <Typography variant="h4" align="center" sx={{ marginTop: 4 }}>
//         API Response Example
//       </Typography>
//       <ApiResponseFormatter response={sampleResponse1} />
//       <ApiResponseFormatter response={sampleResponse2} />
//     </Box>
//   );
// };

// export default SamplePage;
//  export default ApiResponseFormatter;