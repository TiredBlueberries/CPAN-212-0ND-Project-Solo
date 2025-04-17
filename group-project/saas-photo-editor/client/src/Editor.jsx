import React, { useEffect, useRef, useState, useCallback } from "react";

const Editor = () => {
  const canvasRef = useRef(null);
  const fabricInstanceRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(true);

  // Drawing state
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);

  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isSaving, setIsSaving] = useState(false);

  const saveToHistoryRef = useRef();
  saveToHistoryRef.current = (canvas) => {
    const json = JSON.stringify(canvas.toJSON());
    setHistory(prev => [...prev.slice(0, historyIndex + 1), json]);
    setHistoryIndex(prev => prev + 1);
  };

  useEffect(() => {
    import("fabric").then((fabric) => {
      if (!canvasRef.current) return;
      if (canvasRef.current.__fabric) {
        canvasRef.current.__fabric.dispose();
      }

      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 500,
        backgroundColor: "#ffffff",
        isDrawingMode: true,
      });

      fabricCanvas.renderAll();
      saveToHistoryRef.current(fabricCanvas);

      fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
      fabricCanvas.freeDrawingBrush.color = brushColor;
      fabricCanvas.freeDrawingBrush.width = brushSize;

      fabricInstanceRef.current = fabric;
      canvasRef.current.__fabric = fabricCanvas;

      const handlePathCreated = () => {
        saveToHistoryRef.current(fabricCanvas);
        fabricCanvas.requestRenderAll();
      };
      
       // History tracking on path creation
      fabricCanvas.on("path:created", handlePathCreated);

      return () => {
        fabricCanvas.off("path:created", handlePathCreated);
      };
    });

    return () => {
      if (canvasRef.current?.__fabric) {
        canvasRef.current.__fabric.dispose();
      }
    };
  }, []);


   // Save drawing to backend
  const saveDrawing = async () => {
    if (!canvasRef.current?.__fabric) return;
    
    setIsSaving(true);
    try {
      const imageData = canvasRef.current.__fabric.toDataURL('png');
      const token = localStorage.getItem('token');
      const title = prompt('Enter drawing title:', 'Untitled');
  
      const response = await fetch('http://localhost:5000/api/drawings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ imageData, title }),
      });
  
      if (!response.ok) throw new Error('Save failed');
      alert('Drawing saved successfully!');
    } catch (error) {
      alert('Failed to save: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };
  // Effect to update brush color dynamically
  useEffect(() => {
    const canvas = canvasRef.current?.__fabric;
    if (canvas?.isDrawingMode) {
      canvas.freeDrawingBrush.color = brushColor;
      canvas.requestRenderAll();
    }
  }, [brushColor]);

  // Effect to update brush size dynamically
  useEffect(() => {
    const canvas = canvasRef.current?.__fabric;
    if (canvas?.isDrawingMode) {
      canvas.freeDrawingBrush.width = brushSize;
      canvas.requestRenderAll();
    }
  }, [brushSize]);

  // Function to load a previous state from history
  const loadStateFromHistory = useCallback((index) => {
    const canvas = canvasRef.current?.__fabric;
    if (!canvas || index < 0 || index >= history.length) return;

    canvas.loadFromJSON(JSON.parse(history[index]), () => {
      canvas.renderAll();
      canvas.requestRenderAll();
      canvas.isDrawingMode = isDrawing;
    });
  }, [history, isDrawing]);

  // Effect to load history when index changes
  useEffect(() => {
    loadStateFromHistory(historyIndex);
  }, [historyIndex, loadStateFromHistory]);

  // Toggle drawing mode on or off
  const toggleDrawing = () => {
    const canvas = canvasRef.current?.__fabric;
    if (canvas) {
      canvas.isDrawingMode = !canvas.isDrawingMode;
      setIsDrawing(canvas.isDrawingMode);
      canvas.requestRenderAll();
    }
  };

  // Undo function to go back in history
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
    }
  };

  // Redo function to go forward in history
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Drawing Canvas</h1>
      <canvas 
        ref={canvasRef} 
        style={{ border: '2px solid #333', borderRadius: '8px', marginBottom: '20px' }}
      />
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '20px' }}>
        <button onClick={toggleDrawing}>{isDrawing ? " Disable Drawing" : " Enable Drawing"}</button>
        <button onClick={undo} disabled={historyIndex <= 0}> Undo</button>
        <button onClick={redo} disabled={historyIndex >= history.length - 1}> Redo</button>
        <button onClick={saveDrawing} disabled={isSaving}>{isSaving ? ' Saving...' : ' Save Drawing'}</button>
        <input type="color" value={brushColor} onChange={e => setBrushColor(e.target.value)} />
        <input type="range" min="1" max="20" value={brushSize} onChange={e => setBrushSize(Number(e.target.value))} />
        <span>Size: {brushSize}px</span>
      </div>
    </div>
  );
};

export default Editor;
