import { Box } from '@mui/material';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

type Props = {
  imageFile: File | null;
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
};

const ImageUpload: React.FC<Props> = ({ imageFile, setImageFile }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setImageFile(acceptedFiles[0]);
    },
    [setImageFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
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
    </Box>
  );
};

export default ImageUpload;
