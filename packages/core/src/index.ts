const sum = (a: number, b: number) => {
  if (process.env.NODE_ENV === 'development') {
    const ab = { foo: 'bar' };
    console.log('Asd', ab);
  }
  return a + b;
};

export default sum;
