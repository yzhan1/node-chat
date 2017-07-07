const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    const from = 'Peter';
    const text = 'Some message';
    const message = generateMessage(from, text);
    
    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from, text});
  });  
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    const from = 'Admin';
    const latitude = 13;
    const longitude = 32;
    const url = 'https://www.google.com/maps?q=13,32';
    const message = generateLocationMessage(from, latitude, longitude);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from, url});
  });
});