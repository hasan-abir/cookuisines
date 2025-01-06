import { handleErrors } from './error.utils';

describe('Error utils', () => {
  beforeEach(() => {});

  it('should be created', () => {
    expect(handleErrors).toBeTruthy();
  });

  it('should return empty array', () => {
    const messages = handleErrors({});
    expect(messages.length).toEqual(0);
  });

  it('should return the messages', () => {
    const err = {
      error: {
        detail: 'Some error msg',
        title: ['Some title msg', 'Some other title msg'],
        quantity: ['Some quality msg'],
      },
    };
    const messages = handleErrors(err);
    expect(messages.length).toEqual(4);
    expect(messages[0]).toEqual(err.error.detail);
    expect(messages[1]).toEqual(err.error.title[0]);
    expect(messages[2]).toEqual(err.error.title[1]);
    expect(messages[3]).toEqual(err.error.quantity[0]);
  });
});
