import React, {useState, useEffect} from 'react';
import { Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { ServiceToggleProps, modelOptions } from '../utils/types';

const ServiceToggle: React.FC<ServiceToggleProps> = ({ selectedService, setAiService, selectedModel, setModel }) => {
    const [modelList, setModelList] = useState<string[]>([]);

    useEffect(() => {
        const modelsForService = modelOptions[selectedService] || [];
        setModelList(modelsForService);

          // Only set the model if it's available in the list, otherwise use the first available model
        if (modelsForService.length > 0 && !modelsForService.includes(selectedModel)) {
            setModel(modelsForService[0]);
        }
    }, [selectedService, setModel]);

    return (
        <Box sx={{display: 'flex', gap: '10px', padding: '10px'}}>
            <FormControl variant="outlined" size="small">
            <InputLabel>AI Type</InputLabel>
            <Select
                value={selectedService}
                onChange={(e) => setAiService(e.target.value as string)}
                label="Chat Service"
            >
                <MenuItem value="OpenAI">OpenAI</MenuItem>
                <MenuItem value="Anthropic">Anthropic</MenuItem>
            </Select>
            </FormControl>

        {/* Model Dropdown */}
        <FormControl variant="outlined" size="small">
            <InputLabel>Model</InputLabel>
            <Select
            value={modelList.length > 0 ? selectedModel : ''}
            onChange={(e) => setModel(e.target.value as string)}
            label="Model"
            >
            {modelList.map((model) => (
                <MenuItem key={model} value={model}>
                {model}
                </MenuItem>
            ))}
            </Select>
        </FormControl>
        </Box>
    );
};

export default ServiceToggle;
