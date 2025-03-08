import axios from 'axios';

export const parseResume = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('resume', file);
  
  // Add a timestamp to prevent caching
  const timestamp = new Date().getTime();

  try {
    const response = await axios.post(`http://127.0.0.1:5000/upload?t=${timestamp}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    });

    const data = response.data;

    // Log the response for debugging
    console.log('Resume parse response:', data);

    // Ensure data structure is as expected
    const extractedData = data?.data || {};

    // Check if name is present in the response
    if (!extractedData.name) {
      console.warn('Name not found in parsed resume data:', extractedData);
    }

    return {
      name: extractedData.name || '', 
      email: extractedData.emails?.[0] || 'Not found',
      mobile: extractedData.phone_numbers?.[0] || 'Not found',
      parsedText: Object.values(extractedData).flat().join('\n'), // Combine all extracted text
      ...extractedData, // Preserve raw data for debugging
    };
  } catch (error: any) {
    console.error('Error parsing resume:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to parse resume. Please try again.');
  }
};