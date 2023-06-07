import React, { FC, useRef } from 'react';

interface IImagePicker {
  inputID?: string;
  setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>;
  selectedImage: string | null;
}

export const ImagePicker: FC<IImagePicker> = ({ inputID, selectedImage, setSelectedImage }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageSelect = () => {
    if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files.length > 0) {
      const file = fileInputRef.current.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChooseButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} id={inputID} className="hidden" />

      <div className="relative">
        <button onClick={handleChooseButtonClick} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Choose Image
        </button>
      </div>

      {selectedImage && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Selected Image:</h3>
          <img src={selectedImage} alt="Selected" className="mt-2 rounded-md" />
        </div>
      )}
    </>
  );
};
