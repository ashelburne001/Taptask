import { useState, useCallback } from 'react';
export function useNFC() {
    const [reading, setReading] = useState(false);
    const [writing, setWriting] = useState(false);
    const [error, setError] = useState(null);
    const isSupported = 'NDEFReader' in window;
    const readTag = useCallback(async () => {
        if (!isSupported) {
            setError('NFC is not supported on this device/browser');
            return null;
        }
        setReading(true);
        setError(null);
        try {
            const reader = new window.NDEFReader();
            await reader.scan();
            return new Promise((resolve) => {
                reader.onreading = (event) => {
                    try {
                        const { message } = event;
                        let data = null;
                        for (const record of message.records) {
                            if (record.recordType === 'text') {
                                const text = new TextDecoder().decode(record.data);
                                data = JSON.parse(text);
                                break;
                            }
                        }
                        setReading(false);
                        resolve(data);
                    }
                    catch (err) {
                        setError('Failed to parse NFC tag data');
                        setReading(false);
                        resolve(null);
                    }
                };
            });
        }
        catch (err) {
            setError(err.message || 'Failed to read NFC tag');
            setReading(false);
            return null;
        }
    }, [isSupported]);
    const writeTag = useCallback(async (data) => {
        if (!isSupported) {
            setError('NFC is not supported on this device/browser');
            return false;
        }
        setWriting(true);
        setError(null);
        try {
            const reader = new window.NDEFReader();
            const encoder = new TextEncoder();
            const records = [
                {
                    recordType: 'text',
                    mediaType: 'text/plain',
                    data: encoder.encode(JSON.stringify(data)),
                },
            ];
            await reader.write({ records });
            setWriting(false);
            return true;
        }
        catch (err) {
            setError(err.message || 'Failed to write to NFC tag');
            setWriting(false);
            return false;
        }
    }, [isSupported]);
    const clearError = useCallback(() => {
        setError(null);
    }, []);
    return {
        isSupported,
        reading,
        writing,
        error,
        readTag,
        writeTag,
        clearError,
    };
}
//# sourceMappingURL=useNFC.js.map