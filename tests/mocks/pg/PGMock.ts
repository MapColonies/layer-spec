const queryMock = jest.fn();

const connectMock = jest.fn(() => {
  return {
    query: queryMock,
  };
});

const pgPoolMock = jest.fn(() => {
  return {
    connect: connectMock,
  };
});

export { pgPoolMock, queryMock, connectMock };
