const foo = async () => {
  await doSth();
  console.trace('test');
}

const fooWithoutAwait = async () => {
  doSth();
  console.trace('test');
}

const bar = async () => {
  console.trace('test2');
}

const doSth = async () => {
  console.log('We are doing something alright');
  console.log('We do?');
  console.log('Yeah, We do!');
}

const main = async () => {
  foo();
  bar()
}

const mainWithoutAwait = async () => {
  fooWithoutAwait();
  bar()
}


main();
mainWithoutAwait();


