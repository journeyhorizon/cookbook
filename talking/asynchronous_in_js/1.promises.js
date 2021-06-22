const myLoggingPromise = msg => new Promise((resolve) => {
  console.log(msg);
  resolve(null);
});


const main = () => {
  setTimeout(() => {
    console.log('who')
  }, 0);
  myLoggingPromise('foo');
  myLoggingPromise('bar');
  console.log('naked foo');
}

main();