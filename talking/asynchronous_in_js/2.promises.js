const main = () => {
  setTimeout(() => {
    Promise.resolve(console.log('foo'));
    console.log('who')
  }, 0);
  Promise.resolve(console.log('bar'))
}

main();