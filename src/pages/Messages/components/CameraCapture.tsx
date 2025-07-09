import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Camera, X, RotateCcw } from 'lucide-react';

interface CameraCaptureProps {
  onPhotoCapture: (photoBlob: Blob) => void;
  className?: string;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onPhotoCapture,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      toast({
        title: "Erreur de caméra",
        description: "Impossible d'accéder à la caméra",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCapturedPhoto(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const photoUrl = URL.createObjectURL(blob);
        setCapturedPhoto(photoUrl);
      }
    }, 'image/jpeg', 0.8);
  };

  const confirmPhoto = () => {
    if (!canvasRef.current) return;

    canvasRef.current.toBlob((blob) => {
      if (blob) {
        onPhotoCapture(blob);
        setIsOpen(false);
        stopCamera();
        toast({
          title: "Photo capturée",
          description: "La photo a été ajoutée au message"
        });
      }
    }, 'image/jpeg', 0.8);
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    if (capturedPhoto) {
      URL.revokeObjectURL(capturedPhoto);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      startCamera();
    } else {
      stopCamera();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          type="button" 
          className={`h-8 w-8 sm:h-10 sm:w-10 p-0 text-[#5f6368] hover:bg-[#f8f9fa] rounded-full ${className}`}
        >
          <Camera className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Prendre une photo</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            {!capturedPhoto ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 object-cover rounded-lg bg-gray-100"
              />
            ) : (
              <img
                src={capturedPhoto}
                alt="Photo capturée"
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
          
          <div className="flex gap-2">
            {!capturedPhoto ? (
              <Button onClick={capturePhoto} className="flex-1">
                <Camera className="w-4 h-4 mr-2" />
                Capturer
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={retakePhoto}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reprendre
                </Button>
                <Button onClick={confirmPhoto}>
                  Confirmer
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};