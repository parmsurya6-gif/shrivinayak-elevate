import { useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { X, Check } from "lucide-react";

interface Props {
  imageSrc: string;
  aspect?: number; // undefined => free
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
}

const ASPECT_PRESETS: { label: string; value: number | undefined }[] = [
  { label: "Free", value: undefined },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "3:1", value: 3 / 1 },
];

async function cropToBlob(src: string, area: Area): Promise<Blob> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = src;
  });
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(area.width);
  canvas.height = Math.round(area.height);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    img,
    Math.round(area.x),
    Math.round(area.y),
    Math.round(area.width),
    Math.round(area.height),
    0,
    0,
    Math.round(area.width),
    Math.round(area.height)
  );
  return new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b as Blob), "image/png", 0.95)
  );
}

const LogoCropperDialog = ({ imageSrc, aspect: initialAspect, onCancel, onConfirm }: Props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(initialAspect);
  const [pixels, setPixels] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);

  const onCropComplete = useCallback((_c: Area, p: Area) => setPixels(p), []);

  const handleConfirm = async () => {
    if (!pixels) return;
    setBusy(true);
    try {
      const blob = await cropToBlob(imageSrc, pixels);
      onConfirm(blob);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-foreground/70 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-sm">Crop & lock aspect ratio</h3>
          <button onClick={onCancel} className="p-1 rounded hover:bg-secondary">
            <X size={16} />
          </button>
        </div>
        <div className="relative w-full h-[50vh] bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            objectFit="contain"
            restrictPosition={false}
          />
        </div>
        <div className="p-4 space-y-3 border-t border-border">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Aspect:</span>
            {ASPECT_PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setAspect(p.value)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  aspect === p.value
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/70"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground w-12">Zoom</span>
            <input
              type="range"
              min={1}
              max={4}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={onCancel} className="px-3 py-2 rounded-md text-xs bg-secondary hover:bg-secondary/70">
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!pixels || busy}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
            >
              <Check size={14} /> {busy ? "Processing..." : "Apply crop & upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoCropperDialog;