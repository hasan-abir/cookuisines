export const handleErrors = (err: any): string[] => {
  const messages: string[] = [];
  if (err.error) {
    Object.keys(err.error).forEach((key) => {
      const message = err.error[key];

      if (Array.isArray(message)) {
        message.forEach((item) => {
          messages.push(item);
        });
      } else {
        messages.push(message);
      }
    });
  }

  return messages;
};
