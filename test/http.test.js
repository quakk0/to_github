import axios from 'axios';
import { expect } from 'chai';

describe('HTTP Integration Tests', () => {
  it('GET / should return 200 and contain <form>', async () => {
    const res = await axios.get('http://localhost:3000');
    expect(res.status).to.equal(200);
    expect(res.data).to.include('<form');
  });

  it('POST /search should redirect to /result on valid input', async () => {
    const res = await axios.post(
      'http://localhost:3000/search',
      new URLSearchParams({ term: 'safe input' }),
      {
        maxRedirects: 0,
        validateStatus: () => true
      }
    );
    expect(res.status).to.equal(302);
    expect(res.headers.location).to.include('/result');
  });

  it('POST /search should redirect to / on XSS input', async () => {
    const res = await axios.post(
      'http://localhost:3000/search',
      new URLSearchParams({ term: '<script>alert(1)</script>' }),
      {
        maxRedirects: 0,
        validateStatus: () => true
      }
    );
    expect(res.status).to.equal(302);
    expect(res.headers.location).to.equal('/');
  });
});
