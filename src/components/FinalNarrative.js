import React, { useCallback, useRef } from "react";
import { diffWords } from "diff";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import { saveAs } from "file-saver";
import copy from "copy-to-clipboard";
import { Document, Packer, Paragraph, TextRun } from "docx";

const FinalNarrative = () => {
  const { inputText, modifiedText } = useSelector(
    (state) => state.correctionTableReducer
  );

  const diff = diffWords(inputText, modifiedText);
  const result = diff.map(function (part, index) {
    const spanStyle = {
      backgroundColor: part.added ? "lightgreen" : part.removed ? "salmon" : "",
    };
    if (part.removed) return "";
    return (
      <span key={index} style={spanStyle}>
        {" "}
        {part.value}{" "}
      </span>
    );
  });

  const generate = () => {
    const content = diffHighlighter.current.innerText;
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun(content)],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "FinalNarrative.docx");
      console.log("Document created successfully");
    });
  };

  const diffHighlighter = useRef(null);
  const handleCopy = useCallback(() => {
    const content = diffHighlighter.current.innerText;
    copy(content);
  }, [result]);

  return (
    <div id="diff-highlighter">
      <div ref={diffHighlighter} className="max-h-96 overflow-auto">
        {" "}
        {result}{" "}
      </div>
      <div className="w-full flex justify-end items-center px-4 gap-2">
        <Button size="large" variant="contained" onClick={generate}>
          Download doc.{" "}
        </Button>{" "}
        <Button size="large" variant="contained" onClick={handleCopy}>
          Copy{" "}
        </Button>{" "}
      </div>{" "}
    </div>
  );
};

export default FinalNarrative;
