import React, { useEffect, useRef, useState } from "react";

const Editor = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    let fabricInstance;

    import("fabric").then((fabric) => {
      if (!canvasRef.current) return; // Prevent running if canvasRef is not ready

      //  Dispose of any existing canvas before creating a new one
      if (canvasRef.current.__fabricInstance) {
        console.log("Disposing existing Fabric.js instance...");
        canvasRef.current.__fabricInstance.dispose();
        canvasRef.current.__fabricInstance = null;
      }

      console.log("Initializing Fabric.js Canvas...");
      fabricInstance = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 500,
        backgroundColor: "#f5f5f5",
      });

      canvasRef.current.__fabricInstance = fabricInstance;
      setCanvas(fabricInstance);
    });

    return () => {
      if (fabricInstance) {
        console.log("Cleaning up: Disposing Fabric.js Canvas...");
        fabricInstance.dispose();
        setCanvas(null);
      }
    };
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Photo Editor</h1>
      <canvas ref={canvasRef} style={{ border: "1px solid black" }} />
    </div>
  );
};

export default Editor;