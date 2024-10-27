export const fetchAIResponse = async ( chatHistory : { role: string; content: string }[], selectedService: string, serviceModel: string) => {

  const apiUrl = selectedService === 'OpenAI'
    ? '/api/openai/v1/chat/completions'
    : '/api/anthropic/v1/messages';

  const apiKey = selectedService === 'OpenAI'
    ? import.meta.env.VITE_OPENAI_API_KEY
    : import.meta.env.VITE_ANTHROPIC_API_KEY;
  

  const requestBody = {
      model: serviceModel,
      messages: chatHistory,
      max_tokens: 150,
      stream: true
  }
  
  const requestHeaders: Record<string, string> = selectedService === 'OpenAI'
    ? {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    : {
        'x-api-key': `${apiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      };
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(requestBody),
    });
  
  if (!response.body) {
      throw new Error('No response body found');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';
    let done = false;
    let buffer = '';

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      const chunk = decoder.decode(value, { stream: !done });
      buffer += chunk;

    // Process each line separately (since the response contains multiple data lines)
    const lines = buffer.split('\n');

    // Keep the last line in the buffer in case it's incomplete
    buffer = lines.pop() || '';

    for (const line of lines) {

      // Stop processing if the OpenAi API sends the 'data: [DONE]' message
      if (line === 'data: [DONE]') {
        return result;
      }

      // Stop processing if the Anthropic API sends the 'event: message_stop' event
      if (line.includes('message_stop')) {
          return result; 
        }

      // Strip the "data: " prefix
      if (line.startsWith('data: ')) {
          const jsonLine = line.replace('data: ', '');

          try {
            const parsed = JSON.parse(jsonLine);

            // Check if there's valid content to append
            const content = parsed?.choices?.[0]?.delta?.content || parsed?.delta?.text;
            if (content) {
              result += content; 
            }
          } catch (err) {
            console.error('Failed to parse line:', err, 'Original line:', jsonLine);
          }
        }
      }
    }
    return result; 
    } catch (error) {
      return 'Error fetching response.';
    }
  };
  