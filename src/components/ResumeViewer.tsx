
import React from 'react';
interface ResumeViewerProps {
  file: File;
}
export const ResumeViewer: React.FC<ResumeViewerProps> = ({ file }) => {
  const [url, setUrl] = React.useState<string>('');
  React.useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  return (
    <div className="w-full max-w-2xl mx-auto mt-8 rounded-lg overflow-hidden shadow-lg">
      <iframe
        src={url}
        className="w-full h-[600px] border-0"
        title="Resume Preview"
      />
    </div>
  );
};