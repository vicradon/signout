import React, { useState } from "react";
import "../App.css";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import tshirtBG from "../assets/t-shirt1.webp";

export default function Sign() {
  const [message, setMessage] = useState("");
  const { editor, onReady } = useFabricJSEditor();
  const onAddCircle = () => {
    editor?.addCircle();
    editor?.addText();
  };
  const onAddRectangle = () => {
    editor?.addRectangle();
  };

  const addText = (event) => {
    event.preventDefault();

    editor?.addText(message);

    setMessage("");
  };

  return (
    <div id="tshirt-div">
      <button onClick={onAddCircle}>Add circle</button>
      <button onClick={onAddRectangle}>Add Rectangle</button>

      <form onSubmit={addText}>
        <div>
          <label htmlFor="message">Your goodwill message</label>
        </div>
        <input
          value={message}
          onChange={({ target }) => setMessage(target.value)}
          id="message"
          name="message"
          type="text"
        />

        <button type="submit">Add</button>
      </form>

      <img src={tshirtBG} alt="t-shirt" />

      <div id="drawingArea" className="drawing-area">
        <div className="canvas-container">
          <FabricJSCanvas
            id={"canvas"}
            className="sample-canvas"
            onReady={onReady}
          />
        </div>
      </div>
    </div>
  );
}
