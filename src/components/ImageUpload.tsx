import { Box } from '@mui/material';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

type Props = {
  imageFile: File | null;
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  existingImageUrl?: string;
};

const ImageUpload: React.FC<Props> = ({ imageFile, setImageFile, existingImageUrl = '' }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setImageFile(acceptedFiles[0]);
    },
    [setImageFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  // if existingImageUrl is not empty and imageFile is null, then we extract the url file name which is last part of the url
  const existingImageName = existingImageUrl && !imageFile ? existingImageUrl.split('/').pop() : '';
  const existingImageNameLength = existingImageName?.length ?? 0;
  return (
    <Box
      {...getRootProps()}
      sx={{
        border: '2px dashed #ccc',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        marginTop: '20px',
      }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the image here ...</p>
      ) : (
        <p>Drag &apos;n&apos; drop an image here, or click to select an image</p>
      )}
      {imageFile && <p>{imageFile.name}</p>} {/* Display selected file name */}
      {existingImageNameLength > 0 && <p>{existingImageName}</p>}
    </Box>
  );
};

export default ImageUpload;
