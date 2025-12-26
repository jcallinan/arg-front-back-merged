import { useState, useCallback } from "react";
import { message } from "antd";

export const useTemplateDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadTemplate = useCallback(async (templateType: 'flexi' | 'sogas' | 'clearChecks' | 'flexiEmpty' | 'sogasEmpty' | 'sogasSingle'): Promise<boolean> => {
    try {
      setIsDownloading(true);
      
      // Map template types to file names
      const templateFiles = {
        flexi: 'FLEXI_NEW_HEADER.xlsx',
        sogas: 'SOGAS_NEW_HEADERS.xlsx',
        clearChecks: 'Cancelledchecksupload - New-header.xls',
        flexiEmpty: 'flexi_empty_new.xlsx',
        sogasEmpty: 'sogas_new_emptyrow.xlsx',
        sogasSingle: 'single_sogas_new.xlsx'
      };

      const fileName = templateFiles[templateType];
      const templatePath = `/src/assets/template/${fileName}`;
      
      // Fetch the file and create a blob for download
      const response = await fetch(templatePath);
      if (!response.ok) {
        throw new Error(`Template file not found: ${fileName}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create a download link for the template file
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
      
      const templateNames = {
        flexi: 'Flexi',
        sogas: 'Sogas',
        clearChecks: 'Clear Checks',
        flexiEmpty: 'Flexi Empty',
        sogasEmpty: 'Sogas Empty',
        sogasSingle: 'Sogas Single'
      };
      message.success(`${templateNames[templateType]} template downloaded successfully`);
      return true;
    } catch (error) {
      console.error('Template download failed:', error);
      const templateNames = {
        flexi: 'Flexi',
        sogas: 'Sogas',
        clearChecks: 'Clear Checks',
        flexiEmpty: 'Flexi Empty',
        sogasEmpty: 'Sogas Empty',
        sogasSingle: 'Sogas Single'
      };
      message.error(`Failed to download ${templateNames[templateType] || templateType} template`);
      return false;
    } finally {
      setIsDownloading(false);
    }
  }, []);

  return {
    downloadTemplate,
    isDownloading
  };
};
