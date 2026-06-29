import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, Share2 } from "lucide-react";

export default function QRGenerator({ fabricId, productName, size = 200 }) {
  const qrRef = useRef(null);

  const qrValue = JSON.stringify({
    type: "FabricID",
    id: fabricId,
    url: `${window.location.origin}/verify?id=${fabricId}`,
    version: "1.0",
  });

  function downloadQR() {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    canvas.width = size * 2;
    canvas.height = size * 2 + 60;

    img.onload = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(img, 0, 0, size * 2, size * 2);

      ctx.fillStyle = "#1e3a5f";
      ctx.font = "bold 14px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(fabricId, canvas.width / 2, size * 2 + 25);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px Inter, sans-serif";
      ctx.fillText("Scan to verify authenticity", canvas.width / 2, size * 2 + 45);

      const link = document.createElement("a");
      link.download = `FabricID-${fabricId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  }

  async function shareQR() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `FabricID: ${fabricId}`,
          text: `Verify this textile product: ${productName}`,
          url: `${window.location.origin}/verify?id=${fabricId}`,
        });
      } catch {
        // user cancelled
      }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/verify?id=${fabricId}`);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div ref={qrRef} className="bg-white p-4 rounded-2xl shadow-md border border-gray-100">
        <QRCodeSVG
          value={qrValue}
          size={size}
          level="H"
          includeMargin={false}
          fgColor="#1e3a5f"
          bgColor="#ffffff"
        />
      </div>

      <div className="mt-3 text-center">
        <p className="font-mono text-sm font-semibold text-primary">{fabricId}</p>
        <p className="text-xs text-text-muted mt-0.5">Scan to verify authenticity</p>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={downloadQR}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
        <button
          onClick={shareQR}
          className="flex items-center gap-1.5 px-4 py-2 bg-accent/10 text-accent rounded-lg text-sm font-medium hover:bg-accent/20 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>
    </div>
  );
}
