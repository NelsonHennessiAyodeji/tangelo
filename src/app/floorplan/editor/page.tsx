"use client";

import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";
import {
  LayoutGrid,
  Save,
  Circle,
  RectangleHorizontal,
  Type,
  Trash2,
  DoorOpen,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockWeddingDetails } from "@/lib/mockData";

const FloorPlanEditor = ({ eventName }: { eventName: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const { toast } = useToast();
  const storageKey = `floorplanLayout-${eventName}`;

  const addObjectWithLabel = (
    obj: fabric.Object,
    text: string,
    options: any = {}
  ) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    obj.set({ originX: "center", originY: "center" });

    const label = new fabric.Textbox(text, {
      width: obj.width ? obj.width * 0.9 : 100,
      fontSize: 14,
      textAlign: "center",
      originX: "center",
      originY: "center",
      selectable: true,
      evented: true,
    });

    const group = new fabric.Group([obj, label], {
      left: options.left || 100,
      top: options.top || 100,
      ...options,
    });

    canvas.add(group);
  };

  const addLabel = (text: string, options: fabric.ITextboxOptions = {}) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const label = new fabric.Textbox(text, {
      left: 150,
      top: 150,
      width: 150,
      fontSize: 20,
      textAlign: "center",
      ...options,
    });
    canvas.add(label);
  };

  const addRoundTable = (label = "Table", options: any = {}) => {
    const table = new fabric.Circle({
      radius: 35,
      fill: "rgba(240, 128, 128, 0.7)",
      stroke: "#F08080",
      strokeWidth: 2,
    });
    addObjectWithLabel(table, label, {
      left: options.left || 50,
      top: options.top || 50,
    });
  };

  const addRectTable = () => {
    const rect = new fabric.Rect({
      width: 150,
      height: 60,
      fill: "#fff",
      stroke: "#888",
      strokeWidth: 1,
    });
    addObjectWithLabel(rect, "Service Area", { left: 200, top: 200 });
  };

  const addEntrance = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const frame = new fabric.Rect({
      width: 120,
      height: 40,
      fill: "transparent",
      stroke: "#ccc",
      strokeWidth: 2,
      originX: "center",
      originY: "center",
    });

    const door1 = new fabric.Rect({
      width: 50,
      height: 3,
      fill: "#ccc",
      originX: "center",
      originY: "center",
      top: 0,
      left: -30,
    });
    const door2 = new fabric.Rect({
      width: 50,
      height: 3,
      fill: "#ccc",
      originX: "center",
      originY: "center",
      top: 0,
      left: 30,
    });

    // Create a single group for all visual elements of the entrance
    const entranceShape = new fabric.Group([frame, door1, door2], {
      originX: "center",
      originY: "center",
    });

    addObjectWithLabel(entranceShape, "ENTRANCE", { left: 200, top: 300 });
  };

  const loadDefaultTemplate = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.clear();

    // Main Stage
    const mainStage = new fabric.Rect({
      width: 200,
      height: 80,
      fill: "#fff",
      stroke: "#ccc",
      strokeWidth: 2,
    });
    addObjectWithLabel(mainStage, "Main Stage", { left: 400, top: 50 });

    // Walkway
    const walkway = new fabric.Rect({
      width: 80,
      height: 500,
      fill: "rgba(0,0,0,0.05)",
      stroke: "rgba(0,0,0,0.1)",
      strokeDashArray: [5, 5],
    });
    canvas.add(walkway.set({ left: 460, top: 150 }));

    // Dance Floor
    const danceFloor = new fabric.Rect({
      width: 250,
      height: 200,
      fill: "#fff",
      stroke: "#ccc",
      strokeWidth: 2,
    });
    addObjectWithLabel(danceFloor, "DANCE FLOOR", { left: 375, top: 300 });

    // DJ Booth
    const djBooth = new fabric.Rect({
      width: 100,
      height: 60,
      fill: "#fff",
      stroke: "#ccc",
      strokeWidth: 2,
    });
    addObjectWithLabel(djBooth, "DJ Booth", { left: 100, top: 50 });

    // Food Vendors Area
    const foodArea = new fabric.Rect({
      width: 180,
      height: 70,
      fill: "#fff",
      stroke: "#ccc",
      strokeWidth: 2,
    });
    addObjectWithLabel(foodArea, "Food Vendors", { left: 780, top: 650 });

    // Entrance
    const entranceFrame = new fabric.Rect({
      width: 120,
      height: 40,
      fill: "transparent",
      stroke: "#ccc",
      strokeWidth: 2,
      originX: "center",
      originY: "center",
    });
    const entranceDoor1 = new fabric.Rect({
      width: 50,
      height: 3,
      fill: "#ccc",
      originX: "center",
      originY: "center",
      top: 0,
      left: -30,
    });
    const entranceDoor2 = new fabric.Rect({
      width: 50,
      height: 3,
      fill: "#ccc",
      originX: "center",
      originY: "center",
      top: 0,
      left: 30,
    });
    const entranceShape = new fabric.Group(
      [entranceFrame, entranceDoor1, entranceDoor2],
      { originX: "center", originY: "center" }
    );
    addObjectWithLabel(entranceShape, "ENTRANCE", { left: 440, top: 700 });

    // Guest Tables
    for (let i = 0; i < 3; i++) {
      addRoundTable(`Table ${i + 1}`, { left: 150, top: 250 + i * 150 });
      addRoundTable(`Table ${i + 4}`, { left: 750, top: 250 + i * 150 });
    }

    canvas.bringToFront(walkway);
    canvas.renderAll();
    toast({
      title: "Template Loaded",
      description: `A default floorplan has been loaded for ${eventName}.`,
    });
  };

  const saveLayout = () => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      const json = canvas.toJSON();
      localStorage.setItem(storageKey, JSON.stringify(json));
      toast({
        title: "Layout Saved",
        description: `Floorplan for ${eventName} has been saved to your browser.`,
      });
    }
  };

  const clearCanvas = () => {
    fabricCanvasRef.current?.clear();
    localStorage.removeItem(storageKey);
    toast({
      title: "Canvas Cleared",
      description: `The floorplan for ${eventName} has been cleared. The default template will load on the next refresh.`,
      variant: "destructive",
    });
  };

  useEffect(() => {
    const initializeCanvas = () => {
      if (canvasRef.current) {
        const canvas = new fabric.Canvas(canvasRef.current, {
          width: 1000,
          height: 750,
          backgroundColor: "#f8f9fa",
          selection: true,
        });
        fabricCanvasRef.current = canvas;

        canvas.on("mouse:dblclick", (options) => {
          if (options.target && options.target.type === "group") {
            const group = options.target as fabric.Group;
            const items = group.getObjects();
            const textObject = items.find(
              (obj) => obj.type === "textbox"
            ) as fabric.Textbox;

            if (textObject) {
              group.removeWithUpdate(textObject);
              textObject.enterEditing();
              textObject.selectAll();

              textObject.on("editing:exited", () => {
                group.addWithUpdate(textObject);
                canvas.renderAll();
              });

              canvas.add(textObject);
              canvas.setActiveObject(textObject);
              canvas.renderAll();
            }
          } else if (options.target && options.target.type === "textbox") {
            const textObject = options.target as fabric.Textbox;
            textObject.enterEditing();
            textObject.selectAll();
            canvas.renderAll();
          }
        });

        const savedLayout = localStorage.getItem(storageKey);
        if (savedLayout) {
          canvas.loadFromJSON(JSON.parse(savedLayout), () => {
            canvas.renderAll();
            toast({
              title: "Layout Restored",
              description: `Your saved floorplan for ${eventName} has been loaded.`,
            });
          });
        } else {
          loadDefaultTemplate();
        }
      }
    };
    initializeCanvas();
    return () => {
      fabricCanvasRef.current?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventName]); // Re-initialize canvas when eventName changes

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <Card className="w-full md:w-1/4 shadow-lg">
        <CardHeader>
          <CardTitle>Tools</CardTitle>
          <CardDescription>
            Add elements to your floorplan. Double-click text to edit.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => addRoundTable()} className="w-full">
            <Circle className="mr-2" /> Add Round Table
          </Button>
          <Button onClick={addRectTable} className="w-full">
            <RectangleHorizontal className="mr-2" /> Add Rect Table
          </Button>
          <Button onClick={() => addLabel("New Label")} className="w-full">
            <Type className="mr-2" /> Add Text Label
          </Button>
          <Button onClick={addEntrance} className="w-full">
            <DoorOpen className="mr-2" /> Add Entrance
          </Button>
          <Button
            onClick={saveLayout}
            variant="outline"
            className="w-full mt-8"
          >
            <Save className="mr-2" /> Save Layout
          </Button>
          <Button
            onClick={loadDefaultTemplate}
            variant="outline"
            className="w-full"
          >
            Load Default Template
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2" /> Clear Canvas
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear the entire canvas?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone and will remove all objects from
                  the floorplan for {eventName}, including your saved layout.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={clearCanvas}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Clear Canvas
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
      <div className="flex-grow">
        <canvas
          ref={canvasRef}
          className="border-2 border-dashed rounded-lg w-full h-full"
        />
      </div>
    </div>
  );
};

export default function FloorplanEditorPage() {
  const events = mockWeddingDetails.events;
  const [activeEvent, setActiveEvent] = useState(events[0]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Interactive Floorplan Editor"
        description="Design your event layout. Select an event tab, then add, drag, and resize objects."
        icon={LayoutGrid}
      />
      <Tabs
        value={activeEvent}
        onValueChange={setActiveEvent}
        className="w-full"
      >
        <TabsList className={`grid w-full grid-cols-${events.length}`}>
          {events.map((event) => (
            <TabsTrigger key={event} value={event}>
              {event}
            </TabsTrigger>
          ))}
        </TabsList>
        {events.map((event) => (
          <TabsContent key={event} value={event} className="mt-6">
            <FloorPlanEditor eventName={event} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
