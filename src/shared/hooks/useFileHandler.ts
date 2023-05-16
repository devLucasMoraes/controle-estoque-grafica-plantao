import { XMLParser } from 'fast-xml-parser';
import { useEffect, useRef, useState } from 'react';
import { INfeProc } from '../interfaces';

export const useFileHandler = () => {
    const [fileData, setFileData] = useState<INfeProc>();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const parser = new XMLParser({
            numberParseOptions: {
                eNotation: false,
                leadingZeros: false,
                hex: false
            }
        });

        const reader = new FileReader();
        reader.onload = () => {
            const fileContent = reader.result?.toString() ?? '';
            const jsonObj: INfeProc = parser.parse(fileContent);
            setFileData(jsonObj);
        };
        reader.readAsText(file);
    };

    /*     useEffect(() => {
            if (fileInputRef.current) {
                const fileInput = fileInputRef.current;
    
                const handleChange = (e: Event) => {
                    handleFileChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
                };
    
                fileInput.addEventListener('change', handleChange);
    
                return () => {
                    fileInput.removeEventListener('change', handleChange);
                };
            }
        }, []); */

    return {
        fileData,
        fileInputRef,
        handleFileChange
    };
};
