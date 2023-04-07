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

  // Diff library doesn't consider special characters in right way.
  // Hack to replace text with some random string other than special chars and reassign it once we get ouput
  const specialCharRegex = /[,@]/g;
  const placeholder = Date.now().toString(5);
  const replacedText1 = inputText.replace(specialCharRegex, placeholder);
  const replacedText2 = modifiedText.replace(specialCharRegex, placeholder);

  const diff = diffWords(replacedText1, replacedText2).map(
    ({ added, removed, value }) => ({
      added: added ? true : undefined,
      removed: removed ? true : undefined,
      value: value.replace(new RegExp(placeholder, "g"), "@"),
    })
  );

  console.log(diff);
  const result = diff.map(function (part, index) {
    const spanStyle = {
      backgroundColor: part.added ? "lightgreen" : part.removed ? "salmon" : "",
    };
    if (part.removed) return "";
    return (
      <span key={index} style={spanStyle}>
        {part.value}
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
      <div ref={diffHighlighter} className="max-h-96 overflow-auto">{result}</div>

      <div className="w-full flex justify-end items-center px-4 gap-2">
        <Button size="large" variant="contained" onClick={generate}>
          Download doc.
        </Button>
        <Button size="large" variant="contained" onClick={handleCopy}>
          Copy
        </Button>
      </div>
    </div>
  );
};

export default FinalNarrative;
