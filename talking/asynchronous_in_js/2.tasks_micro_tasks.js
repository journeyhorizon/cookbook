const main = () => {
  console.log('script start');

  setTimeout(() => {
    Promise.resolve()
      .then(() => {
        console.log('setTimeout');
      })
  }, 0);

  setTimeout(() => {
    console.log('setTimeout2');
  }, 0);

  Promise.resolve()
    .then(() => {
      console.log('promise1');
    })
    .then(() => {
      console.log('promise2');
    });

  console.log('script end');
}

main();