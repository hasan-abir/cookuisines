export const handleErrors = (err: any): string[] => {
  const messages: string[] = [];
  if (err.error) {
    Object.keys(err.error).forEach((key) => {
      const message = err.error[key];

      if (Array.isArray(message)) {
        message.forEach((item) => {
          messages.push(item + ` - ${key.replaceAll('_', ' ').toUpperCase()}`);
        });
      } else {
        messages.push(message + ` - ${key.replaceAll('_', ' ').toUpperCase()}`);
      }
    });
  }

  return messages;
};
