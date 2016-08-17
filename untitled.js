const test = (n, num) => {
  num = num || 1;
  setTimeout(() => {
    if (num <= n) {
      console.log(num);
    }
    num++;
    test(n, num);
  }, 1000);
}

test(5);