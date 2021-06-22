const main = () => {
  setTimeout(() => {
    Promise.resolve(console.log('foo'));
    console.log('who')
  }, 0);
  setTimeout(() => {
    Promise.resolve(console.log('bar'));
    console.log('wto')
  }, 0);
}

main();