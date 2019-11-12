const fs = require('fs')
const _ = require('lodash')
const compose = _.flowRight

class Functor {
  constructor(val) {
    this.val = val
  }
  map(f) {
    return new Functor(f(val))
  }
  static of(val) {
    return new Functor(val)
  }
}

class Monad extends Functor {
  join() {
    return this.val()
  }
  flatMap(f) {
    return this.map(f).join()
  }
}

class IO extends Monad {
  static of(val) {
    return new IO(val)
  }
  map(f) {
    return IO.of(compose(f, this.val))
  }
}

function readFile(filename) {
  return IO.of(function() {
    return fs.readFileSync(filename, 'utf-8')
  })
}
function print(x) {
  return IO.of(function() {
    return x + 'World'
  })
}
function tail(x) {
  return IO.of(function() {
    return x + '!'
  })
}
const result = readFile('./index.txt').flatMap(print).flatMap(tail)
console.log(result)
console.log(result.val)
console.log(result.val.toString())
console.log(result.val()) // 注意：直到 result.val 函数被执行时，才会进行文件读取操作
