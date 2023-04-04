import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { SetInputText } from "../reducers/correctionTable/CorrectionTableActions";

function ErrorsContent({ paragraphs, parasContent }) {
  const dispatch = useDispatch();
  let errors = {};
  const highlightedTextRef = useRef(null);

  parasContent.forEach((currentError) => {
    const paraIndex = currentError.ParagraphNum - 1;
    if (!errors[paraIndex]) {
      errors[paraIndex] = [];
    }
    errors[paraIndex].push(currentError);
  });

  const highlightedText = paragraphs.map((para, paraIndex) => {
    let paraErrors = errors[paraIndex] || [];
    let currentPos = 0;
    let elements = [];
    paraErrors.forEach((currentError) => {
      const start = currentError.StartPos;
      const end = currentError.EndPos;
      const errorType = currentError.ErrorType;

      // Add the text leading up to the error
      if (start > currentPos) {
        elements.push(
          <span key={currentPos}> {para.slice(currentPos, start)} </span>
        );
      }

      // Add the highlighted error text
      // let x = index+1;
      let x = parseInt(currentError.id);
      const errorText = para.slice(start, end);
      const highlightIndex = start + errorText.indexOf(currentError.Error);
      elements.push(
        <mark key={start} className={errorType}>
          {" "}
          {errorText}<sup>{x}</sup>{" "}
        </mark>
      );

      // Update the current position
      currentPos = end;
    });

    // Add any remaining text
    if (currentPos < para.length) {
      elements.push(<span key={currentPos}> {para.slice(currentPos)} </span>);
    }

    // Return the paragraph with error highlights
    return <p key={paraIndex}> {elements} </p>;
  });

  useEffect(() => {
    if (highlightedTextRef.current) {
      const concatenatedText = highlightedTextRef.current.innerText;
      dispatch(SetInputText(concatenatedText));
    }
  }, [highlightedTextRef]);

  return (
    <div ref={highlightedTextRef} className="max-h-96 overflow-auto">
      {" "}
      {highlightedText}{" "}
    </div>
  );
}
export default ErrorsContent;
